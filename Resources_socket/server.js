//Create a socket and listen for incoming connections
var listenSocket = Ti.Network.Socket.createTCP({
    port: 40404,
    accepted: function(e) {
        // this where you would usually store the e.inbound value somewhere else so it can be used for
        // read / write operations elsewhere in the app
        Ti.API.info("Listening socket <" + e.socket + "> accepted incoming connection <" + e.inbound + ">");
        e.inbound.close(); // close the accepted socket
 
    },
    error: function(e) {
        Ti.API.error("Socket <" + e.socket + "> encountered error when listening");
        Ti.API.error(" error code <" + e.errorCode + ">");
        Ti.API.error(" error description <" + e.error + ">");
    }
});
listenSocket.listen(); // only starts listening for connections, does not accept them
 
// tells socket to accept the next inbound connection. listenSocket.accepted gets called when a connection is accepted
// via accept()
listenSocket.accept();


var win = Ti.UI.currentWindow;

var but = Ti.UI.createButton({title:'close' , top : 0 , left : 0});
but.addEventListener('click',function()
{
	win.close();
});

win.add(but);

var but = Ti.UI.createButton({title:'client' , top : 0 , right : 0});
but.addEventListener('click',function()
{
	var win = Ti.UI.createWindow
	({
		backgroundColor : 'blue' ,
		url : 'client.js',
		
	});	
	win.open();
});

win.add(but);


win.open();
