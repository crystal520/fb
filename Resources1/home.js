console.log(' -----> In home window');

var homeWin = Ti.UI.currentWindow;

var name_imageView = Titanium.UI.createView
({
	top:0,
	height:30,
	width:'auto',
	backgroundColor:'#CCFFCC'
});
homeWin.add(name_imageView);

var nameLabel = Titanium.UI.createLabel
({
	right:2,
	top:6,
	width:50,
	color:"#69BCE6",
	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	text:Titanium.App.Properties.getString("first_name"),
	font:{ fontSize:18 , fontWeight:'bold' }
});
name_imageView.add(nameLabel);


var userImage = Titanium.UI.createImageView
({
 	  height:26,
 	  width:28,
 	  top:2,
 	  right:nameLabel.width + 2
});

if( Titanium.App.Properties.getString("dp") == null || Titanium.App.Properties.getString("dp") == "" )
{
	dp_FB();
}
else
{
	userImage.image = Titanium.App.Properties.getString("dp");
    name_imageView.add(userImage);
}


/***** Retriving users image ******/
function dp_FB()
{
	console.log('inside dp_FB function');
	
	Titanium.Facebook.requestWithGraphPath( "/me?fields=picture",{}, "GET", function(e)
	{
		if (e.success) 
		{
	        var response = JSON.parse(e.result);
	        
	        var dp = response.picture.data.url
	        console.log("DP = " + dp);
	        
	        Titanium.App.Properties.setString("dp",dp);
	    	
	        userImage.image = Titanium.App.Properties.getString("dp");
	        
	        name_imageView.add(userImage);
	    } 
		else if (e.error) 
	    {
	        alert(e.error);
	    } 
	    else 
	    {
	        alert('Unknown response');
	    }
	});
}