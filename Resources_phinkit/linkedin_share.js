Ti.include('oauth_client.js');
var client = new oauth_client();

var popup_window = Ti.UI.currentWindow;
	
var view = Ti.UI.createView({
                width : "100%",
                height : "100%",
                border : 10,
                backgroundColor : 'white',
                borderColor : '#aaa',
                borderWidth : 5,
            });
 var closeLabel = Ti.UI.createLabel({
                textAlign : 'right',
                font : {
                    fontWeight : 'bold',
                    fontSize : 16
                },
                text : '(X)',
                top : 10,
                right : 12,
                height : 45
            });
var webView = '';

 closeLabel.addEventListener('click', function() {
 	popup_window.close();
 });
 view.add(closeLabel);
 popup_window.add(view);

if( Ti.App.Properties.getString("oauth_token") == "" || Ti.App.Properties.getString("oauth_token") == null || Ti.App.Properties.getString("oauth_token") == undefined){
        	
        	
    
      ////----------------------------------------LinkedIn Integration code starts from here-----------------------------------//////
        //do not modify oauth_client.js file it contains custom functions.
        
        /* 
        var popup_window = Ti.UI.createWindow({
            backgroundColor : "#fff"
        });
         */
        //Create the client instance.
        
         
        //Create the label that shows "loading" message so user knows that something is happening.
        var loadingLabel = Ti.UI.createLabel({
            text : 'Loading... Please wait.',
        });
        popup_window.add(loadingLabel);
         
        /**
         * This is the 2nd step of oAuth. It will show the authentication page for you to enter user name and password to authorize the app.
         */
        var show_on_webview = function(url, complete) {
            
            
           
            webView = Ti.UI.createWebView({
                url : url,
                top : "55dp",
                width : "90%",
                height : "100%",
            });
            view.add(webView);
            
            webView.addEventListener('beforeload', function(e) {
 				
 				popup_window.remove(loadingLabel);
 				
                if (Ti.Platform.osname == "android")
                    
                    view.visible = false;
            });
            webView.addEventListener('load', function(e) {
                
                var html = e.source.html;
                client.set_pin(html);
                if ((complete != 'undefined') && (client.get_pin() != null)) {
                    complete();
                }
                if (Ti.Platform.osname == "android")
                    view.visible = true;
            });
           
            return;
        };
         
        /**
         * Save the token, secret and pin in file.
         */
        
        
        
        
        
        var save_token_and_secret = function() {
            
            Ti.App.Properties.setString("oauth_token", client.get_oauth_token());
            Ti.App.Properties.setString("oauth_token_secret", client.get_oauth_token_secret());
            Ti.App.Properties.setString("pin", client.get_pin());
            // popup_window.close();
            Ti.API.info(view.children[0]);
            if(view.children)
            {
            	view.remove(webView);
            	popup_window.remove(view.children[0]);
            }
            
            if( Ti.App.Properties.getString("oauth_token") != "" && Ti.App.Properties.getString("oauth_token") != null){
            	
            	 //client.getUserFriends();
            	   //client.postMessage();
            	   showBoxForComment();
            }
            //client.getUserProfileInfo();
           
        }
        /**
         * Save the token, secret and pin in file.
         */
        var get_access_token = function() {
            client.access_token(function() {
                //alert("get_access_token");
                save_token_and_secret();
            });
        }
        var login = function() {
            client.request_token(function() {
                show_on_webview(client.get_authorize_url_with_token(), get_access_token);
            });
        }
        login();
        popup_window.open();
}
else{
	
	 Ti.API.info(Ti.App.Properties.getString("oauth_token"));
	 Ti.include('oauth_client.js');
       
        //Create the client instance.
        var client = new oauth_client();
	    //client.getUserFriends();
	    //client.postMessage();
	    showBoxForComment();
}

function showBoxForComment(){
	/*
    var headerView1 =Ti.UI.createView({
    	   width:'auto',
    	   height:'auto',
    	   top:0,
    	   title:'Header',
    	   
    	});
    */
  // alert('calling new view');
   console.log(popup_window.memexLink+' '+popup_window.memexImage+' '+popup_window.memexTitle+' '+popup_window.memexDesc);
   
	if(popup_window.memexLink != '')
	{
		var contentView = Ti.UI.createView({
			height : 100,
			width : 270,
			top : 70,
			
		});
		view.add(contentView);
		
		if(popup_window.memexImage != '')
		{
			var memex_imageView = Ti.UI.createImageView({
				top : 1,
				left : '3%',
				width : 50,
				height : 50,
				image : popup_window.memexImage,
				
			});
			
			contentView.add(memex_imageView);
		}
		if(popup_window.memexTitle != '')
		{
			var titleView = Ti.UI.createView({
				left : '25%',
				top : '3%',
				bottom : '15%',
				
			});
			
			var titleText = Ti.UI.createLabel({
				text : popup_window.memexTitle,
				width : 200,
				height : 20,
				color : '#98bf1a',
				top : 1,
				left : '1%',
				font : {fontSize:'12sp', fontName : 'Helvetica'},
			});
			
			titleView.add(titleText);
			
			var memexlinkText = Ti.UI.createLabel({
				text : popup_window.memexLink,
				color : '#000',
				top : 20,
				left : '1%',
				width : 200,
				height : 40,
				font : {fontSize:'12sp', fontName : 'Helvetica'},
				
			});
			
			titleView.add(memexlinkText);
			
			if(popup_window.memexDesc != '')
			{
				
				var desc = popup_window.memexDesc;
				var descText = Ti.UI.createWebView({
					html : desc.substring(0,180)+'...',
					color : '#000',
					top : 60,
					left : '1%',
					font : {fontSize:'12sp', fontName : 'Helvetica'},
					width : 200,
					height : 100,
				});
				//titleView.add(descText);
			}
			
			contentView.add(titleView);
		}
 
	}
	
	var commentText = Ti.UI.createLabel({
		text : 'Set your comment with Memex : ',
		color : '#000',
		top : 130,
		font : {fontSize:'12sp', fontName : 'Helvetica', fontWeight : 'bold'},
		width : 200,
		height : 70,
	});
	
    var setText = Ti.UI.createTextArea({
    		top : 200,
			borderRadius : 5,
			height : 130,
			width : 270,
			borderColor : '#c1c1c1'
		});
		
		var share = Ti.UI.createButton({
			title : 'Share',
			bottom : 50,
			right : 150,
			height : 33,
			width : 60,
			font:{fontSize:14,fontWeight:'bold',fontFamily:'Helvetica Neue'},
		});
		
		var cancel = Ti.UI.createButton({
			title : 'Cancel',
			bottom : 50,
			right : 60,
			height : 33,
			width : 60,
			font:{fontSize:14,fontWeight:'bold',fontFamily:'Helvetica Neue'},
		});
		share.addEventListener('click',function(){
			//alert(setText.value);
			
			client.postMessage(popup_window.memexLink, setText.value);
			popup_window.close();
		});
		cancel.addEventListener('click',function(){
			//alert('cancel button clicked');
			popup_window.close();
		});
		// headerView1.add(setText);
		// headerView1.add(share);
		view.add(commentText);
		view.add(setText);
		view.add(share);
		view.add(cancel);
		popup_window.add(view);
		//popup_window.open();
}
function displayFriendsInTableView(friendData){
	
	  var rsObj = friendData;
	  var inputData  = [ ];
      var win = Ti.UI.createWindow({
        	navBarHidden:true
        });
        var headerView1 =Ti.UI.createView({

        	   backgroundImage:'u6_original.png',
        	   width:'auto',
        	   height:60,
        	   top:0,
        	   title:'Header',
        	   
        	});
        	var header_label1 = Ti.UI.createLabel({
        	    color: '#fff',
        	    text: 'Select Friend',
        	    textAlign: 'center',
        	    font: {
        							
        				fontSize: 20,
        				fontWeight: 'bold'
        				
        		},
        	});

        	headerView1.add(header_label1);
        	var invite_friends_mapicon1 =Titanium.UI.createImageView({
        	    image:'images/back.png',
        	    height: 40,
        	    top:3,
        	    left:5,
        	    width:55
        	}); 
        	headerView1.add(invite_friends_mapicon1);
        	invite_friends_mapicon1.addEventListener("touchstart", function() {
        	    win.close();
        	});
        	win.add(headerView1);
	if(rsObj != "" && rsObj != null){
		
		
		var len   = rsObj.values.length;
		var friendArr = rsObj.values;
		for(z=0; z<len; z++){
		
			      var row = Ti.UI.createTableViewRow();
                  var standardurl = friendArr[z].apiStandardProfileRequest.headers.values[0];
                  var name_search = standardurl.value.split(":");
                  var auth_name    = name_search[0];
                  var auth_token   = name_search[1];
                  //alert(auth_token);
                  if(friendArr[z].firstName !=null && friendArr[z].firstName !=""){
                  	var label = Ti.UI.createLabel({
						left: 100,
						text:friendArr[z].firstName+" "+friendArr[z].lastName,
						font:{
							 fontSize:14
						}
					});
                  	
                  }
                  else{
                  	
                  	var label = Ti.UI.createLabel({
						left: 100,
						text:"Name",
						font:{
							 fontSize:14
						}
					});
                  }
					
				  if(friendArr[z].pictureUrl !=null && friendArr[z].pictureUrl !=""){
						var image = Ti.UI.createImageView({
							image:friendArr[z].pictureUrl,
							left: 5,
							width:75,
							height:60
							
						});
					
					}
					else{
						
						var image = Ti.UI.createImageView({
						image:'newImages/default.jpeg',
						left: 5,
						width:75,
						height:60
						
					   });
						
					}
					var button = Ti.UI.createButton({
						right: 10,
						height: 30,
						width: 70,
						title: 'Invite',
						linkedin_id:friendArr[z].id,
						OAuthName:auth_name,
						OAuthToken:auth_token
					});
					button.addEventListener('click', function(e)
					{
							    	var fid = e.source.linkedin_id;
							    	console.log(fid);
							    	win.close();
							    
							    	client.sendNotificationToFriend(e.source.linkedin_id, e.source.OAuthName, e.source.OAuthToken);
					 });
					            
					row.add(label);
					row.add(image);
					row.add(button);
					inputData.push(row);
	    }//for
	  }//if
        
        var fbfriends_view = Titanium.UI.createTableView({top:50});
        
        fbfriends_view.setData([]);
        fbfriends_view.setData(inputData);
        
	    
	    win.add(fbfriends_view);
	    win.open();
	//alert(friendData);
}


        
    /**************************************Linked in Ends Here********************************************/