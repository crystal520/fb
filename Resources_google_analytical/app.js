var win = Ti.UI.createWindow
({
	backgroundColor : '#fff' ,
});

var but = Ti.UI.createButton({title:'click'});
but.addEventListener('click',function()
{
	var win = Ti.UI.createWindow
	({
		backgroundColor : '#f8f8f8' ,
		url : 'win.js',
		
	});	
	win.open();
});

win.add(but);

win.open()
