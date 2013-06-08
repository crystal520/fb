
var win = Ti.UI.currentWindow;
var but = Ti.UI.createButton({title:'back'});
but.addEventListener('click',function()
{
	win.close();
});

win.add(but);

win.open()
