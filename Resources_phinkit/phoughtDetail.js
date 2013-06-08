Ti.include('birdhouse-debug.js');

var BH = new BirdHouse({
    consumer_key: "MRUiM8SfDjMBn8QAyheCPA",
    consumer_secret: "hskQCPiP9ZBGn4r33XNhTCYewHOmoyxrGDfe59Ylo0",
    callback_url:""
});

var phoughtDetailWindowObj = Ti.UI.currentWindow;

phoughtDetailWindowObj.setBackgroundImage('bg.png');

/******Header View Start********/
/*
var headerModule = require('header').addHeader;
var headerView = new headerModule('Add Phought');

phoughtDetailWindowObj.add(headerView);
*/

var title = 'Add Phought';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');

phoughtDetailWindowObj.addEventListener('focus',function(){
	if(notificationView != '' && notiFlag == 1)
	{
		phoughtDetailWindowObj.remove(notificationView);	
		notiFlag = 0;
	}
	getLatestNotifications();
});

/******Header View End********/

/*****Content View Start*****/

var phoughtContentView = Ti.UI.createView({
	top : '1%',
	backgroundColor: 'transparent',
  	width:320,
  	backgroundImage : 'bgprofile.png',
  	//height:350,
});

var backButton = Ti.UI.createButton({
    backgroundImage: 'green_bg.png',
    title:'Back',
    height: 28,
    width: 51,
    top:'15%',
    left:'3%',
});

phoughtDetailWindowObj.add(backButton);

backButton.addEventListener('click',function(e){
	Ti.UI.currentWindow.close();
});

var PhoughtScrollView = Ti.UI.createScrollView({
	 width:'auto',
 	 height:'auto',
   	 contentHeight:'auto',
     contentWidth:'auto',
     top:95
});
PhoughtScrollView.add(phoughtContentView)
phoughtDetailWindowObj.add(PhoughtScrollView);

phoughtDetailWindowObj.addEventListener('return',function(){
	PhoughtScrollView.scrollTo(0, 0);
});

var phoughtImageView = Ti.UI.createImageView({
	top : '7%',
	//left : '25%',
	//right : '1%',
	width : 272,
	height : 140,
	borderColor:'#fff',
	borderRadius:10,
	borderWidth:3,
	image : 'phought_image1.png'
});

var addGroupImageButton = Ti.UI.createButton({
	title : '+',
	bottom : 0,
	right : 0,
	height : 30,
	width : 30,
	font:{fontSize:16,fontWeight:'bold'},
});

phoughtContentView.add(phoughtImageView);
phoughtImageView.add(addGroupImageButton);

var phoughtTextArea = Ti.UI.createTextArea({
	top : '58%',
	width : '272',
	height : '85',
	backgroundColor : 'transparent',
	backgroundImage : 'textareabg.png',
	value : 'Enter your latest news here..',
	font:{fontSize:15,fontName : 'Helvetica'},
	color:'#fff'
});

phoughtContentView.add(phoughtTextArea);

phoughtTextArea.addEventListener('focus',function(e){
	if(e.value ==  'Enter your latest news here..')
	{
		phoughtTextArea.value = '';
	}
});

phoughtTextArea.addEventListener('blur',function(e){
	if(e.value ==  '')
	{
		phoughtTextArea.value = 'Enter your latest news here..';
	}
});

var phoughtBottomView = Ti.UI.createView({
	left : '7%',
	bottom : '5%',
	height : '8%',
	width : '87%',
});

phoughtContentView.add(phoughtBottomView);

var checkboxFb = Ti.UI.createImageView({
    left : '1%',
	top : '25%',
    width: 'auto',
    height: 'auto',
    image: 'checkbox.png',
    value: false //value is a custom property in this casehere.
});
 
//Attach some simple on/off actions
checkboxFb.on = function() {
    this.image = 'checkbox_selected.png';
    this.value = true;
};
 
checkboxFb.off = function() {
    this.image = 'checkbox.png';
    this.value = false;
};
 
checkboxFb.addEventListener('click', function(e) {
    if(e.source.value == false) {
        e.source.on();
    } else {
        e.source.off();
    }
});

phoughtBottomView.add(checkboxFb);

var fbIcon = Ti.UI.createImageView({
	image : 'fbicon.png',
	left : '10%',
	top : '25%'
});

phoughtBottomView.add(fbIcon);

var checkboxtwitter = Ti.UI.createImageView({
    left : '24%',
	top : '25%',
    width: 'auto',
    height: 'auto',
    image: 'checkbox.png',
    value: false //value is a custom property in this casehere.
});
 
//Attach some simple on/off actions
checkboxtwitter.on = function() {
    this.image = 'checkbox_selected.png';
    this.value = true;
};
 
checkboxtwitter.off = function() {
    this.image = 'checkbox.png';
    this.value = false;
};
 
checkboxtwitter.addEventListener('click', function(e) {
	if(e.source.value == false) {
        e.source.on();
    } else {
        e.source.off();
    }
});

phoughtBottomView.add(checkboxtwitter);

var twitterIcon = Ti.UI.createImageView({
	image : 'twiticon.png',
	left : '33%',
	top : '25%'
});

phoughtBottomView.add(twitterIcon);

var cameraIcon = Ti.UI.createImageView({
	image : 'camicon.png',
	left : '46%',
	top : '27%'
});

//phoughtBottomView.add(cameraIcon);

addGroupImageButton.addEventListener('click', function() {
	
		var t = Titanium.UI.create2DMatrix();
		t = t.scale(0);
	
		var w = Titanium.UI.createWindow({
			backgroundColor:'none',
			backgroundImage : 'bg.png',
			borderWidth:8,
			borderColor:'#999',
			height:400,
			width:300,
			borderRadius:10,
			opacity:0.92,
			transform:t
		});
	
		// create first transform to go beyond normal size
		var t1 = Titanium.UI.create2DMatrix();
		t1 = t1.scale(1.1);
		var a = Titanium.UI.createAnimation();
		a.transform = t1;
		a.duration = 200;
	
		// when this animation completes, scale to normal size
		a.addEventListener('complete', function()
		{
			Titanium.API.info('here in complete');
			var t2 = Titanium.UI.create2DMatrix();
			t2 = t2.scale(1.0);
			w.animate({transform:t2, duration:200});
		});
	
		//create a button from camera or gallary
		var c = Titanium.UI.createButton({
			title:'From Camera',
			top : '30%',
			height:30,
			width:200
		});
		
		w.add(c);
		c.addEventListener('click', function()
		{
			var t3 = Titanium.UI.create2DMatrix();
			t3 = t3.scale(0);
			w.close({transform:t3,duration:300});
			
			Ti.Media.showCamera({
			
			success : function(event){
				Ti.API.info(event);
				var cropRect = event.cropRect;
				var image = event.media;
				Ti.API.info("image :"+image);
				Ti.API.debug('Our type was: '+event.mediaType);
				
				if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
				{
					var filename = new Date().getTime() + '_mobile.png';
					
					var createdFile = Titanium.Filesystem.getFile(Ti.Filesystem.tempDirectory,filename);
					createdFile.write(image);
					
					var blob =createdFile.read();
					var blob1=Ti.Utils.base64encode(blob);
					
					phoughtImageView.image = event.media;
					
					Ti.App.Properties.removeProperty('profile_mobile_image');
					Ti.App.Properties.setString('profile_mobile_image',filename);
					
					//alert('here ' + Ti.App.Properties.get('profile_image'));
					
					Ti.App.Properties.removeProperty('base64image');
					Ti.App.Properties.setString('base64image',blob1);
					//Ti.App.Properties.setString('base64image',event.media);
					console.log('base64code for image');
					//console.log(blob1);
				}
				else
				{
					alert("got the wrong type back ="+event.mediaType);
				}
				},
				
				cancel : function(){
					
				},
				
				error : function(error){
					
					var a = Ti.UI.createAlertDialog({title : 'Camera'});
					
					if(error.code == Titanium.Media.NO_CAMERA)
					{
						a.setMessage('Please run this test on device');
					}
					else
					{
						a.setMessage('Unexpected error: ' + error.code);
					}
					// show alert
					a.show();
				},
				
				saveToPhotoGallery:true,
				allowEditing:true,
				mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
			});
		});
		
		var g = Titanium.UI.createButton({
			title:'From Gallery',
			top : '50%',
			height:30,
			width:200
		});
		w.add(g);
		
		g.addEventListener('click', function()
		{
			var t3 = Titanium.UI.create2DMatrix();
			t3 = t3.scale(0);
			w.close({transform:t3,duration:300});
			
			Ti.Media.openPhotoGallery({
	               success: function(e)
	               {
		           		var filename  = new Date().getTime() + '_mobile.png';
		                var tmp = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory,filename);
		                tmp.write(e.media);
		                var blob = tmp.read();
		                var blob1=Ti.Utils.base64encode(blob);
		                phoughtImageView.image = e.media;
					
						Ti.App.Properties.removeProperty('profile_mobile_image');
						Ti.App.Properties.setString('profile_mobile_image',filename);
						Ti.App.Properties.removeProperty('base64image');
						Ti.App.Properties.setString('base64image',blob1);
				   }
			});		   
	 	});
		var b = Titanium.UI.createButton({
			title:'Close',
			top : '70%',
			height:30,
			width:200
		});
		w.add(b);
		
		b.addEventListener('click', function()
		{
			var t3 = Titanium.UI.create2DMatrix();
			t3 = t3.scale(0);
			w.close({transform:t3,duration:300});
		});
	
		w.open(a);
});

var phinkitButton = Ti.UI.createImageView({
	image : 'phinkitbtn.png',
	right : '1%',
});

phinkitButton.addEventListener('click',function(e){
		
	var textToSent = phoughtTextArea.value;
	var fbToken = Ti.App.Properties.getString('fbToken');
	var twToken = Ti.App.Properties.getString('twToken');
	var sendToHomeflag = true;
	var sendToTwitter = true;
	
	if(textToSent != '' && textToSent != 'Enter your latest news here..')
	{
		sendToHome();
		
		function sentToFacebook()
		{
			sendToTwitter = false;
			   
			   if(Titanium.Facebook.loggedIn >=1)
			   {
			   		Titanium.Facebook.requestWithGraphPath('me/feed', {message : textToSent}, "POST", function(e){
						if(e.success)
						{
							 alertDialog = Ti.UI.createAlertDialog({
					              message:'Successfully posted on fb wall',
					              buttonNames: ['OK']
					         });
					          
					         alertDialog.show();
										
							 alertDialog.addEventListener('click',function(e){
							 	if(checkboxtwitter.value)
								{
									sendTwitt();
								}
								else
								{
									phoughtDetailWindowObj.close();		
								}
							 });	
							
						}
						else
						{
							if(e.error)
							{
								alert(e.error);
							}
							else
							{
								alert("Some error occure with facebook");
							}
							
							if(checkboxtwitter.value)
							{
								sendTwitt();
							}
						}
				   });
			   }
			   else
			   {
			   		Titanium.Facebook.authorize();
			   		Titanium.Facebook.addEventListener('login', function(e) {
					    if (e.success) {
					       
					       
					       Titanium.Facebook.requestWithGraphPath('me/feed', {message : textToSent}, "POST", function(e){
							if(e.success)
							{
								 alertDialog = Ti.UI.createAlertDialog({
						              message:'Successfully posted on fb wall',
						              buttonNames: ['OK']
						         });
						          
						         alertDialog.show();
											
								 alertDialog.addEventListener('click',function(e){
								 	if(checkboxtwitter.value)
									{
										sendTwitt();
									}
								 });	
								
							}
							else
							{
								if(e.error)
								{
									alert(e.error);
								}
								else
								{
									alert("Some error occure with facebook");
								}
								
								if(checkboxtwitter.value)
								{
									sendTwitt();
								}
							}
					   });
					       
					    } else if (e.error) {
					        alert(e.error);
					    } else if (e.cancelled) {
					        alert("Cancelled");
					    }
					});
			   }
			
			  /****************************************/
		}
		
		
		/*
		 *  twitt on twiiter 
		 * 
		 * */
		
		function sendTwitt () {
			
			BH.authorize(function(e) 
		    {
	           if (e===true) 
	           {
	              BH.send_tweet(textToSent,function(e){
		       	      	if(e)
		       	      	{
		       	      		alert('Tweet is send');
		       	      		phoughtDetailWindowObj.close();		
		       	      	}
		       	      	else
		       	      	{
		       	      		alert('Tweet is not send');
		       	      	}
	              });
	           } 
	           else 
	           {
	               alertDialog.message = 'Failed to authorize.';
	           }
		 });
	  
	    }
	   
	    		
		function sendToHome() 
		{
			var userid = Ti.App.Properties.getString('userid');
			var params = {"UserId" : userid, 
			"PhoughtTextMessage" : phoughtTextArea.value, 
			"IsTwitterCheck" : checkboxtwitter.value,  
			"IsFacebookCheck" : checkboxFb.value, 
			"fb_Token" : fbToken, 
			"twitter_Token" : twToken,
			"PhoughtImageName" : Ti.App.Properties.getString('profile_mobile_image'),
			"PhoughtImageBase64Content" : Ti.App.Properties.getString('base64image')
			};
			var cwidgets = JSON.stringify(params);
			
			console.log(cwidgets);
			
			var serverURL = Ti.App.Properties.getString('baseurl')+'InsertPhoughtOnHomeStreamAndFacebookAndTwitter';
			var pxhr = Titanium.Network.createHTTPClient();
			console.log(serverURL);
			pxhr.open("POST", serverURL);
	 		pxhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
			
			pxhr.send(cwidgets);
			
			pxhr.onload = function(){
				if(this.status == '200'){
	       			console.log(this.responseText);
			        if(this.readyState == 4){
			        	var parsed_data = JSON.parse(this.responseText);
			        	console.log(parsed_data);
			        	
			        	if(parsed_data != '' && parsed_data != null)
			        	{
			        		if(parsed_data.Status == 'Success')
				        	{
				        		if(checkboxFb.value == false && checkboxtwitter.value == false)
				        		{
				        			phoughtDetailWindowObj.close();					        		
				        		}
				        		
				        		if(checkboxFb.value && fbToken != '')
								{
									alert(parsed_data.Message);
									sentToFacebook();
								}
								
								if(checkboxtwitter.value && sendToTwitter==true)
								{
									alert(parsed_data.Message);
									sendTwitt();
								}
									
				        	}
				        	else
				        	{
				        		alert('Transmission failed. Try again later. ');
				        	}
			        	}
			        	else
			        	{
			        		alert('Transmission failed. Try again later. ');
			        	}
			        	
			        	phoughtTextArea.value = 'Enter your latest news here..';
			        	
			        }
			   	}
			}
			
			pxhr.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);};  
		
		}
		
	}
	else
	{
		alert('Please enter news to send');
	}
	
});

phoughtBottomView.add(phinkitButton);
/*****Content View End*******/