
var win = Ti.UI.createWindow
({
	backgroundColor : 'red' ,
});

var but = Ti.UI.createButton({title:'click'});
but.addEventListener('click',function()
{
	var win = Ti.UI.createWindow
	({
		backgroundColor : 'blue' ,
		url : 'server.js',
		
	});	
	win.open();
});

win.add(but);

win.open()
