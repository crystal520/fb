var currentWindow = Ti.UI.currentWindow;

var userName = currentWindow.user_name;
var userId = currentWindow.to_user_id;


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

actInd.hide();

currentWindow.add(actInd);

var scrollView1 = Ti.UI.createScrollView({
	 width:'auto',
 	 height:'auto',
   	 contentHeight:200,
     contentWidth:'auto'
});

currentWindow.add(scrollView1);

var popUpView = Ti.UI.createView({
	backgroundImage : 'pop-up-bg.png',
	width : 300,
	height : 250,
});
					
scrollView1.add(popUpView);

var title_bar_view = Ti.UI.createView({
	top : 0,
	height : '10%',
	backgroundColor : '#98bf1a'
});

var cross_sign = Ti.UI.createLabel({
	text : 'X',
	color : '#fff',
	right : '5%',
	font : {fontSize:15,fontWeight : 'bold'}
}); 

title_bar_view.add(cross_sign);

var content_view = Ti.UI.createView({
	bottom : 0,
	height : '90%',
	borderColor : 'yellow'
});
var textlabel = Ti.UI.createLabel({
	top : '6%',
	height : '10%',
	left : '5%',
	text : 'Connection request for : ',
	font : {fontSize:14},
	color:'#fff'
}); 

if(userName != '')
{
	var userNamelabel = Ti.UI.createLabel({
		top : '6%',
		height : '10%',
		left : '60%',
		color : '#fff',
		text : userName,
		font : {fontSize:14}
	});
	popUpView.add(userNamelabel); 
}

var msg_area = Ti.UI.createTextArea({
	top : '20%',
	height : '50%',
	backgroundColor : '#141414',
	color:'#fff',
	width : '85%',
	borderRadius : 8,
	font:{fontSize:14},
	backgroundImage:'text-bg.png'
});

var sendRequestButton = Titanium.UI.createButton({
   bottom: 30,
   width:176,
   height:26,
   left:25,
   backgroundImage:'send-connection1.png'
});

var closeButton = Ti.UI.createButton({
   bottom: 30,
   width:67,
   height:26,
   right:24,
   backgroundImage:'cancel.png'
});

popUpView.add(textlabel);

popUpView.add(msg_area);
popUpView.add(sendRequestButton);
popUpView.add(closeButton);

//popUpView.add(title_bar_view);
//popUpView.add(content_view);

// Listen for click events.
cross_sign.addEventListener('click', function() {
	currentWindow.close();
});

closeButton.addEventListener('click',function(){
	currentWindow.close();
});

scrollView1.addEventListener('return',function(){
	scrollView1.scrollTo(0, 0);
});

sendRequestButton.addEventListener('click',function(){
	actInd.show();
	var serverURL = Ti.App.Properties.getString('baseurl')+'SendConnectionRequestToUser';
	var xhr = Titanium.Network.createHTTPClient();    
    
    xhr.open("POST", serverURL);
 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    
    var userid = Ti.App.Properties.getString('userid');
    var params = { LoggedInUserId : userid, SentRequestUserId : userId, TextMessage : msg_area.value };
 	var widgets = JSON.stringify(params);
 	console.log(widgets);
 	xhr.send(widgets);
   
    xhr.onload = function(){
     //alert("responseText: " + this.responseText);
     if(this.status == '200'){
        
        console.log(this.responseText);
        
        if(this.readyState == 4){
        	
        	var parsed_data = JSON.parse(this.responseText);
        	
        	console.log(parsed_data);
        	
        	if(parsed_data.status == 'Success')
        	{
        		currentWindow.completed = '1';
        		alert(parsed_data.Message);
        	}
        	actInd.hide();
        	currentWindow.close();
         }else{
         	actInd.hide();
          alert('HTTP Ready State != 4');
        }           
     }else{
     	actInd.hide();
        alert('Transmission failed. Try again later. ' + this.status + " " + this.response);
     }              
    };
 
    xhr.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);};
	
});
