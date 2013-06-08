Ti.include('lib/sha1.js');
Ti.include('lib/oauth.js');
var oauth_client = function() {
 
    // You will get this key and secret when you create the application in LinkedIn or twitter.
    var CONSUMER_KEY = '0lcyhljizz3t';
    var CONSUMER_SECRET = '4ab4aiQaS4R50k4A';
    /*var CONSUMER_KEY = '4WfPB1giHlekFnEc5e8pag';
    var CONSUMER_SECRET = 'tSZW1nQcfqjhmsdOoG3vvmNtAI1YUdnwzYnOGtn2yM';*/
   
    // these are the linkedIn REST API
    var REQUEST_TOKEN_URL = 'https://api.linkedin.com/uas/oauth/requestToken?scope=r_basicprofile+r_emailaddress+r_network+w_messages+rw_nus';
    var AUTHORIZE_URL = 'https://api.linkedin.com/uas/oauth/authorize';
    var ACCESS_TOKEN_URL = 'https://api.linkedin.com/uas/oauth/accessToken?';
    var ACCESS_PROFILE_URL = 'http://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)?format=json'; 
    var GET_CONNECTIONS_URL = 'http://api.linkedin.com/v1/people/~/connections:(id,first-name,last-name,picture-url,apiStandardProfileRequest)?format=json';
   
    var SEND_INVITION_URL   = 'http://api.linkedin.com/v1/people/~/mailbox';
    
   var POST_MESSAGE_URL = 'https://api.linkedin.com/v1/people/~/shares';
    //var POST_MESSAGE_URL = 'http://api.linkedin.com/v1/people/~/shares?twitter-post=true';
    
       // these are the twitter REST API
    /*var REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
    var AUTHORIZE_URL = 'https://api.twitter.com/oauth/authorize';
    var ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';*/
         
       // the accessor is used when communicating with the OAuth libraries to sign the messages
    var accessor = {
        consumerSecret : CONSUMER_SECRET,
        tokenSecret : ''
    };
 
    var pin = null;
    var oauth_token = null;
    var oauth_token_secret = null;
 
    //@method get_oauth_token
    this.get_oauth_token = function() {
        return oauth_token;
    };
     
     //@method get_oauth_token_secret
    this.get_oauth_token_secret = function() {
        return oauth_token_secret;
    };
 
     //@method get_pin
    this.get_pin = function() {
        return pin;
    };
 
    //@method get_pin
    this.set_pin = function(html) {
 
        // for Twitter
        //var regExp = '<code>(.*?)</code>';
 
        // for linkedIn
        var regExp = /<div class="access-code">(.*?)<\/div>/;
 
        var result = RegExp(regExp).exec(html);
        if (result == null || result.length < 2) {
            pin = null;
            Ti.API.debug('Result : ' + result);
            return null;
        }
        pin = result[1];
        return pin;
    }
    
    
    
    
     /**
 * 1st step of oAuth.
 * @method request_token
 */
this.request_token = function(complete) {
    var message = {
        action : REQUEST_TOKEN_URL,
        method : 'POST',
        parameters : []
    };
 
    message.parameters.push(['oauth_consumer_key', CONSUMER_KEY]);
    message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
 
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
 
    var client = Ti.Network.createHTTPClient();
    client.open('POST', REQUEST_TOKEN_URL, true);
    client.setTimeout(999999);
    client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
    client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));
 
    client.onload = function() {
    	
        Ti.API.debug('[load]' + this.status);
        var resObj  = JSON.parse(this.status);
       
        var responseParams = OAuth.getParameterMap(client.responseText);
 		console.log(responseParams);
        oauth_token = responseParams['oauth_token'];
        oauth_token_secret = responseParams['oauth_token_secret'];
 
        if (complete != 'undefined') {
            complete();
        }
    }
    client.send(null);
};

   /**
 * 2nd step of oAuth.
 * @method get_authorize_url_with_token
 */
    this.get_authorize_url_with_token = function() {
    return AUTHORIZE_URL + '?oauth_token=' + oauth_token;
};


   /**
 * 3rd step of oAuth.
 * @method access_token
 */
this.access_token = function(complete) {
    accessor.tokenSecret = oauth_token_secret;
 
    var message = {
        action : ACCESS_TOKEN_URL,
        method : 'POST',
        parameters : []
    };
    message.parameters.push(['oauth_consumer_key', CONSUMER_KEY]);
    message.parameters.push(['oauth_token', oauth_token]);
    message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
    message.parameters.push(['oauth_verifier', pin]);
 
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
 
    var client = Ti.Network.createHTTPClient();
 
    client.open('POST', ACCESS_TOKEN_URL, true);
    client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
    client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));
 
    client.onload = function() {
        var responseParams = OAuth.getParameterMap(client.responseText);
       
        if(responseParams != null && responseParams != '')
        {
         	console.log(responseParams);
        	oauth_token = responseParams['oauth_token'];
       		oauth_token_secret = responseParams['oauth_token_secret'];
        	complete.call();	
        }
        else
        {
        	//alert('Some Error Occure With Webservice');
        }
     }
    client.send(null);
};


	this.getUserProfileInfo =function ()
	{
		
	accessor.tokenSecret = oauth_token_secret;
 
    var message = {
        action : ACCESS_PROFILE_URL,
        method : 'GET',
        parameters : []
    };
    message.parameters.push(['oauth_consumer_key', CONSUMER_KEY]);
    message.parameters.push(['oauth_token', oauth_token]);
    message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
    message.parameters.push(['oauth_verifier', pin]);
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
		var client = Ti.Network.createHTTPClient();
 
	    client.open('GET', ACCESS_PROFILE_URL);
	    client.setRequestHeader('Content-Type', 'application/json;');
        client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));
	    client.send();
	    client.onload = function() {
	    	Ti.API.info("Received Data From Linkedin--"+client.responseText);
	    	var resObj  = JSON.parse(client.responseText);
	    	Ti.API.info(resObj);
	    	if(resObj != null && resObj != '')
	    	{
	    		 //alert(resObj);
	    		 Ti.App.Properties.setString("linkedin_email", resObj.emailAddress);
	        	 Ti.App.Properties.setString("linkedin_firstname", resObj.firstName);
	       		 Ti.App.Properties.setString("linkedin_lasttname", resObj.lastName);
        		 Ti.App.Properties.setString("linkedin_id", resObj.id);
        		 
        		 Ti.App.Properties.setString("linkedin_image", resObj.pictureUrl);
	        	 loginWithLinkedIn();
	    	}
	    	else
	    	{
	    		//alert('Some Error Occure With Webservice');
	    	}
	       
	    }
	   client.onerror = function(error) {
	        alert(error);
	    }
	    
	};
	
	
	this.postMessage =function (linkOfPage,msg)
	{
	 
	
		//var req  ='<?xml version="1.0" encoding="UTF-8"?><mailbox-item><recipients><recipient><person path="/people/id='+fid+'" /></recipient></recipients><subject>Invitation to Connect</subject><body>MySocialGPS Social Media</body><item-content><invitation-request><connect-type>friend</connect-type><authorization><name>'+authname+'</name><value>'+authtoken+'</value></authorization></invitation-request></item-content></mailbox-item>';
/**			
var req	= '<?xml version="1.0" encoding="UTF-8"?><mailbox-item><recipients><recipient><person path="/people/~"/></recipient><recipient><person path="/people/'+fid+'" /></recipient></recipients><subject>JOIN SocialMedia Application MySocialGPS.</subject><body>http://staging.mysocialgps.com/!</body></mailbox-item>';
//http://www.phinkit.com/Memex/2.My-Christmas-Window
/*var f  = '<?xml version="1.0" encoding="UTF-8"?><share>';
		f += String.format("<comment>%s</comment><content><title>%s</title>", "d.comment", "d.content.title"), 
		f += String.format("<submitted-url>%s</submitted-url><submitted-image-url>%s</submitted-image-url>", 'http://www.phinkit.com/Memex/2.My-Christmas-Window', 'http://static.phinkit.com/Images/22e7d168-6cc1-4d8b-ab11-a6a1dd8903ff/d224772a-9361-4a23-9b81-3eadb5b137d7/akouhrhloyycdhtcajjlfwlbjfsyslzfkja.JPG'), f += String.format("<description>%s</description></content>", 'd.content.description'), f += String.format("<visibility><code>%s</code></visibility></share>", d.visibility.code);'
	*/
	
	//alert(linkOfPage+'  '+msg);
	
	var req = '<?xml version="1.0" encoding="UTF-8"?><share><comment>'+msg+'</comment><content><submitted-url>'+linkOfPage+'</submitted-url></content><visibility><code>anyone</code></visibility></share>';
	
	accessor.tokenSecret = Ti.App.Properties.getString("oauth_token_secret");
    
    //alert(Ti.App.Properties.getString("oauth_token_secret"));
    
    var message = {
        action : POST_MESSAGE_URL,
        method : 'POST',
        parameters : []
    };
    
    message.parameters.push(['oauth_consumer_key', CONSUMER_KEY]);
    message.parameters.push(['oauth_token', Ti.App.Properties.getString("oauth_token")]);
    message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
    message.parameters.push(['oauth_verifier', Ti.App.Properties.getString("pin")]);
  
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    
		var client = Ti.Network.createHTTPClient();
 		//alert(POST_MESSAGE_URL);
	    client.open('POST', POST_MESSAGE_URL);
	    client.setRequestHeader('Content-Type', 'application/xml;');
        client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));
	    client.send(req);
	    client.onload = function() {
	    	//alert("Successfully sent!");
	    	Ti.API.info("Received Data From Linkedin--"+client.responseText);
	    	
	    }
	   client.onerror = function(error) {
	        alert('error from posting message '+error);
	    }
	    
	};
	
	this.getUserFriends =function ()
	{
	 
	accessor.tokenSecret = Ti.App.Properties.getString("oauth_token_secret");
    
    var message = {
        action : GET_CONNECTIONS_URL,
        method : 'GET',
        parameters : []
    };
    message.parameters.push(['oauth_consumer_key', CONSUMER_KEY]);
    message.parameters.push(['oauth_token', Ti.App.Properties.getString("oauth_token")]);
    message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
    message.parameters.push(['oauth_verifier', Ti.App.Properties.getString("pin")]);
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
		var client = Ti.Network.createHTTPClient();
 
	    client.open('GET', GET_CONNECTIONS_URL);
	    client.setRequestHeader('Content-Type', 'application/json;');
        client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));
	    client.send();
	    client.onload = function() {
	    	Ti.API.info("Received Data From Linkedin--"+client.responseText);
	    	var resObj  =JSON.parse(client.responseText);
	    	
	    	if(resObj != null && resObj != '')
	    	{
	    		 displayFriendsInTableView(resObj);
	    	}
	    	else
	    	{
	    		 //alert('Some Error Occure With Webservice');
	    	}
	    }
	   client.onerror = function(error) {
	        alert(error);
	    }
	    
	};
	
	this.sendNotificationToFriend =function (fid, authname, authtoken)
	{
					
			//var req  ='<?xml version="1.0" encoding="UTF-8"?><mailbox-item><recipients><recipient><person path="/people/id='+fid+'" /></recipient></recipients><subject>Invitation to Connect</subject><body>MySocialGPS Social Media</body><item-content><invitation-request><connect-type>friend</connect-type><authorization><name>'+authname+'</name><value>'+authtoken+'</value></authorization></invitation-request></item-content></mailbox-item>';
			
var req	= '<?xml version="1.0" encoding="UTF-8"?><mailbox-item><recipients><recipient><person path="/people/~"/></recipient><recipient><person path="/people/'+fid+'" /></recipient></recipients><subject>JOIN SocialMedia Application MySocialGPS.</subject><body>http://staging.mysocialgps.com/!</body></mailbox-item>';

	accessor.tokenSecret = Ti.App.Properties.getString("oauth_token_secret");
    //alert(Ti.App.Properties.getString("oauth_token_secret"));
    var message = {
        action : SEND_INVITION_URL,
        method : 'POST',
        parameters : []
        
       
    };
    message.parameters.push(['oauth_consumer_key', CONSUMER_KEY]);
    message.parameters.push(['oauth_token', Ti.App.Properties.getString("oauth_token")]);
    message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
    message.parameters.push(['oauth_verifier', Ti.App.Properties.getString("pin")]);
  
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    
		var client = Ti.Network.createHTTPClient();
 
	    client.open('POST', SEND_INVITION_URL);
	    client.setRequestHeader('Content-Type', 'application/xml;');
        client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));
	    client.send(req);
	    client.onload = function() {
	    	//alert("Successfully Invited!");
	    	Ti.API.info("Received Data From Linkedin--"+client.responseText);
	    	
	    }
	   client.onerror = function(error) {
	        alert(error);
	    }
	    
	};
	
	
}

/*function doSharingTest() {
 IN.API.Raw("/people/~/shares")
   .method("POST")
   .body( JSON.stringify( {
       "content": {
         "submitted-url": "http://developer.linkedinlabs.com/jsapi-console",
         "title": "JSAPI Console",
         "description": "JSAPI Developer Console",
         "submitted-image-url": "http://developer.linkedin.com/servlet/JiveServlet/downloadImage/102-1101-13-1003/30-25/LinkedIn_Logo30px.png"
       },
       "visibility": {
         "code": "anyone"
       },
       "comment": "This is a test posting from the LinkedIn JSAPI Console"
     })
   )
   .result(function(r) { 
     alert("POST OK");
   })
   .error(function(r) {
     alert("POST FAIL");
   });
}*/
  