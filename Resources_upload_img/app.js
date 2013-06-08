
var win = Ti.UI.createWindow
({
	backgroundColor : 'red' ,
});

var img = Ti.UI.createImageView
({
	image : 'logo.png'
})
win.add(img);

var thisBlob = img.toBlob();
var thisSend = Ti.Utils.base64encode(thisBlob);

Ti.API.info("base64 = " + thisSend);
Ti.App.Properties.setString("thisSend" , thisSend);

var parem = { img : Ti.App.Properties.getString("thisSend") };
Ti.API.info( "param = " + JSON.stringify(parem) );

 var url = "http://alps.zone2serve.dev.zone2serve.me/phillipws/all_for_test/test/chitti_raja.php";
 var client = Ti.Network.createHTTPClient
 ({

     onload : function(e) 
     {
         Ti.API.info("Received text: " + this.responseText);
         alert('success');
     },
     onerror : function(e) 
     {
         Ti.API.debug(e.error);
         alert('error');
     },
     timeout : 5000  // in milliseconds
 });
 client.open("POST", url);
 client.send(parem); 

win.open();
