var win = Ti.UI.currentWindow;

var but = Ti.UI.createButton({title:'click close tab' , bottom : 0});
but.addEventListener('click',function()
{
	Ti.UI.currentTabGroup.close();
});
win.add(but);


var but2 = Ti.UI.createButton({title:'set active tab' , top : 0});
but2.addEventListener('click',function()
{
	var tbgp = Ti.UI.currentTabGroup;
	tbgp.setActiveTab(1);
	
	var win1 = Ti.UI.createWindow({ backgroundColor : "orange" , url : "win.js"});
	
	var tb = tbgp.getActiveTab();
	//alert(Ti.UI.currentTab)
	tb.open(win1, {animated:true});
});
win.add(but2);