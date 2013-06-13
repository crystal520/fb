/**
 * This file contains testing code to upload image
 * @author alien_coder
 * @access public
 */

var win = Ti.UI.currentWindow;

var but = Ti.UI.createButton
({
	title : 'back',
	top : 3,
	zIndex : 1
});
but.addEventListener('click', function() 
{
	win.close();
});
win.add(but);

var img = Ti.UI.createImageView
({
	image : "logo.png",
});
win.add(img);
var thisBlob = img.toBlob();
var thisSend = Ti.Utils.base64encode(thisBlob);
Ti.App.Properties.setString("thisSend" , thisSend);

var saveBut = Ti.UI.createButton
({
	title : 'Save',
	bottom : 3,
	zIndex : 1
});
saveBut.addEventListener('click', uploadImage);
win.add(saveBut);

var statusbaroverlay = require('mattapp.statusbar');
var requireFile = require('requireFile');

/**
 * This function is used to upload image and show progress bar in notification area
 * @author alien_coder
 * @access public
 */

function uploadImage()
{
	Ti.API.info("save button clicked");
	//win.close();
	
	statusbaroverlay.postMessage("Uploading started");

	requireFile.xhrAjax();
}
