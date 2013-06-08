var butn = Ti.UI.createButton
({
	title : "click open"
});
Ti.UI.currentWindow.add(butn);

butn.addEventListener("click",function()
{
	var initWin4 = Titanium.UI.createWindow
	({  
		title:'History',
		backgroundColor:'#000',
		navBarHidden:false,
		tabBarHidden:false,
		url : "home2.js"
	});
	
	Ti.UI.currentTab.open(initWin4 , {animated : true});
});

var bb1 = Titanium.UI.createButtonBar
({
    labels:['One', 'Two', 'Three'],
    backgroundColor:'#336699',
    bottom:0,
    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
    height:30,
    width:Ti.UI.FILL
});

bb1.addEventListener('click' , function(e) 
{
	Ti.API.info(e);
	
	Ti.UI.currentTabGroup.setActiveTab(e.index);
});

Ti.UI.currentWindow.add(bb1);