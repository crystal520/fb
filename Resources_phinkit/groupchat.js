var moreFlag = 0;
var chatWindowObj = Ti.UI.currentWindow;

chatWindowObj.setBackgroundImage('bg.png');

//***handling chat functionality***//
var nowjs = require('/lib/now');
var now = nowjs.nowInitialize('//83.222.253.146:9000', {});

var rec_message = '';

now.ready(function(){
	console.log('Now is ready to use');
	
	now.name = 'My App';
	
	now.receiveMessage = function(name, message){
		rec_message = name + ": " + message;
	    console.log(name+" : "+message);
	    
	    if(rec_message != '')
		{
			
			var row = Titanium.UI.createTableViewRow({
				backgroundColor : 'transparent',
				height : 'auto'
			});
			
			var boxHeight = 80;
			var max_boxWidth = 250;
			var boxWidth = rec_message.length*20;
			console.log(rec_message.length+' boxwidth : '+boxWidth+'  boxheight : '+boxHeight);
			if(boxWidth > 35)
			{
				if(Math.ceil(rec_message.length/35) > 1)
				{
					boxHeight = boxHeight+Math.ceil(rec_message.length/35)*10;
				}
				
				console.log('boxHeight'+boxHeight+'  ceil value : '+Math.ceil(rec_message.length/35));
				boxWidth = max_boxWidth;
			}
			
			var htmlData = "<html><head><meta name ='viewport' content = 'user-scalable = no'></head><body><div class='roundbox-tr1' style='margin:5px auto;padding:0;background:url(\"roundbox_tr.gif\") no-repeat right top;width: 90%;'><div class='roundbox-tl1' style='margin:0;padding:0;background:url(\"roundbox_tl.gif\") no-repeat left top;'><div class='roundbox-br1' style='margin:0;padding:0;background:url(\"roundbox_br.gif\") no-repeat right bottom;'><div class='roundbox-bl1' style='margin:0;padding:0;background:url(\"roundbox_bl.gif\") no-repeat left bottom;'><div class='roundbox-content1' style='margin:0;padding:20px;font-size: 12px;'><p style='color:#fff;margin:0;padding:0 0 0.5em 0;line-height:1.6;'>"+rec_message+"</p></div></div></div></div></div></body></html>";
			
			/*
			var chatView = Ti.UI.createWebView({
				url : 'chatBlock.html',
				right : 1,
				height : boxHeight,
				width : 'auto',
				backgroundColor : 'white',
			});
			*/
			
			var chatView = Ti.UI.createWebView({
				html : htmlData,
				right : 1,
				height : boxHeight,
				width : 'auto',
				backgroundColor : 'transparent',
			 	disableBounce : true
			});
			
			chatView.addEventListener('beforeload',function(){
				//alert("data " +data);
				var chattext = rec_message;
				chatView.evalJS("var chattext1='"+chattext+"';");
				//alert('khsdf'+chattext);
			});
			
			row.add(chatView); 
			/*
			var boxWidth = chatTextfield.value.length*15;
			var boxHeight = 30;
			
			if(chatTextfield.value.length > 35)
			{
				boxHeight = Math.ceil(chatTextfield.value.length/35)*30;
			}
			console.log(chatTextfield.value.length+' height : '+boxHeight);
			
			var view1 = Ti.UI.createView({
				layout : 'horizontal',
				height : boxHeight,
				width : 280,
				right : 20,
				left : 20,
				backgroundColor : 'white',
			});
			
			//row.add(view1);
			
			var label1 = Ti.UI.createLabel({
				height : 'auto',
				width : boxWidth,
				layout : 'horizontal',
				text : chatTextfield.value,
				right : 1,
				borderRadius : 5,
				backgroundColor : '#1c1c1c',
				font : {fontSize:'14.5sp', fontName : 'Helvetica', fontWeight : 'bold'},
				top : 1,
				
			});
			console.log(label1.height);
			row.add(label1);
			*/
			/*
			var boxWidth = chatTextfield.value.length*15;
			var boxHeight = 20;
			if(boxWidth > 250)
			{
				boxWidth = 250;
				boxHeight = Math.ceil((boxWidth/250));
			}
			
			var chatText = Ti.UI.createTextArea({
				value : 'hi\nhello\nhru',
				right : 10,
				borderRadius : 5,
				width : 165,
				height : 25,
				backgroundColor : '#1c1c1c',
				font : {fontSize:'14.5sp', fontName : 'Helvetica', fontWeight : 'bold'},
			});
			
			view1.add(chatText);
			*/
			//'#1c1c1c
			/*
			var chatTextWebView = Ti.UI.createWebView({
				right : 10,
				backgroundColor : 'transparent',
				borderRadius : 5,
				width : boxWidth,
				height : boxHeight,
				backgroundColor : '#1c1c1c',
				html : chatTextfield.value,
				showScrollbars : false,
			
			});
			row.add(chatTextWebView);
			*/
			/*
			var backView = Ti.UI.createView({
				right : 10,
				backgroundColor : '#1c1c1c',
				borderRadius : 5,
				width : boxWidth,
				height : 'auto'
			});
			
			row.add(backView);
			
			var titleText = Ti.UI.createLabel({
				text : chatTextfield.value,
				color : '#98bf1a',
				top : 1,
				right : '10%',
				font : {fontSize:'14.5sp', fontName : 'Helvetica', fontWeight : 'bold'},
				backgroundColor : '#1c1c1c',
				paddingLeft : 20,
				wordWrap : true
			});
			
			backView.add(titleText);
			*/
			
			inputData.push(row);
			/*
			var row = Titanium.UI.createTableViewRow({
				backgroundColor : 'transparent',
				height : 10
			});
			
			inputData.push(row);
			*/
			tableView.setData(inputData);
			
			
		}
	}
});

/******Header View Start********/

var actInd = Ti.UI.createActivityIndicator({
	height:55,
    width:'auto',
    color:'#FFFFFF',
    backgroundColor:'#000',
    opacity:0.9,
    borderRadius:5,
    borderColor:'#000',
    zIndex : 1,
    font:{fontFamily:'Helvetica Neue', fontSize:18},
    message:' Loading Data...',
    style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
});

chatWindowObj.add(actInd);

/*
setTimeout(function(){
	
	var headerModule = require('header').addHeader;
	var headerView = new headerModule('Phink Tank Chat');
	                                                                                                                                                                                                                                                                                                                                                                                                                                           
	chatWindowObj.add(headerView);
},1000);

*/

var title = 'Phinkit Tank Chat';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');

chatWindowObj.addEventListener('focus',function(){
	if(notificationView != '' && notiFlag == 1)
	{
		chatWindowObj.remove(notificationView);	
		notiFlag = 0;
	}
	getLatestNotifications();
});



/******Header View End********/
/*
var contentView = Ti.UI.createView({
	top : 60,
	backgroundColor : 'transparent',
});

*/


var contentView = Ti.UI.createScrollView({
	 top : 60,
	 width:'auto',
 	 height:'auto',
   	 contentHeight:200,
     contentWidth:'auto',
     backgroundColor : 'transparent',
});

chatWindowObj.add(contentView);

var dayLabel = Ti.UI.createLabel({
	text : 'Day',
	font : {fontSize:12,fontWeight:'bold'},
	left : '7%',
	top : 5,
	color : '#fff'
});

contentView.add(dayLabel);

var monthLabel = Ti.UI.createLabel({
	text : 'Month',
	font : {fontSize:12,fontWeight:'bold'},
	left : '20%',
	top : 5,
	color : '#fff'
});

contentView.add(monthLabel);

var monthLabel = Ti.UI.createLabel({
	text : 'Year',
	font : {fontSize:12,fontWeight:'bold'},
	left : '37%',
	top : 5,
	color : '#fff'
});

contentView.add(monthLabel);

var inviteButton = Ti.UI.createButton({
	title : '    Invite',
	top : 1,
	right : '20%',
	height : 26,
	width : 59,
	backgroundImage : 'invite.png',
	textAlign : 'center',
	font:{fontSize:12,fontFamily:'Helvetica Neue'},
});

contentView.add(inviteButton);
/*
var inviteButton = Ti.UI.createImageView({
	image : 'invite.png',
	top : 1,
	right : '20%',
	height : 26,
	width : 59,
});

inviteButton1.add(inviteButton);
*/
var leaveButton = Ti.UI.createButton({
	title : '    Leave',
	top : 1,
	right : '1%',
	height : 26,
	width : 59,
	backgroundImage : 'leave.png',
	textAlign : 'center',
	font:{fontSize:12,fontFamily:'Helvetica Neue'},
});

contentView.add(leaveButton);
/*
var leaveButton = Ti.UI.createImageView({
	image : 'leave.png',
	top : 1,
	right : '1%',
	height : 26,
	width : 59,
});

contentView.add(leaveButton);
*/
/*
var inviteButton = Ti.UI.createButton({
	title : 'Invite',
	top : 10,
	right : '10%',
	height : 26,
	width : 59,
	backgroundImage : 'invite.png',
	textAlign : 'right',
	font:{fontSize:14,fontWeight:'bold',fontFamily:'Helvetica Neue'},
});

contentView.add(inviteButton);
*/
var chatScreenView = Ti.UI.createView({
	backgroundImage : 'chatbg.png',
	top : 31,
});

contentView.add(chatScreenView);

var tableView = Titanium.UI.createTableView({
	top : 15,
	width : 317,
    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
    backgroundColor : 'transparent',
    bottom :50,
});

chatScreenView.add(tableView);

var chatTextfield = Ti.UI.createTextArea({
	height : 34,
	width : 255,
	bottom : 10,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	font:{fontSize:12},
	paddingLeft : 10,
	color : '#fff',
	left : 10,
	wordWrap : true,
	backgroundColor : '#1c1c1c'
});

var textCounter = 0;

chatTextfield.addEventListener('change', function(e){
  textCounter++;
  if(textCounter > 45){
  	textCounter = 0;
    e.source.height = e.source.height + 10;
  }
});

contentView.add(chatTextfield);

var sendButton1 = Ti.UI.createButton({
	title : 'Send',
	bottom : 10,
	right : 8,
	height : 33,
	width : 45,
	font:{fontSize:14,fontWeight:'bold',fontFamily:'Helvetica Neue'},
});


var sendButton = Ti.UI.createButton({
	title : 'Send',
	bottom : 10,
	right : 8,
	height : 33,
	width : 45,
	font:{fontSize:14,fontWeight:'bold',fontFamily:'Helvetica Neue'},
});


var inputData = [];

sendButton.addEventListener('click',function(){
	chatTextfield.blur();
	//textCounter = 0;
		
	
	var data = chatTextfield.value;
	console.log(chatTextfield.value);
	now.distributeMessage(data);
	
	chatTextfield.value = '';
	chatTextfield.height = 35;
});

sendButton1.addEventListener('click',function(){
	
	var data = chatTextfield.value;
	if(data != '')
	{
		now.ready(function(){
			now.distributeMessage(data);
		});
		
		var row = Titanium.UI.createTableViewRow({
			backgroundColor : 'transparent',
			height : 'auto'
		});
		
		var boxHeight = 80;
		var max_boxWidth = 250;
		var boxWidth = chatTextfield.value.length*20;
		console.log(chatTextfield.value.length+' boxwidth : '+boxWidth+'  boxheight : '+boxHeight);
		if(boxWidth > 35)
		{
			if(Math.ceil(chatTextfield.value.length/35) > 1)
			{
				boxHeight = boxHeight+Math.ceil(chatTextfield.value.length/35)*10;
			}
			
			console.log('boxHeight'+boxHeight+'  ceil value : '+Math.ceil(chatTextfield.value.length/35));
			boxWidth = max_boxWidth;
		}
		
		var htmlData = "<html><head><meta name ='viewport' content = 'user-scalable = no'></head><body><div class='roundbox-tr1' style='margin:5px auto;padding:0;background:url(\"roundbox_tr.gif\") no-repeat right top;width: 90%;'><div class='roundbox-tl1' style='margin:0;padding:0;background:url(\"roundbox_tl.gif\") no-repeat left top;'><div class='roundbox-br1' style='margin:0;padding:0;background:url(\"roundbox_br.gif\") no-repeat right bottom;'><div class='roundbox-bl1' style='margin:0;padding:0;background:url(\"roundbox_bl.gif\") no-repeat left bottom;'><div class='roundbox-content1' style='margin:0;padding:20px;font-size: 12px;'><p style='margin:0;padding:0 0 0.5em 0;line-height:1.6;'>"+data+"</p></div></div></div></div></div></body></html>";
		
		/*
		var chatView = Ti.UI.createWebView({
			url : 'chatBlock.html',
			right : 1,
			height : boxHeight,
			width : 'auto',
			backgroundColor : 'white',
		});
		*/
		
		var chatView = Ti.UI.createWebView({
			html : htmlData,
			right : 1,
			height : boxHeight,
			width : 'auto',
			backgroundColor : 'transparent',
		 	disableBounce : true
		});
		
		chatView.addEventListener('beforeload',function(){
			//alert("data " +data);
			var chattext = chatTextfield.value;
			chatView.evalJS("var chattext1='"+chattext+"';");
			//alert('khsdf'+chattext);
		});
		
		row.add(chatView); 
		/*
		var boxWidth = chatTextfield.value.length*15;
		var boxHeight = 30;
		
		if(chatTextfield.value.length > 35)
		{
			boxHeight = Math.ceil(chatTextfield.value.length/35)*30;
		}
		console.log(chatTextfield.value.length+' height : '+boxHeight);
		
		var view1 = Ti.UI.createView({
			layout : 'horizontal',
			height : boxHeight,
			width : 280,
			right : 20,
			left : 20,
			backgroundColor : 'white',
		});
		
		//row.add(view1);
		
		var label1 = Ti.UI.createLabel({
			height : 'auto',
			width : boxWidth,
			layout : 'horizontal',
			text : chatTextfield.value,
			right : 1,
			borderRadius : 5,
			backgroundColor : '#1c1c1c',
			font : {fontSize:'14.5sp', fontName : 'Helvetica', fontWeight : 'bold'},
			top : 1,
			
		});
		console.log(label1.height);
		row.add(label1);
		*/
		/*
		var boxWidth = chatTextfield.value.length*15;
		var boxHeight = 20;
		if(boxWidth > 250)
		{
			boxWidth = 250;
			boxHeight = Math.ceil((boxWidth/250));
		}
		
		var chatText = Ti.UI.createTextArea({
			value : 'hi\nhello\nhru',
			right : 10,
			borderRadius : 5,
			width : 165,
			height : 25,
			backgroundColor : '#1c1c1c',
			font : {fontSize:'14.5sp', fontName : 'Helvetica', fontWeight : 'bold'},
		});
		
		view1.add(chatText);
		*/
		//'#1c1c1c
		/*
		var chatTextWebView = Ti.UI.createWebView({
			right : 10,
			backgroundColor : 'transparent',
			borderRadius : 5,
			width : boxWidth,
			height : boxHeight,
			backgroundColor : '#1c1c1c',
			html : chatTextfield.value,
			showScrollbars : false,
		
		});
		row.add(chatTextWebView);
		*/
		/*
		var backView = Ti.UI.createView({
			right : 10,
			backgroundColor : '#1c1c1c',
			borderRadius : 5,
			width : boxWidth,
			height : 'auto'
		});
		
		row.add(backView);
		
		var titleText = Ti.UI.createLabel({
			text : chatTextfield.value,
			color : '#98bf1a',
			top : 1,
			right : '10%',
			font : {fontSize:'14.5sp', fontName : 'Helvetica', fontWeight : 'bold'},
			backgroundColor : '#1c1c1c',
			paddingLeft : 20,
			wordWrap : true
		});
		
		backView.add(titleText);
		*/
		
		inputData.push(row);
		/*
		var row = Titanium.UI.createTableViewRow({
			backgroundColor : 'transparent',
			height : 10
		});
		
		inputData.push(row);
		*/
		tableView.setData(inputData);
	}
	
	chatTextfield.blur();
	textCounter = 0;
	chatTextfield.value = '';
	chatTextfield.height = 35;
});
contentView.add(sendButton);