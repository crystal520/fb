var win1 =Ti.UI.currentWindow;

var data = win1.sendDta;

var scrollView = Titanium.UI.createScrollableView
({
	views:data,
	//showPagingControl:true,
	pagingControlHeight:30,
	maxZoomScale:2.0,
	currentPage:1
});

win1.add(scrollView);


var butn = Ti.UI.createButton
({
	title : "close",
	bottom : 0,
	zIndex :12
});
win1.add(butn);

butn.addEventListener("click",function()
{
	win1.close();
});
