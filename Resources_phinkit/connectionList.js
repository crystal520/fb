var moreFlag = 0;
var connectionWindowObj = Ti.UI.currentWindow;

connectionWindowObj.setBackgroundImage('bg.png');

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

connectionWindowObj.add(actInd);

var title = 'Connections';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');

/*
setTimeout(function(){
	//actInd.hide();
	//alert('loading header in chat');
	var headerModule = require('header').addHeader;
	var headerView = new headerModule('Connections');
	
	connectionWindowObj.add(headerView);
},1000);
*/
/******Header View End********/

connectionWindowObj.addEventListener('focus',function(){
	if(notificationView != '' && notiFlag == 1)
		{
			connectionWindowObj.remove(notificationView);	
			notiFlag = 0;
		}
		getLatestNotifications();
});

var addConnectionlabel = Ti.UI.createLabel({
	top : '15%',
	text : 'Add Connections',
	right : '1%',
	color : '#98bf1a',
	font : {fontSize:16},
});


addConnectionlabel.addEventListener('click',function(){
	var addConnWindow = Ti.UI.createWindow({
		url : 'addConnection.js',
	});
	Ti.UI.currentTab.open(addConnWindow);	
});

connectionWindowObj.add(addConnectionlabel);

var ConnectionRequestlabel = Ti.UI.createLabel({
	top : '15%',
	text : 'Connection Requests',
	left : '1%',
	color : '#98bf1a',
	font : {fontSize:16},
});

ConnectionRequestlabel.addEventListener('click',function(){
	var showRequestConnWindow = Ti.UI.createWindow({
		url : 'connRequests.js',
	});
	Ti.UI.currentTab.open(showRequestConnWindow);	
});

connectionWindowObj.add(ConnectionRequestlabel);

/******Content View Start**********/

//alphabetic scroll code from below url
//http://developer.appcelerator.com/question/49141/alphabetical-scroll-bar
var contentView = Ti.UI.createView({
	top : '20%',
  	backgroundColor: 'transparent',
  	width:320,
  	backgroundImage : 'bgprofile.png'
});

var table = Ti.UI.createTableView({
	top : '3%',
	backgroundColor: 'transparent',
  	width:320,
  	separatorStyle : Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
  	bottom : '3%'
});

table.addEventListener('click',function(e){
	var rowdata = e.rowData;
	
	if(rowdata.connected_user_id != '' && rowdata.connected_user_id != null)
	{
		var userDetailWindow = Titanium.UI.createWindow({
			url : 'showProfile.js',
		});
		userDetailWindow.user_id = rowdata.connected_user_id;
		
		Ti.UI.currentTab.open(userDetailWindow,{animate:true});
	}		
});

contentView.add(table);

connectionWindowObj.add(contentView);

var alphaTable = Ti.UI.createTableView({
	  top : '20%',
	  separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
	  opacity:0.65,
	  scrollable:false,
	  right:5,
	  width:28,
	  height:330,
	  borderRadius:13,
	  backgroundColor:"#000"
});
//355
// alpha table must be on top of other table
connectionWindowObj.add(alphaTable);

/******Content View End **********/

connectionWindowObj.addEventListener('focus',function(){
	actInd.show();
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetConnectionsListByUserId';
	var xhr = Titanium.Network.createHTTPClient();    
    
    console.log(serverURL);
    xhr.open("POST", serverURL);
    xhr.setTimeout(99000);
 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    
    var userid = Ti.App.Properties.getString('userid');
    var params = { UserId : userid };
 	var widgets = JSON.stringify(params);
 	
 	console.log(widgets);
 	xhr.send(widgets);
   
    xhr.onload = function(){
     //alert("responseText: " + this.responseText);
     if(this.status == '200'){
        
        console.log(this.responseText);
        
        if(this.readyState == 4){
        	
        	var parsed_data = JSON.parse(this.responseText);
        	var index = [];
			var rows = [];   
        	
        	if(parsed_data[0].status == 'Success')
        	{
        		var conn_result_list = parsed_data[0].ConnectionsList;
        		var model = [];
        		for(var i = 0, l = conn_result_list.length; i < l;i++)
        		{
        			console.log(conn_result_list[i].UserName);
        			var user_detail = '';
        			
        			if(conn_result_list[i].JobTitle != '-1')
        			{
        				user_detail += conn_result_list[i].JobTitle+', ';
        			}
        			if(conn_result_list[i].Company != '-1')
        			{
        				user_detail += conn_result_list[i].Company+', ';
        			}
        			if(conn_result_list[i].Location != '-1')
        			{
        				user_detail += conn_result_list[i].Location;
        			}
        			        			
        			model.push({  Title : conn_result_list[i].FirstName+' '+conn_result_list[i].Surname, userDetail : user_detail, user_image : encodeURI(conn_result_list[i].ProfileImage), connectedUserId : conn_result_list[i].ConnectedUserId  });
        		}
        		console.log('model');
        		console.log(model);
        		
				
				var curheader = '0';
				
				var alphaRowCount = 0;
				var rowIndexArray = [];
				var rowcount = 0;
				var jobtitle = '';
				// loop through model to add rows to table
				for (var i = 0, l = model.length; i < l; i++) 
				{
					// first determine how many rows there will be
					// use substring to get only first letter
					var my_curheader = model[i].Title.substring(0,1);
					if(my_curheader.toUpperCase() != curheader.toUpperCase())
					{
						curheader = model[i].Title.substring(0,1);
						curheader = curheader.toUpperCase();
						
						var row = Ti.UI.createTableViewRow({
								top : '3%' 
							});
						
						var label = Ti.UI.createLabel({
							text : curheader,
							left : '5%',
							color : '#fff',
							font : {fontSize:16,fontName : 'Helvetica'},
							
						});
						
						var lineImage = Ti.UI.createImageView({
							bottom : '1%',
							image : 'line.png',
							left : '3%'
						});
						
						row.add(label);
						row.add(lineImage);
						rows.push( row );
						alphaRowCount++;
						
						rowIndexArray[i] =  rowcount;
						rowcount++;
					}
				  	
				  	var row = Ti.UI.createTableViewRow({
						width : '317',
						height : '75',
					});
					
					row.connected_user_id = model[i].connectedUserId;
					
					if(model[i].user_image != '' && model[i].user_image != null)
					{
						var userImage = Ti.UI.createImageView({
							top : '15%',
							left : '3%',
							width : 50,
							height:50,
							borderRadius:5,
							image : model[i].user_image,
						});
						
						/*if(model[i].user_image != '' && model[i].user_image != '-1')
						{
							userImage.image = model[i].user_image;
						}*/
						
						row.add(userImage);
					}
					
					
					var userDerailView = Ti.UI.createView({
						top : '15%',
						left : '22%',
						width : '65%',
						height : '80%',
						
					});
					
					var userNameText = Ti.UI.createLabel({
						text : model[i].Title,
						color : '#98bf1a',
						top : '2%',
						left : '1%',
						font : {fontSize:16,fontWeight:'bold',fontName : 'Helvetica'}
					});
					
					userDerailView.add(userNameText);
					
					if(model[i].userDetail != '')
					{
						var detailText1 = Ti.UI.createLabel({
							text : model[i].userDetail,
							color : '#fff',
							top : '30%',
							left : 0,
							font : {fontSize:15,fontName : 'Helvetica'},
							height : 'auto',
							wordWrap : true
						});
						
						userDerailView.add(detailText1);
					}
					
					row.add(userDerailView);
					
					rows.push( row );
					rowcount++;
				}
				
				// reset curheader var
				curheader = '0'; 
				
				// determine Row height by dividing by Alpha Table height
				//var rowHeight = 355/alphaRowCount;
				var rowHeight = 330/alphaRowCount;
				
				// now loop through model again to actually add the alpha rows
				for (var i = 0, l = model.length; i < l; i++) 
				{
					var my_curheader = model[i].Title.substring(0,1);
					if(my_curheader.toUpperCase() != curheader.toUpperCase())
				  	{
				  		curheader = model[i].Title.substring(0,1);
				    	curheader = curheader.toUpperCase();
				    	
				    	var alphaRow = Ti.UI.createTableViewRow({
					        color:'#fff',
					        width:28,
					        backgroundColor:"transparent",
					        backgroundSelectedColor:"transparent",
					        selectedBackgroundColor: "transparent",
					        rowIndexId : rowIndexArray[i]
					    });
				 
				   		alphaRow.height = rowHeight;
				   		
				    	var alphaLabel = Ti.UI.createLabel({
					          top:0, 
					          width:28,
					          left: 0,
					          font: {  fontSize: 16, fontFamily: 'Helvetica Neue' },
					          color: '#fff',
					          textAlign: 'center'
					    });
					    
					    alphaLabel.text = curheader;
					    alphaLabel.height = rowHeight;
					    alphaRow.add( alphaLabel );
					 
					    index.push( alphaRow );
				  	}  
				}
				
				table.setData(  rows );
				alphaTable.setData( index );
				
				var previousIndex = 0;
				
				alphaTable.addEventListener('click', function(e)
				{
					var rowIndex = e.rowData.rowIndexId;
				 	
				  // scroll to index on main Table, and make sure its on the TOP position
				  // to make sure it doesnt jiggle, check to make sure newIndex is not the same as previousIndex
				  if( rowIndex != previousIndex )
				  {
				    table.scrollToIndex(rowIndex,{animated:false,position:Ti.UI.iPhone.TableViewScrollPosition.TOP});
				    previousIndex = rowIndex;
				  }
				});
				
				
        	}	
        	else
        	{
        		//parsed_data[0].Message;
        		table.setData(  rows );
				alphaTable.setData( index );
				var msg = Ti.UI.createLabel({
					text : 'No connections in list',
					color : '#fff',
					font : {fontSize:12},
					wordWrap : true
				});
				
				searchScrollView.add(msg);	

        	}			
			actInd.hide();
        }else{
          alert('HTTP Ready State != 4');
          actInd.hide();
        }           
     }else{
        alert('Transmission failed. Try again later. ' + this.status + " " + this.response);
        actInd.hide();
     }              
    };
 
    xhr.onerror = function(e){console.log(e.source); actInd.hide();alert('Transmission error: ' + e.error);};
});
