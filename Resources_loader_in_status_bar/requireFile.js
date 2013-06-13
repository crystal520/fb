function xhrAjax()
{
	var parem = { "img" : Ti.App.Properties.getString("thisSend")};
	
	var url = "http://dev.zone2serve.me/a.wb4.dev.zone2serve.me/swaggerTestProject/lala_g/checkImageUpload.php";
	
	Ti.API.info("url = " + url + "\ndata = " + JSON.stringify(parem));
	
	var client = Ti.Network.createHTTPClient
	({
		onsendstream : function(e)
		{
    		Ti.API.info('ONSENDSTREAM - PROGRESS: ' + e.progress);
    		statusbaroverlay.postMessageInProgress("Uploading Image", e.progress);    	
		},
		onload : function(e) 
	    {
	    	Ti.API.info("Received text: " + this.responseText);
	    	statusbaroverlay.postFinishMessage("Image Uploaded Successfully", 2.0);
	    },
	    onerror : function(e) 
	    {
	        Ti.API.debug(e.error);
	        statusbaroverlay.postErrorMessage("Unable to upload Image", 2.0);
	    },
	    timeout : 5000  // in milliseconds
	});
	client.open("POST", url);
	client.send(parem); 
}

exports.xhrAjax=xhrAjax;