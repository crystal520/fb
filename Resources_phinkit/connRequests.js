var moreFlag = 0;
var reqConnectionWindowObj = Ti.UI.currentWindow;

reqConnectionWindowObj.setBackgroundImage('bg.png');

/******Header View Start********/
var title = 'Add Connections';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');

/*
setTimeout(function(){

	var headerModule = require('header').addHeader;
	var headerView = new headerModule('Add Connections');
	
	reqConnectionWindowObj.add(headerView);
},1000);
*/
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

reqConnectionWindowObj.add(actInd);

var backButton = Ti.UI.createButton({
    backgroundImage: 'green_bg.png',
    title:'Back',
    height: 28,
    width: 51,
    top:'15%',
    left:'3%',
});

reqConnectionWindowObj.add(backButton);

backButton.addEventListener('click',function(e){
	Ti.UI.currentWindow.close();
});

/*****Scrollable contents**/
var searchScrollView = Titanium.UI.createScrollView({
	top : '25%', 
	left : '1%',
	width : '317',
	contentWidth: 'auto',
    contentHeight: 'auto',
	showVerticalScrollIndicator:true, 
	showHorizontalScrollIndicator:false,
}); 

var tableView = Titanium.UI.createTableView({
	top : '1%',
	height : 'auto',
    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
    backgroundColor : 'transparent'
});

/*tableView.addEventListener('click',function(e){
	
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
*/
searchScrollView.add(tableView);

reqConnectionWindowObj.add(searchScrollView);

reqConnectionWindowObj.addEventListener('focus',function(){
	if(notificationView != '' && notiFlag == 1)
		{
			memexWindowObj.remove(notificationView);	
			notiFlag = 0;
		}
	getLatestNotifications();
	loadFriendRequest();
});

function loadFriendRequest()
{
	actInd.show();
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetPendingConnectionRequestListByUserId';
	var xhr = Titanium.Network.createHTTPClient();    
    
    xhr.open("POST", serverURL);
 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    
    var userid = Ti.App.Properties.getString('userid');
    var params = { LoggedInUserId : userid };
 	var widgets = JSON.stringify(params);
 	console.log(widgets);
 	xhr.send(widgets);
   
    xhr.onload = function(){
     //alert("responseText: " + this.responseText);
     if(this.status == '200'){
        
        console.log(this.responseText);
        
        if(this.readyState == 4){
        	
        	var parsed_data = JSON.parse(this.responseText);	
        	
        	//connection status
        	//1 for Pending, 2 for Connected, 3 for send connection Request
        		        	
        	// console.log(parsed_data[0].TypeConnectedUserIdList);
          	// console.log(parsed_data[0].TypePendingUserIdList);
          	// console.log(parsed_data[0].TypeSearchDataList);
			var inputData = [];
        	if(parsed_data.status == 'Success')
        	{
        		
				
				var pending_connections_obj = parsed_data.TypePendingConnections;
				
				for(var i = 0, l = pending_connections_obj.length; i < l; i++)
				{
					var r_user_id = pending_connections_obj[i].UserId;
					var p_id = pending_connections_obj[i].PendingID;
					
					var user_name = pending_connections_obj[i].FirstName+' '+pending_connections_obj[i].Surname;
					var user_detail = '';
    			
        			if(pending_connections_obj[i].JobTitle != '-1')
        			{
        				user_detail += pending_connections_obj[i].JobTitle+', ';
        			}
        			if(pending_connections_obj[i].Company != '-1')
        			{
        				user_detail += pending_connections_obj[i].Company+', ';
        			}
        			if(pending_connections_obj[i].Country != '-1')
        			{
        				user_detail += pending_connections_obj[i].Country;
        			}
										
					var row = Ti.UI.createTableViewRow({
						height : 91,
						width : 323,
						backgroundImage : 'searchListbg.png',
						selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
					});
					
					row.user_id = pending_connections_obj[i].UserId;
					
					if(pending_connections_obj[i].PendingID != '-1')
					{
						row.pending_id = pending_connections_obj[i].PendingID;
					}
					
					if(pending_connections_obj[i].ProfileImage != '' && pending_connections_obj[i].ProfileImage != null)
					{
						var userImage = Ti.UI.createImageView({
							top : '20%',
							bottom : '20%',
							left : '3%',
							width : 50,
							height:50,
							borderRadius:5,
							borderColor:'#fff',
							image : encodeURI(pending_connections_obj[i].ProfileImage),
						});
						
						row.add(userImage);	
					}
					
									
					var userDerailView = Ti.UI.createView({
						top : '20%',
						left : '25%',
						width : '58%',
						height : '73%',
					});
					
					var userNameText = Ti.UI.createLabel({
						text : user_name,
						color : '#98bf1a',
						top : '2%',
						left : '1%',
						font : {fontSize:16,fontName : 'Helvetica',fontWeight:'bold'}
						
					});
					userNameText.user_id =  pending_connections_obj[i].UserId;
					
					userDerailView.add(userNameText);
					
					userNameText.addEventListener('click',function(e){
						
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
					
					if(user_detail != '')
					{
						var detailText1 = Ti.UI.createLabel({
							text : user_detail,
							color : '#fff',
							top : '28%',
							left : '1%',
							font : {fontSize:15,fontName : 'Helvetica'},
							wordWrap : true
						});
						
						userDerailView.add(detailText1);
					}
					
					row.add(userDerailView);
					
					r_user_id = pending_connections_obj[i].UserId;
					if(pending_connections_obj[i].PendingID != '-1')
					{
						p_id = pending_connections_obj[i].PendingID;	
					}
					
					var upImage = Ti.UI.createImageView({
						bottom : '10%',
						right : '12%',
						image : 'up.png',
					});
					
					upImage.addEventListener('click',function(){
						acceptRejectRequest(r_user_id, p_id, 'Accept');
					});
					
					row.add(upImage);
					
					var downImage = Ti.UI.createImageView({
						bottom : '10%',
						right : '5%',
						image : 'down.png',
					});
					
					downImage.addEventListener('click',function(){
						acceptRejectRequest(r_user_id, p_id, 'Ignore');
					});

					row.add(downImage);
					
					inputData.push(row);
					
				}
				console.log(inputData);
				tableView.setData(inputData);
				actInd.hide();
        	}
        	else
        	{
        		actInd.hide();
        		console.log(parsed_data.Message);
        		tableView.setData(inputData);
        		var msg = Ti.UI.createLabel({
					text : parsed_data.Message,
					color : '#fff',
					font : {fontSize:12},
					wordWrap : true
				});
				
				searchScrollView.add(msg);	
        	}
        			
        }else{
        	actInd.hide();
          alert('HTTP Ready State != 4');
        }           
     }else{
     	actInd.hide();
        alert('Transmission failed. Try again later. ' + this.status + " " + this.response);
     }              
    };
 
    xhr.onerror = function(e){console.log(e.source); actInd.hide(); alert('Transmission error: ' + e.error);};	
}

function acceptRejectRequest(requestUserId, pendingId, msg){
	
	if(requestUserId != '' && pendingId != '' && msg != '')
	{
		actInd.show();
		var serverURL = Ti.App.Properties.getString('baseurl')+'AceeptIgnoreConnectionRequestOfUsers';
		var xhr = Titanium.Network.createHTTPClient();    
	    
	    xhr.open("POST", serverURL);
	 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
	    
	    var userid = Ti.App.Properties.getString('userid');
	    var params = { LoggedInUserId : userid, RequestedUserId : requestUserId, PendingId : pendingId, AcceptIgnoreStatus : msg };
	 	var widgets = JSON.stringify(params);
	 	console.log(widgets);
	 	xhr.send(widgets);
	   
	    xhr.onload = function(){
	     //alert("responseText: " + this.responseText);
	     if(this.status == '200'){
	        
	        console.log(this.responseText);
	        
	        if(this.readyState == 4){
	        	
	        	actInd.hide();
	        	loadFriendRequest();
	        	
	         }else{
	         	actInd.hide();
	          alert('HTTP Ready State != 4');
	        }           
	     }else{
	     	actInd.hide();
	        alert('Transmission failed. Try again later. ' + this.status + " " + this.response);
	     }              
	    };
	 
	    xhr.onerror = function(e){console.log(e.source); actInd.hide(); alert('Transmission error: ' + e.error);};
	}
};
