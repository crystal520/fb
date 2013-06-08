var this_win = Ti.UI.currentWindow;
  
var alertView =Ti.UI.createView
({
	height : 200,
	width : 250,
	backgroundColor : 'blue',
	borderRadius:5,
	transform : Titanium.UI.create2DMatrix().scale(0) ,
	backgroundGradient:
	{
		type:'linear',
		colors:[{color:'#525C75',position:0.0},{color:'#1B2A4B',position:0.50},{color:'#1B2A4B',position:1.0}]
	}
});

var label1 = Ti.UI.createLabel
({
	top : 20 ,
	text : 'Enter Your E-mail ID to send account name & pincode to it.'
})
alertView.add(label1);

var textBox1 = Ti.UI.createTextField
({
	width : Ti.UI.FILL,
	top : 80 ,
	left : 5 ,
	right : 5 ,
	height : 40,
	value : "eeqw",
	backgroundColor : '#fff'
});
alertView.add(textBox1);

var cancelBut = Ti.UI.createButton
({
	title : 'Cancel' ,
	top : 140,
	left : 20 ,
	backgroundColor : '#7F879A'
});
alertView.add(cancelBut);

var okBut = Ti.UI.createButton
({
	title : 'OK' ,
	top : 140 ,
	right : 20,
	backgroundColor : '#7F879A'
});
alertView.add(okBut);

addAlert();

function addAlert()
{
	this_win.add(alertView);
	
	var t1 = Titanium.UI.create2DMatrix().scale(1);
	alertView.animate({transform:t1,duration:300});
}