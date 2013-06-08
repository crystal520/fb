var win1 = Titanium.UI.createWindow
({  
    title:'window',
    backgroundColor:'#fff'
});
win1.open();

var data = [];
for( var i = 1 ; i <= 50 ; i++ )
{
	var view = Ti.UI.createView
	({
		backgroundColor:'blue'
	});
	
	if( i % 3 == 0 )
		view.backgroundColor = "red";
	else if( i % 3 == 1 )
		view.backgroundColor = "green";
		
	data.push(view);
}

var butn = Ti.UI.createButton
({
	title : "open",
});
win1.add(butn);

butn.addEventListener("click",function()
{
	var win21 = Titanium.UI.createWindow
	({  
	    title:'window2',
	    sendDta : data,
	    url : "app1.js"
	});
	win21.open();
});
