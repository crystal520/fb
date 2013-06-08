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
var headerView = new headerModule('Phought Detail');

phoughtDetailWindowObj.add(headerView);
*/

var title = 'Phought Detail';
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

var backButton = Ti.UI.createButton({
    backgroundImage: 'green_bg.png',
    title:'Back',
    height: 28,
    width: 51,
    top:60,
    left:'2%',
});

phoughtDetailWindowObj.add(backButton);

backButton.addEventListener('click',function(e){
	Ti.UI.currentWindow.close();
});

var PhoughtScrollView = Ti.UI.createScrollView({
	 width:'auto',
 	 height : 300,
   	 contentHeight:'auto',
     contentWidth:'auto',
     top:90,
     showVerticalScrollIndicator: true,
});

var PhoughtsView =Ti.UI.createWebView({});
var userid = Ti.App.Properties.getString('userid');

PhoughtsView.addEventListener('beforeload',function(){
	PhoughtsView.evalJS("var userid='"+ userid +"';");
	PhoughtsView.evalJS("var phtId='"+ phoughtDetailWindowObj.phtId +"';");
	PhoughtsView.evalJS("var baseUrl='"+ Ti.App.Properties.getString('baseurl') +"';");
	
});

PhoughtsView.top = '23%',
PhoughtsView.bottom = '10%',
PhoughtsView.left=0,
PhoughtsView.url='phoughtComment.html',
PhoughtsView.backgroundColor = 'transparent',
PhoughtsView.backgroundImage = 'none',


phoughtDetailWindowObj.add(PhoughtScrollView);
phoughtDetailWindowObj.add(PhoughtsView);

var phougthCommentText = '';

var commentview = Ti.UI.createView({
	bottom: 0,
	height: 50,
	width: 'auto',
	backgroundImage: 'memexbg.png',
	zIndex:9999
});

var comment_send = Titanium.UI.createButton({ 
  height: 30,
  top: 10,
  borderRadius: 3,
  right: 10,
  width: 75,
  title: 'Send',
  backgroundImage: 'green_bg.png',
  borderRadius: 3
});
  
 var send = Titanium.UI.createButton({
      height: 30,
      top: 10,
      borderRadius: 3,
      right: 10,
      width: 75,
      title: 'Send',
      backgroundImage: 'green_bg.png',
      borderRadius: 3
 });
  
var comment_txt = Titanium.UI.createTextField({
      borderRadius: 3,
      width: 220,
      height: 30,
      borderRadius: 3,
      autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
      backgroundColor: '#fff',
  	  hintText: 'Comment Here'
});
  
var comment_textfield = Titanium.UI.createTextField({
  hintText: 'Comment Here',
  borderRadius: 3,
  keyboardToolbar: [comment_txt, send],
  keyboardToolbarColor: '#3a3535',
  keyboardToolbarHeight: 40,
  top: 10,
  width: 220,
  height: 30,
  left: 10,
  zIndex: 5,
  color: '#000',
  backgroundColor: '#fff',
  autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE
});
  
  commentview.add(comment_textfield);
  commentview.add(comment_send);
  phoughtDetailWindowObj.add(commentview);
  
 comment_textfield.addEventListener('focus', function () {
      comment_txt.focus();
  });
  
  comment_send.addEventListener('click', function(e){
  	phougthCommentText =  comment_textfield.value;
  	sendComment(e);
  });
  comment_txt.addEventListener('focus', function (e) {
      //commentview.hide();
  });
  comment_txt.addEventListener('return', function () {
	commentview.show();					
	comment_textfield.show();
	comment_send.show();
	comment_textfield.value = comment_txt.value;
 });			
 send.addEventListener('click', function(e){
 	phougthCommentText =  comment_txt.value;
  	sendComment(e);
 });
  
 Ti.App.addEventListener('commentPostedSuccessfully', function(e) {
 	comment_txt.value = '';
 	comment_textfield.value = '';
 	alert('Comment Added');
  });
 
 
 Ti.App.addEventListener('deleteCommentPhought', function(e) {

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
				
				phoughtDetailWindowObj.close();
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
 
 function sendComment(e)
 {
 	comment_txt.blur();
 	
 	if(phougthCommentText == '')
 	{
 		alert('Please Enter Comment To Send');
 		return false;
 	}
 	
 	var params = {"LoggedInUserId" : userid,"CommentText":phougthCommentText, "phoughtID" : phoughtDetailWindowObj.phtId};
	
	var cwidgets = JSON.stringify(params);
	console.log('............Send Comment Params................');
	console.log(cwidgets);
	
	//return false;
 	
 	phougthCommentText = phougthCommentText.replace("'","SINGLE_QUOATE");
	PhoughtsView.evalJS("addComment('" + phougthCommentText + "')");
}


    var userid = Ti.App.Properties.getString('userid');
	var phtId = phoughtDetailWindowObj.phtId;
	
	var serverURL = Ti.App.Properties.getString('baseurl')+'ViewAllPhoughtCommentsResponses';
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open("POST", serverURL);
	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
	var params = {"LoggedInUserId" : userid,"phoughtID" : phtId};
	
	var cwidgets = JSON.stringify(params);
	console.log(cwidgets);
	
	console.log('set comment on phougth' + serverURL);
	xhr.send(cwidgets);
	
	xhr.onload = function()
	{
		console.log(this.responseText);
		var parsed_data = JSON.parse(this.responseText);
		
		if(parsed_data != null && parsed_data != '')
		{
			if(parsed_data.Status == 'Success')
			{
				
			}
			else
			{
				//alert('Cannot post comment');
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



/*****Content View End*******/
