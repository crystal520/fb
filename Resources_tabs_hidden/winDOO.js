
var win = Ti.UI.currentWindow;
var but = Ti.UI.createButton({title:'back'});
but.addEventListener('click',function()
{
	win.close();
});

win.add(but);


var but11 = Ti.UI.createButton({title:'dfew',bottom:0});
but11.addEventListener('click',function()
{
	var thiswin = Ti.UI.createWindow
	({
		backgroundColor : 'blue' ,
		url : 'winDOOO.js',
		navBarHidden: false,
		barColor : 'red' 
	});	
	Titanium.UI.currentTab.open(thiswin,{animated:true});
});

win.add(but11);

win.open()
