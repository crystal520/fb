var win = Titanium.UI.createWindow();

var mapview = Titanium.Map.createView
({
    mapType: Titanium.Map.STANDARD_TYPE,
    region: {latitude:37.390749, longitude:-84.38993, 
            latitudeDelta:0.01, longitudeDelta:0.01},
    animate:true,
    regionFit:true,
    userLocation:true,
});
win.add(mapview);

var ann = Titanium.Map.createAnnotation
({
    latitude:37.390749,
    longitude:-84.38993,
    title:"Appcelerator Headquarters",
    subtitle:'Mountain View, CA',
    pincolor:Titanium.Map.ANNOTATION_RED,
    animate:true,
    leftButton: 'pin_auto_1.png',
    rightButton: 'pin_auto_1.png',
    yess:1 // Custom property to uniquely identify this annotation.
});

mapview.annotations = [ ann ];

mapview.addEventListener('click' , function(e)
{
	if( e.clicksource == 'rightButton' )
	{
		console.log('rightButton clicked');
		alert(JSON.stringify(e.annotation));
	}
	else if( e.clicksource == 'leftButton' )
	{
		console.log('leftButton clicked');
		alert(JSON.stringify(e.annotation));
	}
});

win.open();
