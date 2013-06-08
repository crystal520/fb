Ti.include('oauth_adapter.js');

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

var title = 'News Stream';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');

phoughtWindowObj.addEventListener('focus',function(e){
	if(notificationView != '' && notiFlag == 1)
	{
		phoughtWindowObj.remove(notificationView);	
		notiFlag = 0;
	}
	getLatestNotifications();
});

/******Header View End********/

/******Content View Start********/
var actInd = Ti.UI.createActivityIndicator({
	height : 55,
	width : 'auto',
	color : '#FFFFFF',
	backgroundColor : '#000',
	opacity : 0.9,
	borderRadius : 5,
	borderColor : '#000',
	zIndex : 1,
	font : {
		fontFamily : 'Helvetica Neue',
		fontSize : 18
	},
	message : ' Loading Data...',
	style : Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
});

actInd.hide();

phoughtWindowObj.add(actInd);

var phoughtView = Ti.UI.createView({
	top : '15%',
	height : '37%',
	backgroundImage : 'bgphought.png'
});

var subHeaderView = Ti.UI.createView({
	top : '13%',
	height : '10%',
	backgroundImage : 'none',
	backgroundColor : 'transparent'
});

var btn_phoughtLabel = Ti.UI.createButton({
	title : 'Add Phought',
	top : 5,
	height : 32,
	width : 300,
	backgroundImage : 'headerbg.png',
	textAlign : 'Center',
	font:{fontSize:15,fontFamily:'Helvetica Neue',fontWeight:'bold'},
	borderRadius : 5,
	zIndex : 999
});

btn_phoughtLabel.addEventListener('click', function() {

	var phoughtDetailWindowObj = Ti.UI.createWindow({
		url : 'phoughtDetail.js'
	});

	Ti.UI.currentTab.open(phoughtDetailWindowObj);
});

subHeaderView.add(btn_phoughtLabel);

phoughtWindowObj.add(subHeaderView);

var profileImage = Ti.UI.createImageView({
	image : Ti.App.Properties.getString('profileLargeImage'),
	top : '10%',
	left : 10,
	height : 85,
	width : 88,
	borderRadius : 3,
	borderWidth : 3,
	borderColor : '#fff',
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

phoughtTextArea.addEventListener('focus', function(e) {
	if (e.source.value == e.source._hintText) {
		e.source.value = "";
	}
});

phoughtTextArea.addEventListener('blur', function(e) {
	if (e.source.value == "") {
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
	left : 0,
	top : '25%',
	width : 'auto',
	height : 'auto',
	image : 'checkbox.png',
	value : false //value is a custom property in this casehere.
});

//Attach some simple on/off actions
checkboxFb.on = function() {
	this.image = 'checkbox_selected.png';
	this.value = true;

	var isfbcredentials = Ti.App.Properties.getBool('isFbCredentials');
	var fbToken = Ti.App.Properties.getString('fbToken');

	if (fbToken == '' && !isfbcredentials) {
		Ti.App.Properties.setBool('isfbcheckboxclicked', true);
		Titanium.Facebook.authorize();
		// Facebook authorization(login)
	}
};

checkboxFb.off = function() {
	this.image = 'checkbox.png';
	this.value = false;
};

checkboxFb.addEventListener('click', function(e) {
	if (e.source.value == false) {
		e.source.on();
	} else {
		e.source.off();
	}
});

phoughtBottomView.add(checkboxFb);

var fbIcon = Ti.UI.createImageView({
	image : 'fbicon.png',
	left : 19,
	top : '25%',
	width : 20,
	height : 20
});

phoughtBottomView.add(fbIcon);

var checkboxtwitter = Ti.UI.createImageView({
	left : 52,
	top : '25%',
	width : 'auto',
	height : 'auto',
	image : 'checkbox.png',
	value : false //value is a custom property in this casehere.
});

//Attach some simple on/off actions
checkboxtwitter.on = function() {
	this.image = 'checkbox_selected.png';
	this.value = true;
	//alert('twitter is on');
	var isTwitterCredentials = Ti.App.Properties.getBool('isTwitterCredentials');
	var twToken = Ti.App.Properties.getString('twToken');

	if (twToken == '' && !isTwitterCredentials) {

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
	if (e.source.value == false) {
		e.source.on();
	} else {
		e.source.off();
	}
});

phoughtBottomView.add(checkboxtwitter);

var twitterIcon = Ti.UI.createImageView({
	image : 'twiticon.png',
	left : 68,
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
	left : 103,
	top : '25%'
});

phoughtBottomView.add(cameraIcon);

cameraIcon.addEventListener('click', function() {

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

//phoughtBottomView.add(phinkitButton);

//phoughtView.add(phoughtBottomView);

//phoughtWindowObj.add(phoughtView);
/*
var phoughtLabel = Ti.UI.createLabel({
top : '26%',
left : '3%',
text : 'News Stream',
color : '#fff',
font:{fontSize:15}
});

phoughtWindowObj.add(phoughtLabel);
*/
/*****Scrollable contents**/
var scrollView = Titanium.UI.createScrollView({
	top : 100,
	left : 0,
	width : 320,
	height : 300,
	bottom : 50,
	contentWidth : 'auto',
	contentHeight : 'auto',
	showVerticalScrollIndicator : false,
	showHorizontalScrollIndicator : false,
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
	height : '300',
	separatorStyle : Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
	backgroundImage : 'bg.png'
});

tableView.addEventListener('click', function(e) {
	//showDetailPage(e);
});

phoughtWindowObj.add(scrollView);

function showDetailPage(e) {
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
	if (rowdata.phoughtId == 1) {
		url = 'memexDetail.js';
	} else {
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

	Ti.UI.currentTab.open(phoughtDetailWindow, {
		animate : true
	});

}

/******Content View End********/

/*
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
/*	}

 function sendTwitt () {

 BH.authorize(function(e)
 {
 if (e===true)
 {
 BH.send_tweet(textToSent,function(e){
 if(e)
 {
 alert('Tweet is send');
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

 /*******************/
/*

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
 if(checkboxFb.value && fbToken != '')
 {
 sentToFacebook();
 }

 if(checkboxtwitter.value && sendToTwitter==true)
 {
 sendTwitt();
 }

 PhoughtsView.addEventListener('beforeload',function(){
 PhoughtsView.evalJS("var NumberOfRows='"+ 9 +"';");
 PhoughtsView.evalJS("var RowNumber='"+ 0 +"';");
 PhoughtsView.evalJS("var userid='"+ userid +"';");
 PhoughtsView.evalJS("var baseUrl='"+ Ti.App.Properties.getString('baseurl') +"';");
 });
 PhoughtsView.url = 'phoughtList.html';

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

phoughtWindowObj.addEventListener('focus', function() {
	scrollView.scrollTo(0, 0);
	
	if(Ti.App.Properties.getString('userid') != null && Ti.App.Properties.getString('userid') != '')
	{
		getAllHomeList();
	}
});

*/

scrollView.scrollTo(0, 0);

var phougthCommentText = '';
var phtId = '';

var PhoughtsView = Ti.UI.createWebView({});
function getAllHomeList() {
	if (scrollView.children.length > 0) {
		scrollView.remove(scrollView.children[0]);
	}

	var inputData = [];
	var currentDate = new Date();
	var fromdate = '\/Date(' + currentDate.getTime() + ')\/';

	currentDate.setDate(currentDate.getDate() - 1);

	var todate = '\/Date(' + currentDate.getTime() + ')\/';
	var userid = Ti.App.Properties.getString('userid');
	var params = {
		"UserId" : userid,
		"RowNumber" : 0,
		"NumberOfRows" : 89,
		"IsRefreshFlag" : currentDate.getTime()
	};
	var RowNumber = 0;
	var NumberOfRows = 9;

	console.log('parames' + params);
	var cwidgets = JSON.stringify(params);
	console.log(cwidgets);

	Ti.App.Properties.setString('webview_params', params);
	PhoughtsView.width = 320;
	PhoughtsView.top = '25%';
	PhoughtsView.bottom = '3%', PhoughtsView.left = 0, PhoughtsView.height = 360, PhoughtsView.url = 'phoughtList.html', PhoughtsView.backgroundColor = 'transperent', PhoughtsView.backgroundImage = 'none', PhoughtsView.addEventListener('beforeload', function() {
		PhoughtsView.evalJS("var NumberOfRows='" + NumberOfRows + "';");
		PhoughtsView.evalJS("var RowNumber='" + RowNumber + "';");
		PhoughtsView.evalJS("var userid='" + userid + "';");
		PhoughtsView.evalJS("var baseUrl='" + Ti.App.Properties.getString('baseurl') + "';");
	});

	phoughtWindowObj.add(PhoughtsView);

	var serverURL = Ti.App.Properties.getString('baseurl') + 'GetHomeStreamAllDataList2';
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open("POST", serverURL);
	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	console.log('Home data' + serverURL);
	//xhr.send(cwidgets);

	xhr.onload = function() {

		if (this.status == '200') {
			console.log(this.responseText);
			if (this.readyState == 4) {
				var parsed_data = JSON.parse(this.responseText);
				if (parsed_data.status == 'Success') {
					var AllDataListObj = parsed_data.AllDataList;
					if (AllDataListObj != null) {
						var subAllDataListObj = AllDataListObj.subAllDataList;
						if (subAllDataListObj != null) {
							//**showing data of home screen
							var inputData = [];
							for (var i = 0; i < subAllDataListObj.length; i++) {
								var userImagePath = 'http:\/\/development.phinkit.com\/Images\/profile\/medium.jpg';
								var userName = 'username';
								var title = 'title';

								var listObj = subAllDataListObj[i];
								var TypeHomeStreamConnectionListObj = listObj.TypeHomeStreamConnectionList;
								var TypeHomeStreamPhoughtListObj = listObj.TypeHomeStreamPhoughtList;
								var TypeHomeStreamProfileEditListObj = listObj.TypeHomeStreamProfileEditList;
								var TypeMemexListObj = listObj.TypeMemexList;

								var row = Titanium.UI.createTableViewRow({
									width : '317',
									height : '75',
									backgroundColor : 'transparent',
									backgroundImage : 'memexbg.png'
								});

								//**Handling profile related info on home screen
								if (TypeHomeStreamProfileEditListObj != null) {
									var profileEditedUserId = TypeHomeStreamProfileEditListObj[0].UserId;
									userName = TypeHomeStreamProfileEditListObj[0].User;
									userImagePath = TypeHomeStreamProfileEditListObj[0].ImagePath;
									var updated_fields = TypeHomeStreamProfileEditListObj[0].UpdatedFields;
									title = ' updated ' + updated_fields;

									if (profileEditedUserId == userid) {
										userName = 'You';
										title = 'have updated ' + updated_fields;
									} else {
										userName = userName;
										title = 'has updated ' + updated_fields;
									}
								}

								if (TypeMemexListObj != null) {
									userName = TypeMemexListObj[0].UserName;
									userImagePath = TypeMemexListObj[0].UserImagePath;
									title = TypeMemexListObj[0].Description;
									description = TypeMemexListObj[0].MemexTitle;

									var description_txt = Ti.UI.createLabel({
										text : description,
										color : '#98bf1a',
										top : 37,
										left : '25%',
										font : {
											fontSize : 12
										}
									});
									row.add(description_txt);
								}

								if (TypeHomeStreamPhoughtListObj != null) {
									userName = TypeHomeStreamPhoughtListObj[0].PhoughtUser;
									userImagePath = TypeHomeStreamPhoughtListObj[0].ImagePath;
									description = TypeHomeStreamPhoughtListObj[0].Phought;

									if (description.length > 25) {
										description = description.substring(0, 25) + '..';
									}

									title = 'had a Phought';

									var description_txt = Ti.UI.createLabel({
										text : description,
										color : '#fff',
										top : 37,
										left : '25%',
										font : {
											fontSize : 12
										}
									});

									var respond_txt = Ti.UI.createLabel({
										text : 'Respond',
										color : '#98bf1a',
										top : 37,
										left : '80%',
										font : {
											fontSize : 12
										}
									});

									row.add(description_txt);
									row.add(respond_txt);
								}

								var userImage = Titanium.UI.createImageView({
									top : 15,
									left : '3%',
									width : '20%',
									image : userImagePath,
								});

								row.add(userImage);

								var titleView = Ti.UI.createView({
									left : '25%',
									width : '66%',
									top : '20%',
									bottom : '18%',
									layout : 'horizontal'
								});

								var titleText = Ti.UI.createLabel({
									text : ' ' + title,
									color : '#fff',
									top : '1%',
									font : {
										fontSize : 13
									}
								});

								var userNameText = Ti.UI.createLabel({
									text : userName,
									color : '#98bf1a',
									top : '1%',
									font : {
										fontSize : 12
									}
								});

								titleView.add(userNameText);
								titleView.add(titleText);

								row.add(titleView);

								inputData.push(row);

							} //end for loop

						}
					}
				}
				actInd.hide();
			} else {
				actInd.hide();
			}
		} else {
			actInd.hide();
		}
	}

	xhr.onerror = function(e) {
		console.log(e.source);
		actInd.hide();
		alert('Transmission error: ' + e.error);
	};

}//end function get home list data;

Ti.App.addEventListener('showIndicator', function(e) {
	actInd.message = e.message;
	actInd.show();
});

Ti.App.addEventListener('hideIndicator', function(e) {
	actInd.hide();
});

Ti.App.addEventListener('openUrl', function(e) {

	var closeTwtBt = Ti.UI.createButton({
		title:'Close'
	});
	
	var win = Ti.UI.createWindow({
		top: 0,
		modal: true,
		fullscreen: true,
		leftNavButton:closeTwtBt
		//navBarHidden:true
	});
	
	var webView = Ti.UI.createWebView({
		url: e.url,
		scalesPageToFit: true,
		touchEnabled: true,
		top:0,
		backgroundColor: '#FFF'
	});
	
	win.add(webView);
	
	closeTwtBt.addEventListener('click',function(){
		win.close();
	});
	
	win.open({modal:true});
});	
Ti.App.addEventListener('getUserProfile', function(e) {
	var userDetailWindow = Titanium.UI.createWindow({
		url : 'showProfile.js',
	});
	userDetailWindow.user_id = e.user_id;

	Ti.UI.currentTab.open(userDetailWindow, {
		animate : true
	});
});

Ti.App.addEventListener('goToMemex', function(e) {
	var memexDetailWindow = Titanium.UI.createWindow({
		url : 'memexDetail.js',
	});
	memexDetailWindow.memex_id = e.memexId;
	memexDetailWindow.memex_ownerid = e.memexOwnerId;

	Ti.UI.currentTab.open(memexDetailWindow, {
		animate : true
	});
});

Ti.App.addEventListener('goToMemexDetail', function(e) {
	
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetBlogticleIdByBlogticleUrl';
	var xhr = Titanium.Network.createHTTPClient();    
    xhr.open("POST", serverURL);
 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    var params = { BlogticleUrl : e.url};
 	var widgets = JSON.stringify(params);
 	console.log(serverURL);
 	console.log(widgets);
 	xhr.send(widgets);
   
    xhr.onload = function()
    {
    	console.log(this.responseText);
    	
    	parsed_data = JSON.parse(this.responseText);
    	
    	if(parsed_data.Status == 'Success')
    	{
    		var memexDetailWindow = Titanium.UI.createWindow({
				url : 'memexDetail.js',
			});
			memexDetailWindow.memex_id = parsed_data.BlogticleID;
			memexDetailWindow.memex_ownerid = parsed_data.MemexOwnerId;
		
			Ti.UI.currentTab.open(memexDetailWindow,
			{
				animate : true
			});
    	}
    	else
    	{
    		alert('Memex is not present');
    	}
    };
    
    xhr.onerror = function()
    {
    	alert('Some Error Occure With Webservice');	
    }
	
});


//
Ti.App.addEventListener('removePhoughtComment', function(e) {
	if (phoughtWindowObj.viewExist) {
		phoughtWindowObj.remove(commentview);
		phoughtWindowObj.viewExist = false;
	}
});

Ti.App.addEventListener('deletePhoughtComment', function(e) {

	var del_com_phoughtId = e.pid;
	var coment_id = e.cid;
	var userid = Ti.App.Properties.getString('userid');

	var serverURL = Ti.App.Properties.getString('baseurl') + 'DeletePhoughtCommentsbyPhoughtId';
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open("POST", serverURL);
	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	var params = {
		"LoggedInUserId" : userid,
		"phoughtID" : del_com_phoughtId,
		"CommentID" : coment_id
	};

	var cwidgets = JSON.stringify(params);
	console.log(cwidgets);

	console.log('delete phougth' + serverURL);
	xhr.send(cwidgets);

	xhr.onload = function() {
		console.log(this.responseText);
		var parsed_data = JSON.parse(this.responseText);

		if (parsed_data != null && parsed_data != '') {
			var params = Ti.App.Properties.getString('webview_params');
			PhoughtsView.addEventListener('beforeload', function() {
				PhoughtsView.evalJS("var NumberOfRows='" + 9 + "';");
				PhoughtsView.evalJS("var RowNumber='" + 0 + "';");
				PhoughtsView.evalJS("var userid='" + userid + "';");
				PhoughtsView.evalJS("var baseUrl='" + Ti.App.Properties.getString('baseurl') + "';");
			});
			PhoughtsView.url = 'phoughtList.html';
		} else {
			alert('Some error Occure with webservice');
		}
	}

	xhr.onerror = function() {
		alert('error comes');
	}
});

Ti.App.addEventListener('deletePhought', function(e) {

	del_phoughtId = e.pid;

	var userid = Ti.App.Properties.getString('userid');

	var serverURL = Ti.App.Properties.getString('baseurl') + 'DeletePhoughtbyPhoughtId';
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open("POST", serverURL);
	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	var params = {
		"LoggedInUserId" : userid,
		"phoughtID" : del_phoughtId
	};

	var cwidgets = JSON.stringify(params);
	console.log(cwidgets);

	console.log('delete phougth' + serverURL);
	xhr.send(cwidgets);

	xhr.onload = function() {
		console.log(this.responseText);
		var parsed_data = JSON.parse(this.responseText);

		if (parsed_data != null && parsed_data != '') {
			if (parsed_data.Status == 'Success') {

				var params = Ti.App.Properties.getString('webview_params');
				PhoughtsView.addEventListener('beforeload', function() {
					PhoughtsView.evalJS("var NumberOfRows='" + 9 + "';");
					PhoughtsView.evalJS("var RowNumber='" + 0 + "';");
					PhoughtsView.evalJS("var userid='" + userid + "';");
					PhoughtsView.evalJS("var baseUrl='" + Ti.App.Properties.getString('baseurl') + "';");
				});
				PhoughtsView.url = 'phoughtList.html';
			} else {
				alert('Cannot delete phought');
			}
		} else {
			alert('Some error Occure with webservice');
		}
	}

	xhr.onerror = function() {
		alert('error comes');
	}
});

Ti.App.addEventListener('phoughtCommentWindow', function(e) {
	var phoughtCommentWindowObj = Ti.UI.createWindow({
		url : 'phoughtComment.js'
	});

	phoughtCommentWindowObj.phtId = e.pid;
	Ti.UI.currentTab.open(phoughtCommentWindowObj);
});

var comment_txt;

Ti.App.addEventListener('sendPhoughtComment', function(e) {

	phtId = e.pid;

	commentview = Ti.UI.createView({
		bottom : 0,
		height : 50,
		width : 'auto',
		backgroundImage : 'memexbg.png',
		zIndex : 9999
	});

	var comment_send = Titanium.UI.createButton({
		height : 30,
		top : 10,
		borderRadius : 3,
		right : 10,
		width : 75,
		title : 'Send',
		backgroundImage : 'green_bg.png',
		borderRadius : 3
	});

	var send = Titanium.UI.createButton({
		height : 30,
		top : 10,
		borderRadius : 3,
		right : 10,
		width : 75,
		title : 'Send',
		backgroundImage : 'green_bg.png',
		borderRadius : 3
	});

	comment_txt = Titanium.UI.createTextField({
		borderRadius : 3,
		width : 220,
		height : 30,
		borderRadius : 3,
		autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		backgroundColor : '#fff',
		hintText : 'Comment Here'
	});

	var comment_textfield = Titanium.UI.createTextField({
		hintText : 'Comment Here',
		borderRadius : 3,
		keyboardToolbar : [comment_txt, send],
		keyboardToolbarColor : '#3a3535',
		keyboardToolbarHeight : 40,
		top : 10,
		width : 220,
		height : 30,
		left : 10,
		zIndex : 5,
		color : '#000',
		backgroundColor : '#fff',
		autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE
	});

	commentview.add(comment_textfield);
	commentview.add(comment_send);
	phoughtWindowObj.add(commentview);
	phoughtWindowObj.viewExist = commentview;

	comment_textfield.addEventListener('focus', function() {
		comment_txt.focus();
	});

	comment_send.addEventListener('click', function(e) {
		phougthCommentText = comment_textfield.value;
		sendComment(e);
	});
	comment_txt.addEventListener('focus', function(e) {
		commentview.hide();
	});
	comment_txt.addEventListener('return', function() {
		commentview.show();
		comment_textfield.show();
		comment_send.show();
		comment_textfield.value = comment_txt.value;
	});
	send.addEventListener('click', function(e) {
		phougthCommentText = comment_txt.value;
		sendComment(e);
	});

});

function sendComment(e) {
	var userid = Ti.App.Properties.getString('userid');

	var serverURL = Ti.App.Properties.getString('baseurl') + 'SetCommentOnPhoughts';
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open("POST", serverURL);
	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	var params = {
		"LoggedInUserId" : userid,
		"CommentText" : phougthCommentText,
		"phoughtID" : phtId
	};

	var cwidgets = JSON.stringify(params);
	console.log(cwidgets);

	console.log('set comment on phougth' + serverURL);
	xhr.send(cwidgets);

	xhr.onload = function() {
		console.log(this.responseText);
		var parsed_data = JSON.parse(this.responseText);

		if (parsed_data != null && parsed_data != '') {
			if (parsed_data.Status == 'Success') {
				comment_txt.blur();
				phoughtWindowObj.remove(commentview);
				var params = Ti.App.Properties.getString('webview_params');
				PhoughtsView.addEventListener('beforeload', function() {
					PhoughtsView.evalJS("var NumberOfRows='" + 9 + "';");
					PhoughtsView.evalJS("var RowNumber='" + 0 + "';");
					PhoughtsView.evalJS("var userid='" + userid + "';");
					PhoughtsView.evalJS("var baseUrl='" + Ti.App.Properties.getString('baseurl') + "';");
				});
				PhoughtsView.url = 'phoughtList.html';
			} else {
				alert('Cannot post comment');
			}
		} else {
			alert('Some error Occure with webservice');
		}
	}

	xhr.onerror = function() {
		alert('error comes');
	}
}

/*
 var userid = Ti.App.Properties.getString('userid');
 var serverURL = Ti.App.Properties.getString('baseurl')+'SetHighFiveToPhoughts';
 var xhr = Titanium.Network.createHTTPClient();
 xhr.open("POST", serverURL);
 xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
 var obj = {
 "LoggedInUserId" : userid,
 "phoughtID" : 822,
 "IsHighFiveOrUnHighFighPhoughtStatus" : 'HighFive'
 };

 var cwidgets = JSON.stringify(obj);
 console.log(cwidgets);

 console.log('set higj five on phougth===' + serverURL);
 xhr.send(cwidgets);

 xhr.onload = function()
 {
 console.log(this.responseText);
 var parsed_data = JSON.parse(this.responseText);

 if(parsed_data != null && parsed_data != '')
 {
 if(parsed_data.Status == 'Success')
 {
 alert('done high five')
 }
 else
 {
 alert('Cannot post comment');
 }
 }
 else
 {
 alert('Some error Occure with webservice');
 }
 }

 xhr.onerror = function()
 {
 alert('error comes');
 }

 */

if(Ti.App.Properties.getString('userid') != null && Ti.App.Properties.getString('userid') != '')
{
	getAllHomeList();
}

	


