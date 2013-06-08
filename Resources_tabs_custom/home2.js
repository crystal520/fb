alert("ok");

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