var win;

function fireUpTheCamera()
{
	Ti.Media.showCamera({
		
		success : function(event){
			Ti.API.info(event);
			var cropRect = event.cropRect;
			var image = event.media;
			Ti.API.info("image :"+image);
			Ti.API.debug('Our type was: '+event.mediaType);
			if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
			{
				var imageView = Ti.UI.createImageView({
					image:event.media
				});
				win.add(imageView);
				Ti.App.Properties.setString('profile_image',event.media);
				win.close();
			}
			else
			{
				alert("got the wrong type back ="+event.mediaType);
			}
		},
		
		cancel : function(){
			
		},
		
		error : function(error){
			
			var a = Ti.UI.createAlertDialog({title : 'Camera'});
			
			//set message
			if(error.code == Titanium.Media.NO_CAMERA)
			{
				a.setMessage('Please run this test on device');
			}
			else
			{
				a.setMessage('Unexpected error: ' + error.code);
			}
			// show alert
			a.show();
		},
		
		saveToPhotoGallery:true,
		allowEditing:true,
		mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
	});
	
}

function call_fun() {
	win = Ti.UI.createWindow();
	if (Ti.Platform.osname === 'android') {
		win.addEventListener('open', function(e) {
			fireUpTheCamera();
		});
	} else {
		fireUpTheCamera();	
	}
	return win;
};

module.exports = call_fun;