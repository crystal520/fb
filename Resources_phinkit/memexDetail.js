Ti.include('birdhouse-debug.js');

var BH = new BirdHouse({
    consumer_key: "MRUiM8SfDjMBn8QAyheCPA",
    consumer_secret: "hskQCPiP9ZBGn4r33XNhTCYewHOmoyxrGDfe59Ylo0",
    callback_url:"www.phinkit.com"
});

var memexDetailWindowObj = Ti.UI.currentWindow;

memexDetailWindowObj.setBackgroundImage('bg.png');

/******Header View Start********/


var title = 'Memex Detail';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');

/*
setTimeout(function(){
	
	var headerModule = require('header').addHeader;
	var headerView = new headerModule('Memex Detail');
	
	memexDetailWindowObj.add(headerView);
},1000);
*/

memexDetailWindowObj.addEventListener('focus',function(){
	if(notificationView != '' && notiFlag == 1)
		{
			memexDetailWindowObj.remove(notificationView);	
			notiFlag = 0;
		}
	getLatestNotifications();
});

/******Header View End********/

/******Content View Start*****/

var actInd = Ti.UI.createActivityIndicator({
	height:55,
    width:'auto',
    color:'#FFFFFF',
    backgroundColor:'#000',
    opacity:0.9,
    borderRadius:5,
    borderColor:'#000',
    zIndex : 1,
    font:{fontFamily:'Helvetica Neue', fontSize:18},
    message:' Loading Data..',
    style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
});

actInd.message = 'Loading Memex..';
actInd.show();

memexDetailWindowObj.add(actInd);

var backButton = Ti.UI.createButton({
    backgroundImage: 'green_bg.png',
    title:'Back',
    height: 28,
    width: 51,
    top:'15%',
    left:'3%',
});

memexDetailWindowObj.add(backButton);

backButton.addEventListener('click',function(e){
	Ti.UI.currentWindow.close();
});

var memexDetailScrollView = Ti.UI.createScrollView({
	top : '25%',
	width:'auto',
 	height:'auto',
   	contentHeight:100,
    contentWidth:'auto',
	backgroundImage : 'bgprofile.png',
	showVerticalScrollIndicator:true, 
	showHorizontalScrollIndicator:false,
});

var tableView = Ti.UI.createTableView({
	backgroundColor : 'transparent',
	separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
});

/***sending request to get youtube video detail to handle youtube video in native code **/
vdrld = function (a, b) { // We do not get the video-id nor do we get any url; that is, we extract the ID from the image-url.
    vdldr = Ti.Network.createHTTPClient();
    vdldr.onload = function () {
    	console.log(this.responseText);
            x = decodeURIComponent(decodeURIComponent(decodeURIComponent(decodeURIComponent(this.responseText.substring(4, this.responseText.length)))));
           // console.log('parsed data'+a);
           //console.log(JSON.parse(x));
            url = JSON.parse(x).content.video["fmt_stream_map"][0].url;
            thumbimage = JSON.parse(x).content.video["thumbnail_for_watch"];
            console.log(url+' '+thumbimage);
            return b(url,thumbimage);
    };
    //http://www.youtube.com/watch?v=
    //http://youtu.be/gWpx3Srzt9A
    vdldr.setRequestHeader("Referer", "http://www.youtube.com/watch?v="+a);
    vdldr.setRequestHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/536.26.14 (KHTML, like Gecko) Version/6.0.1 Safari/536.26.14");
    vdldr.open("GET", "http://m.youtube.com/watch?ajax=1&v=" + a);
    //http://m.youtube.com/watch?ajax=1&feature=related&layout=mobile&tsp=1&&v=
    vdldr.send();
};
/***sending request to get youtube video detail to handle youtube video in native code **/

/*
Titanium.App.addEventListener("playvideo", function (e) {
        win11 = Titanium.UI.createWindow({
                orientationModes: [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT],
                title: "Video",
                zIndex: 222222
        });
 
        var activeMovie = Titanium.Media.createVideoPlayer({
                fullscreen: !0,
                autoplay: !0,
                backgroundColor: '#111',
                mediaControlStyle: Titanium.Media.VIDEO_CONTROL_DEFAULT,
                scalingMode: Titanium.Media.VIDEO_SCALING_ASPECT_FIT
        });
 
        activeMovie.url = e.url;
        win11.add(activeMovie);
 
        activeMovie.addEventListener('complete', function (e) {
                e.entering == 0 && win11.close(), setTimeout(function () {
                        Titanium.App.fireEvent("scrollfix");
                }, 100);
        });
 
        activeMovie.addEventListener("fullscreen", function (e) {
                e.entering == 0 && win11.close(), setTimeout(function () {
                        Titanium.App.fireEvent("scrollfix");
                }, 100);
        });
 
        win11.open({
                fullscreen: !0
        });
        activeMovie.play();
});
*/

memexDetailScrollView.add(tableView);

memexDetailWindowObj.add(memexDetailScrollView);

memexDetailWindowObj.addEventListener('focus',function(){
	
	var inputData = [];
	
	var row1 = Ti.UI.createTableViewRow({
		top : '10%',
	});
	
	inputData.push(row1);
	
	var detailView = Ti.UI.createWebView({
		top : '1%',
		bottom : '3%',
		width : 300,
		url:'memexDetail.html',
		backgroundColor : 'transparent',
		backgroundImage : 'none',
	});
	
	row1.add(detailView);
	var currentDate = new Date();
	var loggedinProfileImage = Ti.App.Properties.getString('profileSmallImage');
	
	var obj = { BlogticleID : memexDetailWindowObj.memex_id, UserId : Ti.App.Properties.getString('userid'), IsRefreshFlag : currentDate.getTime(), MemexOwnerUserId : memexDetailWindowObj.memex_ownerid };
	console.log('parsmsdf tsesting'+ JSON.stringify(obj));
	
	detailView.addEventListener('beforeload',function(){
		var currentDate = new Date();
		console.log("{ BlogticleID : "+memexDetailWindowObj.memex_id+", UserId : "+Ti.App.Properties.getString('userid')+", IsRefreshFlag : "+currentDate.getTime()+" }");
		
		detailView.evalJS("var baseurl='"+Ti.App.Properties.getString('baseurl')+"';");
		detailView.evalJS("var BlogticleID='"+memexDetailWindowObj.memex_id+"';");
		detailView.evalJS("var user_id='"+Ti.App.Properties.getString('userid')+"';");
		detailView.evalJS("var memex_owner_id='"+memexDetailWindowObj.memex_ownerid+"';");
		detailView.evalJS("var loggedin_profile_image='"+loggedinProfileImage+"';");
		
		actInd.hide();
	});

	tableView.setData(inputData);
	
	
});

Ti.App.addEventListener('app:callMemexListByUser',function(e){
	
	var userMemexWindow = Ti.UI.createWindow({
		url : 'memexListByUser.js',
		navBarHidden : true
	});
	
	userMemexWindow.memexUserId = e.memex_user_id;
	
	Ti.UI.currentTab.open(userMemexWindow);
});

 
Ti.App.addEventListener('app:shareOnTwitter',function(event){
	
	 //alert(e.memexLink);
  	BH.authorize(function(e) 
    {
           if (e===true) 
           {
           	   console.log('twiiter token=='+ Ti.App.Properties.getString('oauth_token_tw'));
           		  
       	       var resP = BH.short_tweet(event.memexLink,function(e){
       	       		if(e)
       	       		{
       	       			alert('Memex is shared on twitter');
       	       		}
       	       		else
       	       		{
       	       			alert('Memex is not share on twitter. Please try again!');
       	       		}
       	       		
       	       });
		   } 
           else 
           {
               alertDialog.message = 'Failed to authorize.';
           }
     });
});	


Ti.App.addEventListener('app:showPraiseList',function(e){
	
	var popUpWindow = Ti.UI.createWindow({
		url : 'praise_list.js',
		navBarHidden : true,
	});
	
	popUpWindow.memexid = e.memexid;
	
	popUpWindow.open();
	
});

Ti.App.addEventListener('app:showProfile',function(e){
	var memexuserid = e.memexuserid;
	
	if(memexuserid != '' && memexuserid != null)
	{
		var userDetailWindow = Titanium.UI.createWindow({
			url : 'showProfile.js',
		});
		userDetailWindow.user_id = memexuserid;
		
		Ti.UI.currentTab.open(userDetailWindow,{animate:true});
	}
});

Ti.App.addEventListener('app:sendConnectionRequest',function(e){
	//alert('called send request '+e.memexuserid+' '+e.memexusername);
	var popUpWindow = Ti.UI.createWindow({
		url : 'sendConnectionRequest.js',
		navBarHidden : true,
	});
	
	popUpWindow.to_user_id = e.memexuserid;
	popUpWindow.user_name = e.memexusername;
	
	popUpWindow.open();
	
	popUpWindow.addEventListener('close',function(event){
		console.log(event.source);
		console.log(event.source.completed);
		//searchlabel.fireEvent('click');
		//popUpWindow.close();
	});
});
/******Content View End*******/
Ti.App.addEventListener('app:rephinkMemex',function(e){
	//alert('event fired');
	
	var memex_link = e.memexLink;
	var memex_id = e.memex_id;
	//alert(memex_link);
	
	if(memex_link != '')
	{
		var popUpWindow = Titanium.UI.createWindow({
			backgroundColor:'transparent',
			backgroundImage : 'none',
			height:450,
			width:300,
			/*opacity:0.92,*/
		});
		
		var popUpClose = Ti.UI.createButton({
			title : '.',
			top : 118,
			right : 1,
			height : 32,
			width : 32,
			backgroundImage : 'retina-close-button.png',
			textAlign : 'left',
			font:{fontSize:12,fontFamily:'Helvetica Neue'},
			zIndex : 999,
		});
		
		popUpClose.addEventListener('click',function(){
			popUpWindow.close();
		});
		
		popUpWindow.add(popUpClose);
		
		var popupView = Ti.UI.createView({
			backgroundColor : 'none',
			backgroundImage : 'pop-up-bg.png',
			height : 198
		});
		
		var contentArea = Ti.UI.createTextArea({
			top : 25,
			backgroundImage:'pop-up-text.png',
			backgroundColor : 'none',
			height : 125,
			width : 270,
			borderRadius : 5,
			font:{fontSize:14},
			paddingLeft : 10,
			color : '#fff',
			wordWrap : true,
			value : memex_link
		});
		
		popupView.add(contentArea);
		
		var rephinkButton =  Ti.UI.createButton({
			title : 'Rephink',
			bottom : 13,
			height : 32,
			width : 80,
			backgroundImage : 'date-bg.png',
			textAlign : 'center',
			font:{fontSize:14,fontFamily:'Helvetica Neue',fontWeight:'bold'},
			zIndex : 999,
			borderRadius : 5,
		});
		
		popupView.add(rephinkButton);
		
		var cancelButton =  Ti.UI.createButton({
			title : 'Cancel',
			bottom : 13,
			height : 32,
			width : 80,
			right : 16,
			backgroundImage : 'date-bg.png',
			textAlign : 'center',
			font:{fontSize:14,fontFamily:'Helvetica Neue',fontWeight:'bold'},
			zIndex : 999,
			borderRadius : 5,
		});
		
		cancelButton.addEventListener('click',function(e){
			popUpWindow.close();
			//e.stopPropagation();
		});
		
		popupView.add(cancelButton);
		
		popUpWindow.add(popupView);
		
		/*
		popUpWindow.to_user_id = e.memexuserid;
		popUpWindow.user_name = e.memexusername;
		*/
		popUpWindow.open();
		
		popUpWindow.addEventListener('close',function(event){
			//event.stopPropagation();
			return false;
			console.log(event.source);
			console.log(event.source.completed);
			//searchlabel.fireEvent('click');
			//popUpWindow.close();
		});
		
		rephinkButton.addEventListener('click',function(){
			/*&
			var BH_rephink = new BirdHouse({
			    consumer_key: "MRUiM8SfDjMBn8QAyheCPA",
			    consumer_secret: "hskQCPiP9ZBGn4r33XNhTCYewHOmoyxrGDfe59Ylo0",
			    callback_url:"www.phinkit.com",
			    access_token : "EOPrOr2HXVUepOrsWGhlDima0oESXkUVgxHumTdM",
			});
			
			BH_rephink.authorized = true;
			BH.send_tweet("status="+escape(memex_link),function(e){
				Ti.API.info('fn-tweet: retval is '+e);
   	       		if(e)
   	       		{
   	       			alert('Memex is shared on twitter');
   	       		}
   	       		else
   	       		{
   	       			alert('Memex is not share on twitter. Please try again!');
   	       		}
   	       		
   	       });
   	       */
   	       /*
   	       Titanium.Facebook.accessToken = 'AAAFOdNI15b8BAG8JjQuKUiHvYcmxXDWNEWx4nCQ916O5ge3tLoDiXoDCSyjEy7VHp7RwAJBh7JFg5DZBPuZC56uRDeEIDDTacI06eYZBwZDZD';
			
			//send_facebook_stream(memex_link);
			var data = { link : memex_link };
			
			Titanium.Facebook.requestWithGraphPath('me/feed', data, 'POST', function(e) {
			 	console.log('e '+e);
			 	if (e.success) {
			 		 var data= JSON.parse(e.result);
	               console.log(data);
			 	}
			 });
   	       */
			// send_tweet("status="+escape(memex_link),function(retval){
				// Ti.API.info('fn-tweet: retval is '+retval);
			// });
			        			
			var serverURL = Ti.App.Properties.getString('baseurl')+'InsertRePhinkitPhoughtIntoTable';
			var xhr = Titanium.Network.createHTTPClient();    
		    
		    xhr.open("POST", serverURL);
		 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
		    
		    var  userid = Ti.App.Properties.getString('userid');
		    
		    var params = { UserId : userid, BlogId : memex_id, Comment :  contentArea.value};
		 	var widgets = JSON.stringify(params);
		 	console.log(widgets);
		 	
		    xhr.send(widgets);
		   
		    xhr.onload = function(){
		    	
		    	if(this.status == '200'){
        
		         console.log(this.responseText);
		        
			        if(this.readyState == 4){
			        	
			        	var parsed_data = JSON.parse(this.responseText);	
			        	var videolink = '';
			        	if(parsed_data.Status == 'Success')
			        	{
			        		
			        		var twitter_cred = parsed_data.TwitterData;
			        		
			        		var fb_cred = parsed_data.FBData;
			        		
			        		if(fb_cred != '')
			        		{
			        			if(fb_cred['Token'] != '' && fb_cred['Token'] != '-1')
			        			{
			        				console.log('fb token '+fb_cred['Token']+'  fb token secret '+fb_cred['TokenSecret']);
			        				//Titanium.Facebook.accessToken = fb_cred['Token'];
			        				Titanium.Facebook.setAccessToken(fb_cred['Token']);
									console.log(Titanium.Facebook.accessToken);
									var data = { link : memex_link };
									alert('sendfsd');
									Titanium.Facebook.requestWithGraphPath('me/feed', data, 'POST', function(e) {
									 	
									 	if (e.success) 
									 	{
									 		 var data= JSON.parse(e.result);
							               	 console.log('Rephink is send to facebook.');
									 	}
									 	else
									 	{
									 		console.log('Rephink is not send to facebook.');
									 	}
									});
			        			}
			        		}
			        		
			        		
			        		if(twitter_cred != '')
			        		{
			        			console.log('twitter token '+twitter_cred['Token']+'  twitter token secret '+twitter_cred['TokenSecret']);
								if(twitter_cred['Token'] != '-1' && twitter_cred['TokenSecret'] != '-1')
			        			{
			        				var rephink_BH = new BirdHouse({

									    consumer_key: "MRUiM8SfDjMBn8QAyheCPA",
									
									    consumer_secret: "hskQCPiP9ZBGn4r33XNhTCYewHOmoyxrGDfe59Ylo0",
									
									    callback_url:"",
									
									    AccessToken : twitter_cred['Token'] ,
									
									    AccessTokenSecret : twitter_cred['TokenSecret']
									
									});
									
									rephink_BH.authorized = true;
									
									var textToTweet = contentArea.value;
									
									if(contentArea.value == '')
									{
										textToTweet = memex_link;
									}
									
									rephink_BH.send_tweet(textToTweet,function(e){
									
									            if(e)
									
									            {
									
									         alert('Tweet is send');
									
									           // phoughtDetailWindowObj.close();
									
									            }
									
									            else
									
									            {
									
									           alert('Tweet is not send');
									
									            }
									
									});
			        			}
			        		}
			        	}
			        }
		       }
		    };
		    
		    xhr.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);};
		    popUpWindow.close();
		});
		
	}
	
});

Ti.App.addEventListener('app:openUrlInWindow', function(e){
	
	var site_url = e.siteURL;
	
	//alert('Opening url');
	
	if(site_url != ''){
		
		// var popUpWindow = Ti.UI.createWindow({
				// navBarHidden : true,
				// width : "100%",
 //                height : "100%",
 //                border : 10,
 //                backgroundColor : 'white',
 //                borderColor : '#aaa',
 //                borderWidth : 5,
		// });
		
		var closeWindow = Ti.UI.createButton({
			title:'Close'
		});
		
		var popUpWindow = Ti.UI.createWindow({
				top: 0,
				modal: true,
				fullscreen: true,
				leftNavButton:closeWindow
		});
		
		// var closeWindow = Ti.UI.createLabel({
				// textAlign : 'right',
 //                font : { fontWeight : 'bold', fontSize : 16 },
 //                text : '(X)',
 //                top : 1,
 //                right : 12,
 //                height : 45
		// });
		
		popUpWindow.add(closeWindow);
		
		closeWindow.addEventListener('click',function(){
			popUpWindow.close();
		});
		
		var popUpWebview = Ti.UI.createWebView({
			 url : site_url,
			 scalesPageToFit: true,
			 touchEnabled: true,
			 top:0,
			 backgroundColor: '#FFF'
		});
		
		popUpWindow.add(popUpWebview);
		
		popUpWindow.open();
	}
	
});

Ti.App.addEventListener('app:shareOnPinterest',function(e){
	//alert('event fired');
	var pinURL = e.pinURL;
	//alert(pinURL);
	if(pinURL != '')
	{
		var popUpWindow = Ti.UI.createWindow({
				navBarHidden : true,
				width : "100%",
                height : "100%",
                border : 10,
                backgroundColor : 'white',
                borderColor : '#aaa',
                borderWidth : 5,
		});
		
		var closeWindow = Ti.UI.createLabel({
				 textAlign : 'right',
                font : { fontWeight : 'bold', fontSize : 16 },
                text : '(X)',
                top : 1,
                right : 12,
                height : 45
		});
		
		popUpWindow.add(closeWindow);
		
		closeWindow.addEventListener('click',function(){
			popUpWindow.close();
		});
		
		var popUpWebview = Ti.UI.createWebView({
			 url : pinURL,
			 top : 50,
		});
		
		popUpWindow.add(popUpWebview);
		
		popUpWindow.open();
	}
	
});

Ti.App.addEventListener('app:shareOnlinkedin',function(e){
	//alert('event fired');
	var memex_link = e.memexLink;
	//alert(memex_link);
	if(memex_link != '')
	{
		var popUpWindow = Ti.UI.createWindow({
			url : 'linkedin_share.js',
			navBarHidden : true,
			backgroundColor: '#262626', 
			opacity: 1.0
		});
		
		popUpWindow.memexLink = e.memexLink;
		popUpWindow.memexImage = e.memex_image;
		popUpWindow.memexTitle = e.memex_title;
		popUpWindow.memexDesc = e.memex_desc;
		
		popUpWindow.open();
	}
	
});


Ti.App.addEventListener('app:shareOnFb',function(e){
	
	var memex_link = e.memexLink;
	
	if(Titanium.Facebook.loggedIn){
		
		send_facebook_stream(memex_link);
	
	}
	else
	{
		Titanium.Facebook.authorize();
		
		send_facebook_stream(memex_link);
	}
});

function send_facebook_stream(memex_link)
{
	//console.log('called send facebook stream');
	var data = {
            //name : memex_title,
            // set the link if necessary
          	//caption
            link : memex_link,
         	
        };
   
    var facebook_dialog = Titanium.Facebook.dialog("feed",data,showRequestResult); 
}

/**
* HANDLE THE REQUEST RESULT FROM FACEBOOK
*/
    function showRequestResult(r)
    {
        //alert(r)
 		var facebook_response;
        if (r.result)
        {
            facebook_response = Ti.UI.createAlertDialog({
                        title:'Facebook Shared!',
                       message:'Your stream was published'
                       });
            
            facebook_response.show();
	        
	        var fb_resp_timeout = setTimeout(function(){
	            facebook_response.hide();
	        }, 1000);
	        
	        memexDetailWindowObj.fireEvent('focus');
        }
        else
        {
        	/*
            facebook_response = Ti.UI.createAlertDialog({
                           title:'Facebook Stream was cancelled',  
                           message:'Nothing was published.'
                         });
            */
 
        }
        
    }

function parse_query_string(videolink)
{
	var video_id = '';
	
	var aPosition = videolink.indexOf("?");
	
	if(aPosition > 0)
	{
		var param_str = videolink.substring(aPosition+1);
		console.log(param_str);
		if(param_str != '')
		{
			var pairs = param_str.split("&");
			console.log(pairs);
			
			for(var i = 0; i < pairs.length; i++) {
				var pos = pairs[i].indexOf('='); 
				if (pos == -1) continue; 
				var argname = pairs[i].substring(0,pos); 
				var value = pairs[i].substring(pos+1);
				if(argname == 'v')
				{
					video_id = unescape(value);
					break;
				}
			}
		}
	}
	else
	{
		aPosition = videolink.lastIndexOf("/");
		console.log('I am in else '+aPosition+' videoid : '+videolink.substring(aPosition+1));
		video_id = videolink.substring(aPosition+1);
	}
	return video_id;
}
