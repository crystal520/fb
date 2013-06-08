// var button = Ti.UI.createButton({
  // title:    'Click to Open Preferences'
// });
// button.addEventListener('click', function() {
  // Ti.UI.Android.openPreferences();
// });
// Ti.UI.currentWindow.add(button);

var t1 = Titanium.UI.create2DMatrix().scale(0);

var win = Ti.UI.currentWindow;
win.transform = t1;

win.animate({height:2, bottom:-2 ,duration:500}, function()
{
	win.animate({height: Ti.Platform.displayCaps.platformHeight, bottom:0 , duration:500});
	var t1 = Titanium.UI.create2DMatrix().scale(1);
	win.transform = t1;
});


var but = Ti.UI.createButton({title:'back'});
but.addEventListener('click',function()
{
	
	win.animate({height:Ti.Platform.displayCaps.platformHeight, bottom:0 ,duration:500}, function()
	{
		win.animate({height: 0, bottom:0 , duration:500});
	});
	
	setTimeout(function(){win.close();},500);
	
});

win.add(but);

win.open()
