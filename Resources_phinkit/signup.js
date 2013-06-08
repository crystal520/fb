Ti.include('functions.js');

var currentWindow = Titanium.UI.currentWindow;

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

currentWindow.add(actInd);

var signupView = Ti.UI.createScrollView({
	 width:'auto',
 	 height:'auto',
   	 contentHeight:200,
     contentWidth:'auto'
});

currentWindow.add(signupView);

var logoImage = Ti.UI.createImageView({
	top: '5%',
	image : 'logo.png'
});

signupView.add(logoImage);

var signBlockImage = Ti.UI.createImageView({
	top: '30%',
	image : 'registerbg.png'
});

signupView.add(signBlockImage);

var fname = Ti.UI.createTextField({
	height : 34,
	width : 261,
	top : '45%',
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'First Name',
	font:{fontSize:12},
	paddingLeft : 10,
	color : '#fff',
});
signupView.add(fname);

var lname = Ti.UI.createTextField({
	height : 34,
	width : 261,
	top : '55%',
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Last Name',
	font:{fontSize:12},
	paddingLeft : 10,
	color : '#fff',
});
signupView.add(lname);

var email = Ti.UI.createTextField({
	height : 34,
	width : 261,
	top : '65%',
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Email',
	font:{fontSize:12},
	paddingLeft : 10,
	color : '#fff',
});
signupView.add(email);

var passwordField = Ti.UI.createTextField({
	height : 34,
	width : 261,
	top : '75%',
	passwordMask : true,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Password',
	font:{fontSize:12},
	paddingLeft : 10,
	color : '#fff',
});
signupView.add(passwordField);

var ErrorMsg = Ti.UI.createLabel({
	text : 'Please fill up all the above fields',
	height : 'auto',
	width : 'auto',
	top : '82%',
	left : '10%',
	font:{fontSize:12},
	color : 'red',
	visible:false
});

signupView.add(ErrorMsg);
ErrorMsg.hide();

var loginButton = Ti.UI.createButton({
	backgroundImage: 'green_bg.png',
    title:'Back',
    height: 27,
    width: 55,
	top : '84%',
	right : '38%',
	color:'#fff',
	font:{fontSize:15,fontWeight:'bold',fontFamily : 'Arial'}
});

signupView.add(loginButton);

var registerButton = Ti.UI.createImageView({
	image : 'register.png',
	top : '84%',
	right : '10%',
});

signupView.add(registerButton);


registerButton.addEventListener('click',function(){
	var firstName = fname.value;
	var lastName = lname.value;	
	var emailAddress = email.value;
	var pass = passwordField.value;
	
	if((firstName != '' && firstName != null) && (lastName != '' && lastName != null) && (emailAddress != '' && emailAddress != null) && (pass != '' && pass != null))
	{
		var pattern=/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
	    if(pattern.test(emailAddress)){  
	    	//ErrorMsg.setText('');
	    	//sending request to server
			var serverURL = Ti.App.Properties.getString('baseurl')+'CreateNewUser';
			var xhr = Titanium.Network.createHTTPClient();    
		    
		    xhr.open("POST", serverURL);
		 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
		    console.log('url' + serverURL);
		    var params = { Email : emailAddress, Password : pass, FirstName : firstName, Surname : lastName };
		 	var widgets = JSON.stringify(params);
		 	 console.log('params' + widgets);
		 	xhr.send(widgets);
		   
		    xhr.onload = function(){
		     //alert("responseText: " + this.responseText);
		     if(this.status == '200'){
		        
		        console.log(this.responseText);
		        
		        if(this.readyState == 4){
		        	
		        	var parsed_data = JSON.parse(this.responseText);	
		        	console.log(parsed_data);
		        	
		        	var status = parsed_data.status;
		        	console.log(status);
		        	if(status == 'Success')
		        	{
		        		 //ErrorMsg.setText('Successfully created user');
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
		        		else{
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
		        		
		        		setTimeout(function(){
							loadNotifications();
						},1000);
		        		
		        		currentWindow.remove(signupView);
		        		tabBarGroup.open();
		        	}
		        	else
		        	{
		        		if(parsed_data.Message != '' && parsed_data.Message != '-1')
		        		{
		        			ErrorMsg.setText(parsed_data.Message);	
		        		}
		        		else
		        		{
		        			ErrorMsg.setText('Registration unsuccessful');	
		        		}
		        	}
		        	
		        }else{
		          ErrorMsg.setText('HTTP Ready State != 4');
		        }           
		     }else{
		        ErrorMsg.setText('Transmission failed. Try again later. ' + this.status + " " + this.response);
		     }   
		     ErrorMsg.show();           
		    };
		 
		    xhr.onerror = function(e){console.log(e.source); ErrorMsg.setText('Transmission error: ' + e.error);};      
	    }
	    else
	    {
	    	ErrorMsg.setText('Invalid email address');
	    	ErrorMsg.show();
	    	
	    }
		
	}
	else
	{
		ErrorMsg.show();
	}
});

currentWindow.addEventListener('focus',function(){
	ErrorMsg.hide();
});

currentWindow.addEventListener('return',function(){
	signupView.scrollTo(0, 0);
});

loginButton.addEventListener('click',function(){
	currentWindow.close();
});


fname.addEventListener('return',function(){
	if(lname.value == '')
	{
		lname.focus();	
	}
	
});

lname.addEventListener('return',function(){
	if(email.value == '')
	{
		email.focus();
	}
});

email.addEventListener('return',function(){
	if(passwordField.value == '')
	{
		passwordField.focus();
	}
});