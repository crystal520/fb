
var win = Ti.UI.createWindow
({
	backgroundColor : "blue",
});

var but = Ti.UI.createButton({title:'open' });
but.addEventListener('click',function()
{
	var winNew = Ti.UI.createWindow
	({
		url : "win.js",
		backgroundColor : "gray",
	});
	
	winNew.open();
});

win.add(but);

win.open();
