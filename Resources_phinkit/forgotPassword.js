var currentWindow = Titanium.UI.currentWindow;

var forgotView = Ti.UI.createScrollView({
	 width:'auto',
 	 height:'auto',
   	 contentHeight:200,
     contentWidth:'auto'
});

currentWindow.add(forgotView);

var logoImage = Ti.UI.createImageView({
	top: '5%',
	image : 'logo.png'
});

forgotView.add(logoImage);

var signBlockImage = Ti.UI.createImageView({
	top: '30%',
	image : 'loginbg.png'
});

forgotView.add(signBlockImage);

var emailLabel = Ti.UI.createLabel({
	height : 'auto',
	width : 'auto',
	top : '45%',
	text : 'Please enter your email',
	color : '#fff',
	left : '10%',
	font : {fontSize:12},
});

forgotView.add(emailLabel);

var email = Ti.UI.createTextField({
	height : 34,
	width : 261,
	top : '50%',
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Email',
	font:{fontSize:12},
	paddingLeft : 10,
	color : '#fff',
});
forgotView.add(email);

var signinErrorMsg = Ti.UI.createLabel({
	text : 'Please enter email',
	height : 'auto',
	width : 'auto',
	top : '58%',
	left : '10%',
	font:{fontSize:12},
	color : 'red'
});

forgotView.add(signinErrorMsg);
signinErrorMsg.hide();

var registerButton = Ti.UI.createImageView({
	image : 'submit.png',
	top : '61%',
	right : '10%',
});

forgotView.add(registerButton);

var loginButton =  Ti.UI.createButton({
	backgroundImage: 'green_bg.png',
    title:'Back',
    height: 27,
    width: 55,
	top : '61%',
	right : '30%',
	color:'#fff',
	font:{fontSize:15,fontWeight:'bold',fontName : 'Helvetica'}
});

forgotView.add(loginButton);

registerButton.addEventListener('click',function(){
	
	var emailAddress = email.value;
	
	if(emailAddress != '' && emailAddress != null)
	{
		var pattern=/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
	    if(pattern.test(emailAddress)){         
			
			//sending request to server
			var serverURL = Ti.App.Properties.getString('baseurl')+'ForgetPassword';
			var xhr = Titanium.Network.createHTTPClient();    
		    
		    xhr.open("POST", serverURL);
		 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
		    
		    var params = { Email : emailAddress };
		 	var widgets = JSON.stringify(params);
		 	
		 	xhr.send(widgets);
		   
		    xhr.onload = function(){
		     //alert("responseText: " + this.responseText);
		     if(this.status == '200'){
		        
		        console.log(this.responseText);
		        
		        if(this.readyState == 4){
		        	
		        	var parsed_data = JSON.parse(this.responseText);	
		        	console.log(parsed_data);
		        	
		        	var status = parsed_data.status;
		        	signinErrorMsg.setText(status);
		        	signinErrorMsg.show();
		        	
		          	
		        }else{
		          alert('HTTP Ready State != 4');
		        }           
		     }else{
		        alert('Transmission failed. Try again later. ' + this.status + " " + this.response);
		     }              
		    };
		 
		    xhr.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);};
			
	    }else{   
			signinErrorMsg.setText('Invalid email address.');
			signinErrorMsg.show();   
	    }
	}
	else
	{
		signinErrorMsg.show();
	}
});

loginButton.addEventListener('click',function(){
	currentWindow.close();
});

currentWindow.addEventListener('focus',function(){
	signinErrorMsg.hide();
});

currentWindow.addEventListener('return',function(){
	forgotView.scrollTo(0, 0);
});
