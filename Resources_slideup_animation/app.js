// var button = Ti.UI.createButton({
  // title:    'Click to Open Preferences'
// });
// button.addEventListener('click', function() {
  // Ti.UI.Android.openPreferences();
// });
// Ti.UI.currentWindow.add(button);

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
		url : 'win.js',
		fullscreen : false
	});	
	win.open();
});

win.add(but);

win.open()
