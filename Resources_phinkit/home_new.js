var homePageCurrentWindow = Ti.UI.currentWindow;

homePageCurrentWindow.setBackgroundImage('bg.png');

/*var footerModule = require('footer').footer;

homePageCurrentWindow.add(new footerModule);*/

var headerView = Ti.UI.createView({
	
});

var contentView = Ti.UI.createView({
	
});

var footerView = Ti.UI.createView({
	bottom : '1%',
	height:'57',width:'327',backgroundImage:'images/footerBackground.png'
});