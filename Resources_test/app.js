var win = Ti.UI.createWindow
({
	backgroundColor : 'orange' ,
});

var but = Ti.UI.createButton({title:'click'});
but.addEventListener('click',function()
{
	var win = Ti.UI.createWindow
	({
		backgroundColor : 'blue' ,
		url : 'win.js',
		
	});	
	win.open();
});

win.add(but);

win.open()
