var moreFlag = 0;
var groupChatWindowObj = Ti.UI.currentWindow;

groupChatWindowObj.setBackgroundImage('bg.png');

/******Header View Start********/

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

groupChatWindowObj.add(actInd);

var title = 'Phinkit Tank Chat';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');

groupChatWindowObj.addEventListener('focus',function(){
	if(notificationView != '' && notiFlag == 1)
	{
		groupChatWindowObj.remove(notificationView);	
		notiFlag = 0;
	}
	getLatestNotifications();
});



/*
setTimeout(function(){
	//actInd.hide();
	//alert('loading header in chat');
	var headerModule = require('header').addHeader;
	var headerView = new headerModule('Phinkit Tank Chat');
	                                                                                                                                                                                                                                                                                                                                                                                                                                           
	groupChatWindowObj.add(headerView);
},1000);
*/


/******Header View End********/
//backgroundImage:'../iphone/help_20.png',
var startNewGroup = Titanium.UI.createButton({
	width:117,
    height:28,
    title:'',
    right:9,
    top:'15%',
    borderRadius : 5,
    backgroundImage : 'start-new-tank.png'
});

startNewGroup.addEventListener('click',function(){
	var newPhinkitTank = Titanium.UI.createWindow({
		url : 'groupnew.js',
	});
	
	Ti.UI.currentTab.open(newPhinkitTank,{animated: true});

});

groupChatWindowObj.add(startNewGroup);

var groupLabel = Titanium.UI.createLabel({
	text : 'Select an existing Tank',
	top : '25%',
	left : '1%',
	color : '#fff',
	font : {fontSize:14}
});

groupChatWindowObj.add(groupLabel);

var groupNameTable = Titanium.UI.createTableView({
	top : 130,
	height : 'auto',
    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
    backgroundColor : 'transparent'
});

var inputData = [];

var grouprow1 = Titanium.UI.createTableViewRow({
	backgroundColor : 'transparent',
	backgroundImage : 'Tank-bg.png',
	height : 45
});

var groupNameText = Titanium.UI.createLabel({
	text : 'Phinkit Group 1',
	left : 10,
	color : '#98bf1a'
});

grouprow1.add(groupNameText);

var groupIndicator = Titanium.UI.createImageView({
	right : 10,
	image : 'indicator.png'
});

var groupIndicatorCount = Titanium.UI.createLabel({
	text : '8',
	color : '#fff',
	font : {fontSize:14}
});
groupIndicator.add(groupIndicatorCount);
grouprow1.add(groupIndicator);

inputData.push(grouprow1);

var grouprow2 = Titanium.UI.createTableViewRow({
	backgroundColor : 'transparent',
	backgroundImage : 'Tank-bg.png',
	height : 50
});

var groupNameText2 = Titanium.UI.createLabel({
	text : 'Phinkit Group 2',
	left : 10,
	color : '#98bf1a'
});

grouprow2.add(groupNameText2);

var groupIndicator2 = Titanium.UI.createImageView({
	right : 10,
	image : 'indicator.png',
});

var groupIndicatorCount2 = Titanium.UI.createLabel({
	text : '8',
	color : '#fff',
	font : {fontSize:14}
});
groupIndicator2.add(groupIndicatorCount2);
grouprow2.add(groupIndicator2);

inputData.push(grouprow2);
//groupNameTable.add(grouprow1);
groupNameTable.setData(inputData);
groupChatWindowObj.add(groupNameTable);

groupNameTable.addEventListener('click',function(){
	
	var newPhinkitTank = Titanium.UI.createWindow({
		url : 'groupchat.js',
	});
	
	Ti.UI.currentTab.open(newPhinkitTank,{animated: true});

});
