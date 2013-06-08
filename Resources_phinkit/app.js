Titanium.UI.setBackgroundImage('bg.png');

//To check Network connectivity
if(Titanium.Network.networkType == Titanium.Network.NETWORK_NONE){
	
	//alert dialog to show device is not on network
	var alertDialog = Titanium.UI.createAlertDialog({
		message : 'No internet connectivity on device',
		ok : 'Ok',
		title : 'Device Network Issue'
	}).show();
}
else{
	console.log('Your device network is : '+Titanium.Network.networkTypeName);
}

//include signin page here
//Titanium.include('signin.js');	
var signinWindow = Titanium.UI.createWindow({
	url : 'signin.js'
});
//signinWindow.open({fullscreen:true});
signinWindow.open();

Ti.API.addEventListener('app:callProfilePage',function(){
	var profileWindow = Ti.UI.createWindow({
		url : 'profile.js'
	});
	
	profileWindow.open();
});

 
