var chatWindowObj = Ti.UI.currentWindow;

chatWindowObj.setBackgroundImage('bg.png');

var headerView = Ti.UI.createView({
	top : 0,
	height : '13%',
	backgroundImage : 'headerbg.png',
});

var headerLeftIconImage = Ti.UI.createImageView({
	top : '30%',
	left : '5%',
	image : 'smalllogo.png',
});

headerView.add(headerLeftIconImage);

var headerRightIconImage = Ti.UI.createImageView({
	top : '30%',
	right : '5%',
	image : 'smalllogo.png',
});

headerView.add(headerRightIconImage);

var headerLabel = Ti.UI.createLabel({
	text : 'Chat',
	top : '30%',
	textAlign : 'center',
	color : '#fff'
});

headerView.add(headerLabel);

chatWindowObj.add(headerView);
/*headerImage.addEventListener('click',function(e)
{
	
	alert(e.source.custid);
	
	
})
*/
