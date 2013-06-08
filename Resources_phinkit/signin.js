Ti.include('functions.js');

var tabBarGroup;

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
    message:' Loading Data...',
});

actInd.hide();

signinWindow.add(actInd);

var signinView = Ti.UI.createScrollView({
	 width:'auto',
 	 height:'auto',
   	 contentHeight:200,
     contentWidth:'auto'
});

signinWindow.add(signinView); 
/*
var signinuserid = Ti.App.Properties.getString('userid');

if(signinuserid != '' && signinuserid != null)
{
	 tabBarGroup.open();
}
else
{
	signinWindow.add(signinView);
}
*/
var logoImage = Ti.UI.createImageView({
	top: '10%',
	image : 'logo.png'
});

signinView.add(logoImage);

var signBlockImage = Ti.UI.createImageView({
	top: '33%',
	image : 'loginbg.png'
});

signinView.add(signBlockImage);

var emailField = Ti.UI.createTextField({
	height : 34,
	width : 261,
	top : '45%',
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Email',
	font:{fontSize:12},
	paddingLeft : 10,
	color : '#fff',
});

signinView.add(emailField);

var passwordField = Ti.UI.createTextField({
	height : 34,
	width : 261,
	top : '55%',
	passwordMask : true,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Password',
	font:{fontSize:12},
	paddingLeft : 10,
	color : '#fff',
});
signinView.add(passwordField);

var signinErrorMsg = Ti.UI.createLabel({
	text : 'Invalid Email/Password',
	height : 'auto',
	width : 'auto',
	top : '63%',
	left : '10%',
	font:{fontSize:12},
	color : 'red'
});

signinView.add(signinErrorMsg);
signinErrorMsg.hide();

var forgotPswrd = Ti.UI.createLabel({
	text : 'forgotten password?',
	height : 'auto',
	width : 'auto',
	top : '66%',
	left : '10%',
	font:{fontSize:12},
	color : '#fff'
});

signinView.add(forgotPswrd);


var loginButton = Ti.UI.createImageView({
	image : 'loginbtn.png',
	top : '65%',
	right : '10%',
});


signinView.add(loginButton);

var signUpImage = Ti.UI.createImageView({
	top: '76%',
	image : 'signup.png'
});

signinView.add(signUpImage);

var fbConnectImage = Ti.UI.createImageView({
	bottom: '4%',
	image : 'connectfb.png'
});

fbConnectImage.addEventListener('click', function (e) {
	
   if(Titanium.Facebook.loggedIn == true)
   {
   		connectingViaFacebook(true);
   }
   else
   {
   		Titanium.Facebook.authorize(); // Facebook authorization(login)
   }
   	
});

signinView.add(fbConnectImage);

/*if(Titanium.Platform.name == 'iPhone OS'){
	signinView.add(Titanium.Facebook.createLoginButton({
		style:Ti.Facebook.BUTTON_STYLE_WIDE,
		bottom:'4%',
		backgroundImage : 'connectfb.png'
	}));
}
else{
	signinView.add(Titanium.Facebook.createLoginButton({
		style:'wide',
		bottom:'4%',
	}));
}*/

signUpImage.addEventListener('click',function(){
	//Ti.App.fireEvent('app:showSignUpWindow');
	var signUpWindow = Titanium.UI.createWindow({
		url : 'signup.js',
		navBarHidden : true,
		backgroundImage : 'bg.png'
	});
	
	signUpWindow.open({});
	
});

forgotPswrd.addEventListener('click',function(){
	//Ti.App.fireEvent('app:showSignUpWindow');
	var forgotPasswordWindow = Titanium.UI.createWindow({
		url : 'forgotPassword.js',
		navBarHidden : true,
		backgroundImage : 'bg.png'
	});
	
	forgotPasswordWindow.open({});
});


loginButton.addEventListener('click',function(){
	
	//console.log(signinWindow.children.length);
	
	var email = emailField.value;
	var pass = passwordField.value;
	
	if(email == '' || email == null)
	{
		alert('Please enter email address');
		return false;
	}
	
	if(pass == '' || pass == null)
	{
		alert('Please enter password');
		return false;
	}
	
	actInd.show();
	console.log('email : '+email+'  password: '+pass);
	
	if((email != '' && email != null) && (pass != '' && pass != null))
	{
		
		var serverURL = Ti.App.Properties.getString('baseurl')+'ValidateUser';
		var xhr = Titanium.Network.createHTTPClient();    
	    
	    xhr.open("POST", serverURL);
	    xhr.setTimeout(99000);
	 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
	    
	    var params = { Email : email, Password : pass };
	 	var widgets = JSON.stringify(params);
	 	//console.log(widgets);
	 	xhr.send(widgets);
	   
	    xhr.onload = function(){
	     //alert("responseText: " + this.responseText);
	     if(this.status == '200'){
	        
	        console.log(this.responseText);
	        
	        if(this.readyState == 4){
	        	
	        	var parsed_data = JSON.parse(this.responseText);	
	        	console.log(parsed_data);
	        	
	        	var status = parsed_data.status;
	        	//console.log(parsed_data.userId);
	        	
	        	if(status == 'Success')
	        	{
	        		var userid = parsed_data.userId;
	        		
	        		var profileImageName = parsed_data.ProfileImage;
	        		var profileSmallImageNamePath = parsed_data.ProfileThumbImagePath;
	        		var profileMediumImageNamePath = parsed_data.ProfileUserImagePath;
	        		
	        		Ti.App.Properties.setString('profileImageName',profileImageName);
	        		Ti.App.Properties.setString('userid',userid);
	        		Ti.App.Properties.setBool('isFbCredentials',parsed_data.isFbCredentials);
	        		Ti.App.Properties.setBool('isTwitterCredentials',parsed_data.isTwitterCredentials);
	        		
	        		if(parsed_data.fbtoken != '-1')
	        		{
	        			Ti.App.Properties.setString('fbToken',parsed_data.fbtoken);	
	        		} 
	        		
	        		if(parsed_data.twitterToken != '-1')
	        		{
	        			Ti.App.Properties.setString('twToken',parsed_data.twitterToken);	
	        		}
	        		
	        		//var profileCompleteSmallImagePath = 'small_default_profile.jpg';
	        		//var profileCompleteLargeImagePath = 'profileimg.jpg';
	        		
	        		var profileCompleteSmallImagePath = '';
	        		var profileCompleteLargeImagePath = '';
	        		
	        		if(profileSmallImageNamePath != '' && profileSmallImageNamePath != null && profileSmallImageNamePath !=  '-1')
	        		{
	        			/*profileCompleteSmallImagePath = 'http://development.phinkit.com/Images/smallthumb/'+profileImageName;
	        			profileCompleteLargeImagePath = 'http://development.phinkit.com/Images/User/'+profileImageName;*/
	        			/*
	        			profileCompleteSmallImagePath = 'http://phinkit.aspnetdevelopment.in/picture_library/smallthumb/'+profileImageName;
	        			profileCompleteLargeImagePath = 'http://phinkit.aspnetdevelopment.in/picture_library/User/'+profileImageName;
	        			*/
	        			
	        			profileCompleteSmallImagePath = profileSmallImageNamePath;
	        			
	        		}
	        		else
	        		{
	        			profileCompleteSmallImagePath = 'http://development.phinkit.com/Assets/Images/profile/small.jpg';
	        			
	        		}
	        		
	        		if(profileMediumImageNamePath != '' && profileMediumImageNamePath != null && profileMediumImageNamePath !=  '-1')
	        		{
	        			/*profileCompleteSmallImagePath = 'http://development.phinkit.com/Images/smallthumb/'+profileImageName;
	        			profileCompleteLargeImagePath = 'http://development.phinkit.com/Images/User/'+profileImageName;*/
	        			/*
	        			profileCompleteSmallImagePath = 'http://phinkit.aspnetdevelopment.in/picture_library/smallthumb/'+profileImageName;
	        			profileCompleteLargeImagePath = 'http://phinkit.aspnetdevelopment.in/picture_library/User/'+profileImageName;
	        			*/
	        			
	        			profileCompleteLargeImagePath = profileMediumImageNamePath;
	        			
	        		}
	        		else
	        		{
	        			profileCompleteLargeImagePath = 'http://development.phinkit.com/Images/User/large.jpg';
	        		}
	        		console.log('profileSmallImage '+profileCompleteSmallImagePath);
	        		console.log('profilelargeImage '+profileCompleteLargeImagePath);
	        		Ti.App.Properties.setString('profileSmallImage',encodeURI(profileCompleteSmallImagePath));
	        		Ti.App.Properties.setString('profileLargeImage',encodeURI(profileCompleteLargeImagePath));
	        		
	        		loadCountryList();
	        		loadNotifications(function(){
	        			signinWindow.remove(signinView);
	        			tabBarGroup = new tabBarModule;
						tabBarGroup.open();
	        		});
	        		// setTimeout(function(){
						// loadNotifications();
					// },1000);
// 	        		
	        	
	        	 	//signinWindow.remove(signinWindow.children[0]);
	        		
				
	        	}
	        	else{
	        		actInd.hide();
	        		signinErrorMsg.show();
	        	}
	          	
	        }else{
	          alert('HTTP Ready State != 4');
	          actInd.hide();
	        }           
	     }else{
	        alert('Transmission failed. Try again later. ' + this.status + " " + this.response);
	        actInd.hide();
	     }              
	    };
	 
	    xhr.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);actInd.hide();};
		
	}
	else
	{
		/*var message = 'Please Enter Email and Password';
		if(email != '' && email != null)
		{
			message = 'Please Enter Email';
		}
		else if(pass != '' && pass != null) 
		{
			message = 'Please Enter Password';
		}*/
		actInd.hide();
		signinErrorMsg.show();
	}
   
});


signinWindow.addEventListener('return',function(){
	signinView.scrollTo(0, 0);
});

emailField.addEventListener('return',function(){
	passwordField.focus();
});

signinWindow.addEventListener('focus',function(){
	//emailField.focus();
	signinErrorMsg.hide();
});

/*Connecting Via Facebook*/

function connectingViaFacebook(status)
{
	 actInd.show();
   //handle login response here
   Ti.API.info("Access token "+Titanium.Facebook.accessToken);
   Ti.API.info("expiration Date "+Titanium.Facebook.expirationDate);
   Ti.API.info("unique user id from Facebook "+Titanium.Facebook.uid);
   
   var fbToken = Titanium.Facebook.accessToken;
   
   if(Ti.App.Properties.getBool('isfbcheckboxclicked'))
   {
   		actInd.hide();
   		Ti.App.Properties.setString('fbToken',fbToken);
   		Ti.App.Properties.setBool('isFbCredentials',true);
   }
   else
   {
   		Ti.App.Properties.setString('fbToken',Titanium.Facebook.accessToken);
   		Ti.App.Properties.setBool('isFbCredentials',true);
   		var userid = Ti.App.Properties.getString('userid');
   		 
   		if (status && userid != '') {
   			console.log('login via facebook');
	        Titanium.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
	            if (e.success) {
	               var data= JSON.parse(e.result);
	               console.log(data);
	               
	                Ti.API.info('fb profile pic <img src="https://graph.facebook.com/' + data.id + '/picture">');
	                Ti.API.info('first name : '+data.first_name+' last name : '+data.last_name);
	                Ti.API.info("Name:"+data.name);
	                Ti.API.info("email:"+data.email);
	                Ti.API.info("facebook Id:"+data.id);   
	                actInd.hide();
	                if(fbToken != '' && data.first_name != '' && data.last_name != '' && data.email != '')
	                {
	                	var params = { FirstName : data.first_name, LastName : data.last_name, Email : data.email, Facebook_Token : fbToken};
	                	var cwidgets = JSON.stringify(params);
	                	console.log(cwidgets);
	                	
	                	var serverURL = Ti.App.Properties.getString('baseurl')+'LoginWithFacebookButton';
	                	var xhr = Titanium.Network.createHTTPClient();
	                	
	                	xhr.open('POST',serverURL);
	                	xhr.setTimeout(10000);
	                	xhr.setRequestHeader("Content-Type","application/json;charset=utf-8");
	                	
	                	xhr.send(cwidgets);
	                	
	                	xhr.onload = function(){
	                		
	                		if(this.status == '200')
	                		{
	                			console.log(this.responseText);
	                			
	                			if(this.readyState == 4)
	                			{
	                				var parsedData = JSON.parse(this.responseText);
	                				console.log('I am in 4');
	                				
	                				if(parsedData.Status == 'Success')
	                				{
	                						/**for temporary
	                						 * 
	                						 */
	                							Ti.App.Properties.setString('userid',parsedData.UserId);
		                						
		                						Ti.App.Properties.setString('profileSmallImage','https://graph.facebook.com/' + data.id + '/picture');
			        							Ti.App.Properties.setString('profileLargeImage','https://graph.facebook.com/' + data.id + '/picture?type=large');
		                						actInd.show();
		                						loadCountryList();
		                						loadNotifications(function(){
								        			signinWindow.remove(signinWindow.children[0]);
			        							
			        							    tabBarGroup = new tabBarModule;
													
				        							if(parsedData.CompletedProfileJoiningForm)
				        							{
				        								tabBarGroup.open();
				        							}
				        							else
				        							{
				        								var profilJoinWindow = Titanium.UI.createWindow({
				        									url : 'profileJoinForm.js',
				        								});
				        								
				        								profilJoinWindow.fb_fname = data.first_name;
				        								profilJoinWindow.fb_lname = data.last_name;
				        								profilJoinWindow.fb_email = data.email;
				        								setTimeout(function(){
				        									actInd.hide();
				        									profilJoinWindow.open();
				        								},5000);
				        								
				        								profilJoinWindow.addEventListener('close',function(){
				        									tabBarGroup.open();
				        								});
				        							}
				        							
				        							if(!parsedData.AlreadyRegistered)
					        						{
					        							Titanium.Facebook.requestWithGraphPath('me/feed', {message : "Come join me on www.phinkit.com. I just signed up with Facebook."}, "POST", function(e){
					                						if(e.success)
					                						{
					                							//alert('Successfully login from FB ');
					                							
					                						}
						                					else
						                					{
						                						if(e.error)
						                						{
						                							//alert(e.error);
						                						}
						                						else
						                						{
						                							//alert("Unknown result");
						                						}
						                					}
				                						});
					        						}
								        		});
			        								
	                				}
	                				
	                			}
	                		}
	                		
	                	};
	                	
	                	xhr.onerror = function(e){console.log(e.source); actInd.hide();alert('Transmission error: ' + e.error);};
	                }
	                
	            } else if (e.error) {
	            	actInd.hide();
	                alert(e.error);
	            } else {
	            	actInd.hide();
	                alert('Unknown response.');
	            }
	        });// request graph
	    }else{
	        if(e.error){
	        	actInd.hide();
	            alert(e.error);
	        }else{
	        	actInd.hide();
	            alert("Unkown error while trying to login to facebook.");
	        }
	    }
   }
	
}

/*************************/

Titanium.Facebook.addEventListener('login', function(e) {
	connectingViaFacebook(e.success);
 });

Ti.API.addEventListener('app:closeAllTabGroup',function(){
	tabBarGroup.close();
	Ti.App.Properties.setInt('countOfNotifications',0);	
	signinWindow.add(signinView); 
});
/*
var signinuserid = Ti.App.Properties.getString('userid');

if(signinuserid != '' && signinuserid != null)
{
	 tabBarGroup = new tabBarModule;
	 tabBarGroup.open();
}
else
{
	signinWindow.add(signinView);
}
*/