
var win = Ti.UI.currentWindow;

var but = Ti.UI.createButton({title:'up', top : "0dp" , flag : true});
but.addEventListener('click',function()
{
	if(but.flag)
	{
		view.animate({height: "300dp",  duration:1000});
		but.flag = false;
		but.title = "down";
	}
	else
	{
		view.animate({height: "150dp",  duration:1000});
		but.flag = true;
		but.title = "up";
	}
});


var view = Ti.UI.createView
({
	height : "150dp",
	bottom : "0dp",
	backgroundColor : "orange"
});

var tView = Titanium.Map.createView
({
    mapType: Titanium.Map.STANDARD_TYPE,
    region: {latitude:37.389569, longitude:-122.050212,
            latitudeDelta:0.1, longitudeDelta:0.1},
    userLocation:false,
});
view.add(tView);

win.add(view);
win.add(but);

win.open()
