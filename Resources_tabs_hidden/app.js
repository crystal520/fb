var tabGroup = Ti.UI.createTabGroup();

var win = Ti.UI.createWindow
({
	backgroundColor : 'orange' ,
	tabBarHidden : true,
	navBarHidden : true
});

var tab = Titanium.UI.createTab
({
    window:win,
});
tabGroup.addTab(tab);

var but = Ti.UI.createButton({title:'click',top:0});
but.addEventListener('click',function()
{	
	var thiswin = Ti.UI.createWindow
	({
		backgroundColor : 'blue' ,
		url : 'winDOO.js',
		navBarHidden: true,
		barColor : 'blue' 
	});	
	tab.open(thiswin,{animated:true});
});
win.add(but);

/*var but2 = Ti.UI.createButton({title:'click',bottom:0});
but2.addEventListener('click',function()
{	
	var thiswin = Ti.UI.createWindow
	({
		backgroundColor : 'green' ,
		url : 'winDOOO.js',
		navBarHidden: false,
		barColor : 'white',
	});	
	tab.open(thiswin,{animated:false});
});
win.add(but2);*/

tabGroup.open()
