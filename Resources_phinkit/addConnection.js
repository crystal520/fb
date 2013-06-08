var moreFlag = 0;
var connectionWindowObj = Ti.UI.currentWindow;

connectionWindowObj.setBackgroundImage('bg.png');

/******Header View Start********/
/*
setTimeout(function(){
	
	var headerModule = require('header').addHeader;
	var headerView = new headerModule('Add Connections');

	connectionWindowObj.add(headerView);
},1000);
*/

var title = 'Add Connections';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');


connectionWindowObj.addEventListener('focus',function(){
	if(notificationView != '' && notiFlag == 1)
		{
			connectionWindowObj.remove(notificationView);	
			notiFlag = 0;
		}
		getLatestNotifications();
});

/******Header View End********/

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

connectionWindowObj.add(actInd);

var backButton = Ti.UI.createButton({
    backgroundImage: 'green_bg.png',
    title:'Back',
    height: 28,
    width: 51,
    top:'15%',
    left:'3%',
});

connectionWindowObj.add(backButton);

backButton.addEventListener('click',function(e){
	Ti.UI.currentWindow.close();
});

var searchBoxView = Ti.UI.createView({
	top : '23%',
	height : '16%',
	backgroundColor : 'transparent',
});

connectionWindowObj.add(searchBoxView);

var searchLabel = Ti.UI.createLabel({
	text : 'Search for Phinkers to Connect with',
	top : 0,
	color : '#fff',
	font : {fontSize:15},
	left : '3%'
});

searchBoxView.add(searchLabel);

var searchBoxBgImageView = Ti.UI.createImageView({
	bottom : '1%',
	backgroundColor : 'transparent',
	image : 'searchconbg.png'
});
searchBoxView.add(searchBoxBgImageView);

/*var searchBoxImageView = Ti.UI.createImageView({
	top : '45%',
	left : '5%',
	image : 'search-text.png',
});

searchBoxView.add(searchBoxImageView);
*/
var searchTextField = Ti.UI.createTextField({
	top : '45%',
	left : '3%',
	width : 220,
	height : 24,
	hintText : 'Search by name, role...',
	backgroundColor : 'transparent',
	backgroundImage : 'search-text.png',
	font : {fontSize:15},
	color  : '#fff',
	paddingLeft : 10
});
searchBoxView.add(searchTextField);
var searchIconView = Ti.UI.createImageView({
	top : '46%',
	right : '20%',
	image : 'serachicon.png',
	width:25,
	height:25
});

searchBoxView.add(searchIconView);

var searchlabel = Ti.UI.createLabel({
	top : '48%',
	text : 'Search',
	right : '3%',
	color : '#98bf1a',
	font : {fontSize:16,fontName : 'Helvetica',fontWeight:'bold'},
});

searchlabel.addEventListener('click',function(){
	searchTextField.blur();
});
searchBoxView.add(searchlabel);

/*****Scrollable contents**/
var searchScrollView = Titanium.UI.createScrollView({
	top : '43%', 
	left : '1%',
	width : '317',
	contentWidth: 'auto',
    contentHeight: 'auto',
	showVerticalScrollIndicator:true, 
	showHorizontalScrollIndicator:false,
}); 

var recordLable = Ti.UI.createLabel({
  color: 'red',
  font: { fontSize:20 },
  text: 'No Records Found',
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  top: 150,
  width: 'auto', height: 'auto'
});

searchScrollView.add(recordLable);

var tableView = Titanium.UI.createTableView({
	height : 'auto',
    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
    backgroundColor : 'transparent',
});

tableView.addEventListener('click',function(e){
	
	var rowdata = e.rowData;
	
	if(rowdata.user_id != '' && rowdata.user_id != null)
	{
		var userDetailWindow = Titanium.UI.createWindow({
			url : 'showProfile.js',
		});
		userDetailWindow.user_id = rowdata.user_id;
		
		Ti.UI.currentTab.open(userDetailWindow,{animate:true});
	}
});

searchScrollView.add(tableView);

connectionWindowObj.add(searchScrollView);

searchlabel.addEventListener('click',function(){
	showConnections();
});

recordLable.visible = false;	
function showConnections(){
	
	var search_txt = searchTextField.value;
	
	if(search_txt != '' && search_txt != 'Search by name, role...')
	{
		tableView.setData([]);
		recordLable.visible = false;	
		actInd.message = 'Searching..';
		actInd.show();
		var serverURL = Ti.App.Properties.getString('baseurl')+'SearchConnectionsByUserIdAndText';
		var xhr = Titanium.Network.createHTTPClient();    
	    
	    xhr.open("POST", serverURL);
	 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
	    
	    var userid = Ti.App.Properties.getString('userid');
	    var params = { SearchText : search_txt, UserId : userid };
	 	var widgets = JSON.stringify(params);
	 	console.log(widgets);
	 	xhr.send(widgets);
	   
	    xhr.onload = function(){
	     //alert("responseText: " + this.responseText);
	     if(this.status == '200'){
	        
	        //console.log(this.responseText);
	        if(this.readyState == 4){
	        	
	        	var parsed_data = JSON.parse(this.responseText);	
	        	
	        	//connection status
	        	//1 for Pending, 2 for Connected, 3 for send connection Request
	        		        	
	        	// console.log(parsed_data[0].TypeConnectedUserIdList);
	          	// console.log(parsed_data[0].TypePendingUserIdList);
	          	// console.log(parsed_data[0].TypeSearchDataList);

	        	if(parsed_data.Status == 'Success')
	        	{
	        		var inputData = [];
					
					var connected_user_id_obj = parsed_data.TypeConnectedUserIdList;
					var pending_user_id_obj = parsed_data.TypePendingUserIdList;
					var searched_user_data_obj = parsed_data.TypeSearchDataList;
					
					for(var i = 0, l = searched_user_data_obj.length; i < l; i++)
					{
						console.log(searched_user_data_obj[i]);
						
						var user_name = searched_user_data_obj[i].FirstName+' '+searched_user_data_obj[i].Surname;
						var user_detail = '';
        			
	        			if(searched_user_data_obj[i].JobTitle != '-1')
	        			{
	        				user_detail += searched_user_data_obj[i].JobTitle+', ';
	        			}
	        			if(searched_user_data_obj[i].Location != '-1')
	        			{
	        				user_detail += searched_user_data_obj[i].Location;
	        			}
						
						var row = Ti.UI.createTableViewRow({
							height : 91,
							width : 323,
							backgroundImage : 'searchListbg.png'
						});
						
						row.user_id = searched_user_data_obj[i].UserId;
						
						if(searched_user_data_obj[i].ProfileImage != '' && searched_user_data_obj[i].ProfileImage != null)
						{
							var userImage = Ti.UI.createImageView({
								top : '20%',
								bottom : '20%',
								left : '3%',
								width : 50,
								height:50,
								borderRadius:5,
								image : encodeURI(searched_user_data_obj[i].ProfileImage),
							});
							
							row.add(userImage);
						}
						
						var userDerailView = Ti.UI.createView({
							top : '20%',
							left : '22%',
							width : '70%',
							height : '73%',
						});
						
						var userNameText = Ti.UI.createLabel({
							text : user_name,
							color : '#98bf1a',
							top : '2%',
							left : '1%',
							font : {fontSize:16,fontName : 'Helvetica',fontWeight:'bold'}
						});
						
						userDerailView.add(userNameText);
						
						if(user_detail != '')
						{
							var detailText1 = Ti.UI.createLabel({
								text : user_detail,
								color : '#fff',
								top : '28%',
								left : '1%',
								font : {fontSize:15,fontName : 'Helvetica'}
								
							});
							
							userDerailView.add(detailText1);
						}
						
						row.add(userDerailView);
						inputData.push(row);
						
						var row = Ti.UI.createTableViewRow({
							height : 50,
							width : 323,
						});
						
							//connection status
	        			//1 for Pending, 2 for Connected, 3 for send connection Request
						var connection_status = searched_user_data_obj[i].ConnectionStatus;
						
						var buttonText = '';
						
						if(connection_status == '1')
						{
							buttonText = 'Connection Request Pending';
						}
						else if(connection_status == '2')
						{
							buttonText = 'Connected';
						}
						else if(connection_status == '3')
						{
							var buttonImage = Ti.UI.createButton({
								right : '1%',
								backgroundImage : 'Send-Connection-Request.png',
								title:'Send Connection Request',
								top : '5%',
								width:230,
								height:30,
								font:{fontFamily:'Helvetica Neue', fontSize:16, fontWeight:'bold'},
								to_user_id :searched_user_data_obj[i].UserId,
								userName:user_name
						});
							
							buttonImage.addEventListener('click',function(e){
								
								var popUpWindow = Ti.UI.createWindow({
									url : 'sendConnectionRequest.js',
									navBarHidden : true,
								});
								
								popUpWindow.to_user_id = e.source.to_user_id;
								popUpWindow.user_name = e.source.userName;
								
								popUpWindow.open();
								
								popUpWindow.addEventListener('close',function(event){
									console.log(event.source);
									console.log(event.source.completed);
									searchlabel.fireEvent('click');
								});
							});
							
							row.add(buttonImage);
						}
						
						if(buttonText != '')
						{
							console.log(buttonText);
							// Create a Button.
							var aButton = Ti.UI.createButton({
								title : buttonText,
								height : 28,
								width : 'auto',
								right : '1%',
								borderRadius : 9
							});
							
							// Listen for click events.
							aButton.addEventListener('click', function() {
								alert('\'aButton\' was clicked!');
							});
							
							// Add to the parent view.
							row.add(aButton);
						}
						
						inputData.push(row);
						
					}
					console.log(inputData);
					tableView.setData(inputData);
					
	        	}
	        	else
	        	{
	        		console.log(parsed_data.Message);
	        		recordLable.visible = true;	
	        	}
	        	
	          	actInd.hide();
	          		
	        }else{
	        	actInd.hide();
	          alert('HTTP Ready State != 4');
	        }           
	     }else{
	     	actInd.hide();
	        alert('Transmission failed. Try again later. ' + this.status + " " + this.response);
	     }   
	     searchTextField.blur();           
	    };
	 
	    xhr.onerror = function(e){console.log(e.source);actInd.hide(); alert('Transmission error: ' + e.error);};
	}
	else
	{
		alert('Please Enter text to search');
	}
}