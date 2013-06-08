
var t1 = Titanium.UI.create2DMatrix().scale(0);

var win = Ti.UI.currentWindow;
win.transform = t1;

win.animate({height:2, bottom:-2 ,duration:500}, function()
{
	win.animate({height: Ti.Platform.displayCaps.platformHeight, bottom:0 , duration:500});
	var t1 = Titanium.UI.create2DMatrix().scale(1);
	win.transform = t1;
});


var but = Ti.UI.createButton({title:'back' , top : 0});
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


var butImg = Ti.UI.createButton({title:'image' , bottom : 0});
win.add(butImg);

butImg.addEventListener('click',function()
{
	 Titanium.Media.openPhotoGallery(
	 {
        success: function(e)
        {
            console.log("image = " + e);
            //imgView.image = e.media;
            
            var resizedImg = e.media.imageAsResized(300,200);
            imgView.image = resizedImg;
        },
        error: function(error)
        {
            console.log('Image Gallery Error: '+error); 
        },
        cancel: function()
        {
        },
        allowImageEditing:true
    });
});


var imgView = Ti.UI.createImageView
({
	image : "download.jpeg",
	height : 200,
	width : 300
});
win.add(imgView);
