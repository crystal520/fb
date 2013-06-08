Ti.include('birdhouse.js');

var BH = new BirdHouse({
    consumer_key: "MRUiM8SfDjMBn8QAyheCPA",
    consumer_secret: "hskQCPiP9ZBGn4r33XNhTCYewHOmoyxrGDfe59Ylo0",
    callback_url:""
});

/*
// ELEMENTS
var alertDialog = Ti.UI.createAlertDialog({
	title: 'Twitter Message',
	buttonNames: ['OK']
});
*/

var phoughtWindowObj = Ti.UI.currentWindow;

phoughtWindowObj.setBackgroundImage('bg.png');

/******Header View Start********/

setTimeout(function(){
	//actInd.hide();
	var headerModule = require('header').addHeader;
	var headerView = new headerModule('Phoughts');
	
	phoughtWindowObj.add(headerView);
},5000);

/******Header View End********/

/******Content View Start********/
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
    style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
});

actInd.hide();

phoughtWindowObj.add(actInd);

var phoughtView = Ti.UI.createView({
	top : '15%',
	height : '37%',
	backgroundImage : 'bgphought.png'
});

var profileImage = Ti.UI.createImageView({
	image : Ti.App.Properties.getString('profileLargeImage'),
	top : '10%',
	left:10,
	height:85,
	width:88,
	borderRadius:3,
	borderWidth:3,
	borderColor:'#fff',
});

phoughtView.add(profileImage);

var phoughtTextArea = Ti.UI.createTextArea({
	backgroundColor : 'transparent',
	backgroundImage : 'phoughttextarea.png',
	value : 'Enter your latest news here..',
	right : '3%',
	top : '10%',
	width : '194',
	height : '84',
	color : '#fff'
});

phoughtTextArea._hintText = phoughtTextArea.value;

phoughtTextArea.addEventListener('focus',function(e){
	if(e.source.value == e.source._hintText){
		e.source.value = "";
	}
});

phoughtTextArea.addEventListener('blur',function(e){
	if(e.source.value == ""){
		e.source.value = e.source._hintText;
	}
});

phoughtView.add(phoughtTextArea);

var phoughtBottomView = Ti.UI.createView({
	right : '3%',
	bottom : '10%',
	height : '20%',
	width : '60%',
});

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
    
    var isfbcredentials = Ti.App.Properties.getBool('isFbCredentials');
    var fbToken = Ti.App.Properties.getString('fbToken');
    
    if(fbToken == '' && !isfbcredentials)
    {
    	Ti.App.Properties.setBool('isfbcheckboxclicked',true);
    	Titanium.Facebook.authorize(); // Facebook authorization(login)
    }
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
	left : '12%',
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
 	//alert('twitter is on');
    var isTwitterCredentials = Ti.App.Properties.getBool('isTwitterCredentials');
    var twToken = Ti.App.Properties.getString('twToken');
    
    if(twToken == '' && !isTwitterCredentials)
    {
    	
    	//alert('twitter clicked');
    	/*
    	BH.authorize(function (e){
			if (e===true) {
				//alertDialog.message = 'Successfully authorized.';
			} else {
				//alertDialog.message = 'Failed to authorize.';
			}
			alertDialog.show();
		});
		*/
		
    }
   
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

/*var checkboxCamera = Ti.UI.createImageView({
    left : '47%',
	top : '25%',
    width: 'auto',
    height: 'auto',
    image: 'checkbox.png',
    value: false //value is a custom property in this casehere.
});
 
//Attach some simple on/off actions
checkboxCamera.on = function() {
    this.image = 'checkbox_selected.png';
    this.value = true;
};
 
checkboxCamera.off = function() {
    this.image = 'checkbox.png';
    this.value = false;
};
 
checkboxCamera.addEventListener('click', function(e) {
    if(e.source.value == false) {
        e.source.on();
    } else {
        e.source.off();
    }
});

phoughtBottomView.add(checkboxCamera);*/

var cameraIcon = Ti.UI.createImageView({
	image : 'camicon.png',
	left : '58%',
	top : '25%'
});

phoughtBottomView.add(cameraIcon);

cameraIcon.addEventListener('click',function(){
	
	var phoughtDetailWindowObj = Ti.UI.createWindow({
		url : 'phoughtDetail.js'
	});
	
	//phoughtDetailWindowObj.open();
	Ti.UI.currentTab.open(phoughtDetailWindowObj);
});

var phinkitButton = Ti.UI.createImageView({
	image : 'phinkitbtn.png',
	right : '1%',
});

phoughtBottomView.add(phinkitButton);

phoughtView.add(phoughtBottomView);

phoughtWindowObj.add(phoughtView);

var phoughtLabel = Ti.UI.createLabel({
	top : '53%',
	left : '3%',
	text : 'Phinkit Flow',
	color : '#fff',
	font:{fontSize:15}
});

phoughtWindowObj.add(phoughtLabel);

/*****Scrollable contents**/
var scrollView = Titanium.UI.createScrollView({
	top : '60%', 
	left : '1%',
	width : '317',
	contentWidth: 'auto',
    contentHeight: 'auto',
	showVerticalScrollIndicator:true, 
	showHorizontalScrollIndicator:false,
}); 

/*
for(var i = 1;i<=10;i++)
{
	var row = Titanium.UI.createTableViewRow({
		width : '317',
		height : '55',
		backgroundColor : 'transparent',
		backgroundImage : 'phought.png'
	});
	
	row.phoughtId = i;
	var imageName = '';
	var detail = '';
	if(i==1)
	{
		imageName = 'memproflile.png';
		detail = 'PR Superstar - my new book!';
	}
	else
	{
		imageName = 'phoughtimage.png';
		detail = 'Title '+i;
	}
	var userImage = Ti.UI.createImageView({
		top : '15%',
		left : '3%',
		image : imageName,
		height : 39,
		width : 39
	});
	
	row.add(userImage);
	
	var label = Ti.UI.createLabel({
		left : '20%',
		textAlign : 'center',
		text: detail,
		color : '#fff'
	});
	
	row.add(label);
	
	inputData.push(row);
}
*/

var tableView = Titanium.UI.createTableView({
	top : '1%',
	height : 'auto',
    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
    backgroundImage : 'bg.png'
});

tableView.addEventListener('click',function(e){
	//showDetailPage(e);
});



phoughtWindowObj.add(scrollView);

function showDetailPage(e)
{
	var rowdata = e.rowData;
	//alert(rowdata.phoughtId);
	
	/*var phoughtDetailWindow = Titanium.UI.createWindow({
		url : 'phoughtDetail.js',
		navBarHidden : false,
		barImage : 'headerbg.png',
		backButtonTitleImage : 'smalllogo.png',
		barColor : 'green'
		
	});
	*/
	var url = '';
	if(rowdata.phoughtId == 1)
	{
		url = 'memexDetail.js';
	}
	else
	{
		url = 'phoughtDetail.js';
	}
	var phoughtDetailWindow = Titanium.UI.createWindow({
		url : url,
	});
	phoughtDetailWindow.phought_id = rowdata.phoughtId;
	
	/*var nav = Ti.UI.iPhone.createNavigationGroup({
		window : phoughtDetailWindow
	});
	
	*/
	
	Ti.UI.currentTab.open(phoughtDetailWindow,{animate:true});
	
}
/******Content View End********/

/*headerImage.addEventListener('click',function(e)
{
	
	alert(e.source.custid);
	
	
})
*/

phinkitButton.addEventListener('click',function(e){
		
	var textToSent = phoughtTextArea.value;
	var fbToken = Ti.App.Properties.getString('fbToken');
	var twToken = Ti.App.Properties.getString('twToken');
	var sendToHomeflag = true;
	var sendToTwitter = true;
	
	if(textToSent != '' && textToSent != 'Enter your latest news here..')
	{
		if(checkboxFb.value && fbToken != '')
		{
			   /*
			    * Edited By Rahul 
			    * Date : 21-nov-2012
 			    * 
			    * */
			   sendToTwitter = false;
			   sendToHomeflag = false;
			   
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
									sendToHome();
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
							else
							{
								sendToHome();

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
									else
									{
										sendToHome();
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
								else
								{
									sendToHome();
	
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
			//Ti.API.info('Checkbox value' + checkboxtwitter.value + '  twiter tokein value'+ twToken);
			
			if(BH.authorized)
			{
				BH.tweet(textToSent,function(resp)
				{
					Ti.API.info('twitter response' + resp);
					if (resp == true) 
					{
						alert('Your tweet is sent');
						sendToHome();
					} 
					else 
					{
						alert('Your tweet not sent');
						sendToHome();
						
					}
				});
			}
			else
			{
				BH.authorize(function(e){
					if(e)
					{
						BH.tweet(textToSent,function(resp){
							if (resp == true) 
							{
								alert('Your tweet is sent');
								sendToHome();
							} 
							else 
							{
								alert('Your tweet not sent');
								sendToHome();
							}
						});
					}
					else
					{
						alert('some error is ocurr while login with twitter');
					}
				});
			}  
		}
		
		/*******************/
		
		
		if(checkboxtwitter.value && sendToTwitter)
		{
			sendTwitt();
		}
	
		
		
		/*Old code for send text to twiiter**/
		/*
		if(checkboxtwitter.value &&  twToken != '')
		{
			//alert('This will going to twitter');
			//alert('sending phought on twitter....');
			/*
			BH.tweet("some text",function(){
		          alertDialog = Ti.UI.createAlertDialog({
		              message:'Tweet posted!'
		          });
		          alertDialog.show();
		      });
		      */
			/*
			BH.tweet(textToSent,function(resp){
				if (resp===true) {
					alertDialog.message = 'Your tweet was sent!';
				} else {
					alertDialog.message = 'Your tweet was not sent :(';
				}
				alertDialog.show();
			});
			
			*/
			//var params = {"status" : "My test tweet"};
			//var cwidgets = JSON.stringify(params);
			//https://api.twitter.com/oauth/request_token?oauth_consumer_key=8I5WXip8J7T2zBx9cYnvmA&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1352981631&oauth_nonce=aa6cd36do5klR5Gd2o3LfKfgipOLKGm0TZfzEEtNdr&oauth_version=1.0&oauth_signature=u%2BrqVOLia7qPpmshPwmY4RQWtOQ%3D
			/*
			var cwidgets = [['oauth_token' ,twToken],['status','Hey @ziodave, I managed to use the #oauth adapter for @titanium consuming @twitterapi']];
			console.log(cwidgets);
			
			var serverURL = 'https://api.twitter.com/1/statuses/update.json';
			var pxhr = Titanium.Network.createHTTPClient();
			
			pxhr.open("POST", serverURL);
	 		//pxhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
			
			pxhr.send(cwidgets);
			
			pxhr.onload = function(){
				if(this.status == '200'){
	       			console.log(this.responseText);
			        if(this.readyState == 4){
			        	var parsed_data = JSON.parse(this.responseText);
			        	console.log(parsed_data);
			        }
			   	}
			}
			
			pxhr.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);};
		}
		*/
		/************************End*****************************/
		
		
		function sendToHome() 
		{
			var userid = Ti.App.Properties.getString('userid');
			var params = {"UserId" : userid, "PhoughtTextMessage" : phoughtTextArea.value, "IsTwitterCheck" : checkboxtwitter.value,  "IsFacebookCheck" : checkboxFb.value, "fb_Token" : fbToken, "twitter_Token" : twToken};
			var cwidgets = JSON.stringify(params);
			
			console.log(cwidgets);
			
			var serverURL = Ti.App.Properties.getString('baseurl')+'InsertPhoughtOnHomeStreamAndFacebookAndTwitter';
			var pxhr = Titanium.Network.createHTTPClient();
			
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
				        		alert(parsed_data.Message);
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
			        	
			        	//getAllHomeList();
			        }
			   	}
			}
			
			pxhr.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);};  
		
		}
		
		if(sendToHomeflag)
		{
			sendToHome();
		}
		
	}
	else
	{
		alert('Please enter news to send');
	}
	
});


phoughtWindowObj.addEventListener('focus',function(){
	scrollView.scrollTo(0,0);
	getAllHomeList();
});


function getAllHomeList(){
	
	var inputData = [];
	var currentDate = new Date();
	var fromdate = '\/Date(' + currentDate.getTime() + ')\/';
	
	currentDate.setDate(currentDate.getDate()-7);
	
	var todate = '\/Date(' + currentDate.getTime() + ')\/';
	var userid = Ti.App.Properties.getString('userid');
	var params = {"UserId" : userid, "DateFrom" : fromdate, "DateTo" : todate,  "RelatedUserId" : null};
	var cwidgets = JSON.stringify(params);
	
	console.log(cwidgets);
	
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetHomeStreamAllDataList2';
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open("POST", serverURL);
	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
	
	console.log('Home data' + serverURL);
	xhr.send(cwidgets);
	
	xhr.onload = function(){
		if(this.status == '200'){
   			console.log(this.responseText);
	        if(this.readyState == 4){
	        	var parsed_data = JSON.parse(this.responseText);
	        	console.log('Home Data=' + parsed_data);
	        	if(parsed_data.status == 'Success')
	        	{
	        		var  AllDataListObj = parsed_data.AllDataList;
	        		if(AllDataListObj != null)
	        		{
	        			var subAllDataListObj = AllDataListObj.subAllDataList;
	        			if(subAllDataListObj != null)
	        			{
	        				alert('came here');
	        				//**showing data of home screen
	        				var inputData = [];
	        				for(var i = 0, l = subAllDataListObj.length; i < l; i++)
	        				{
	        					var userImagePath = '';
	        					var userName = '';
	        					
	        					var listObj = subAllDataListObj[i];
	        					var TypeHomeStreamConnectionListObj = listObj.TypeHomeStreamConnectionList;
	        					var TypeHomeStreamPhoughtListObj = listObj.TypeHomeStreamPhoughtList;
	        					var TypeHomeStreamProfileEditListObj = listObj.TypeHomeStreamProfileEditList;
	        					var TypeMemexListObj = listObj.TypeMemexList;
	        					
	        					//**Handling connection related info on home screen
	        					if(TypeHomeStreamConnectionListObj != null)
	        					{
	        						
	        					}
	        					
	        					//**Handling phought related info on home screen
	        					if(TypeHomeStreamPhoughtListObj != null)
	        					{
	        						var phoughtEditedUserId = TypeHomeStreamPhoughtListObj[0].PhoughtUserID;
	        						var PhoughtImagePath = TypeHomeStreamPhoughtListObj[0].ImagePath;
	        						var phoughtUserName = TypeHomeStreamProfileEditListObj[0].PhoughtUser;
	        						var phoughtText = TypeHomeStreamProfileEditListObj[0].Phought;
	        						var phoughtHighFiveCount = TypeHomeStreamProfileEditListObj[0].PhoughtHiveFiveCount;
	        						var isHighFivedByLoggedInUser = TypeHomeStreamProfileEditListObj[0].IsHiveFive;
	        						var textLine = '';
	        											
	        						if(phoughtEditedUserId == userid)
	        						{
	        							userImageName = Ti.App.Properties.getString('profileSmallImage');
	        							textLine = 'You had a Phought :';
	        						}
	        						else
	        						{
	        							if(PhoughtImagePath != '' && PhoughtImagePath != '-1')
		        						{
		        							userImageName = PhoughtImagePath;
		        						}
		        						else
		        						{
		        							userImageName = 'http://development.phinkit.com/Assets/Images/profile/small.jpg';
		        						}
		        						
		        						if(phoughtUserName != '-1' && phoughtUserName != '')
		        						{
		        							detail = phoughtUserName+' had a Phought :';	
		        						}
	        						}
	        						
	        						/**comment listing for phought***/
								
									var TypePhoughtCommentsListObj = TypeHomeStreamPhoughtListObj[0].TypePhoughtCommentsList;
									
									if(TypePhoughtCommentsListObj != null)
									{
										for(var j = 0, ln = TypePhoughtCommentsListObj.length; j < ln; j++)
										{
											var commentText = TypePhoughtCommentsListObj[j].Comment;
											if(commentText != '-1' && commentText != '')
											{
												var comment_userImageName = '';
												var commentUserName = TypePhoughtCommentsListObj[j].UserFullName ;
												var isHighFivedByLoggedInUser = '';
												var commentHighFiveCount = TypePhoughtCommentsListObj[j].UserFullName ;
											}
											
										}
									}
	        					
	        					}
	        					
	        					//**Handling profile related info on home screen
	        					if(TypeHomeStreamProfileEditListObj != null)
	        					{
	        						
	        						var profileEditedUserId = TypeHomeStreamProfileEditListObj[0].UserId;
	        						userName = TypeHomeStreamProfileEditListObj[0].User;
	        						var profileUserImage = TypeHomeStreamProfileEditListObj[0].ImagePath;
	        						var textLine = '';
	        						
	        						if(profileEditedUserId == userid)
	        						{
	        							userName = 'You';
	        						}
	        					}
	        					
	        					//**Handling memex related info on home screen
	        					if(TypeMemexListObj != null)
	        					{
	        						userName = TypeMemexListObj[0].UserName;
	        						var profileUserImage = TypeHomeStreamProfileEditListObj[0].UserImagePath;
	        						var textLine = '';
	        						
	        						if(profileEditedUserId == userid)
	        						{
	        							userName = 'You';
	        						}
	        					}
	        					
	        				/*******show thoughts**********/	
	        				/*
	        						var row = Titanium.UI.createTableViewRow({
										width : '317',
										height : '75',
										backgroundColor : 'transparent',
										backgroundImage : 'memexbg.png'
									});
									
									var userImage = Titanium.UI.createImageView({
										top : '1%',
										left : '3%',
										width : '20%',
										image : 'http:\/\/development.phinkit.com\/Images\/profile\/medium.jpg',
									});
									
									row.add(userImage);
									/*
									var titleView = Ti.UI.createView({
										left : '25%',
										width : '66%',
										top : '20%',
										bottom : '18%'
									});
									
									
									var titleText = Ti.UI.createLabel({
										text : dataObj.Title,
										color : '#98bf1a',
										top : '1%',
										left : '1%',
										font : {fontSize:13}
									});
									
									titleView.add(titleText);
									
									var userNameText = Ti.UI.createLabel({
										text : userName,
										color : '#fff',
										bottom : '1%',
										left : '1%',
										font : {fontSize:12}
									});
									
									titleView.add(userNameText);
										
									row.add(titleView);
								*/
									//inputData.push(row);
	        					
	        				/******end thoughts***********/	
	        				} //end for loop
	        				alert('came here adsf');
	        				
	        				//Data(inputData);
	        				//scrollView.add(tableView);
	        			}
	        		}
	        	}
	        	actInd.hide();
	        }
	        else{
	        	actInd.hide();
	        }
	   	}
	   	else{
	   		actInd.hide();
	   	}
	}
	
	xhr.onerror = function(e){console.log(e.source);actInd.hide(); alert('Transmission error: ' + e.error);};
}
