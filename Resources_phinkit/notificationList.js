var notificationWindowObj = Ti.UI.currentWindow;

notificationWindowObj.setBackgroundImage('bg.png');

/******Header View Start********/

var title = 'Notifications';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');

/*
setTimeout(function(){
	var headerModule = require('header').addHeader;
	var headerView = new headerModule('Notifications');
	
	notificationWindowObj.add(headerView);
},1000);
*/

notificationWindowObj.addEventListener('focus',function(){
	if(notificationView != '' && notiFlag == 1)
		{
			notificationWindowObj.remove(notificationView);	
			notiFlag = 0;
		}
	getLatestNotifications();
});



/******Header View End********/

/******Content View Start********/
var scrollView = Ti.UI.createScrollView({
	top : 100,
	left : '1%',
	width : '317',
	contentHeight : 'auto',
	contentWidth : 'auto',
	showHorizontalScrollIndicator : false,
	showVerticalScrollIndicator : true,
	backgroundColor : 'transparent',
	backgroundImage : 'bgprofile.png',
});

var inputData = [];

var backButton = Ti.UI.createButton({
    backgroundImage: 'green_bg.png',
    title:'Back',
    height: 28,
    width: 51,
    top:'15%',
    left:'3%',
});

notificationWindowObj.add(backButton);

backButton.addEventListener('click',function(e){
	Ti.UI.currentWindow.close();
});

var user_id = Ti.App.Properties.getString('userid');

var currentDate = new Date();

currentDate.setHours(0,0,0,0);

var dayStartTime = currentDate.getTime();

var fromdate = '\/Date(' + currentDate.getTime() + ')\/';

currentDate.setDate(currentDate.getDate()-7);

var todate = '\/Date(' + currentDate.getTime() + ')\/';

var serverURL = Ti.App.Properties.getString('baseurl')+'GetActivityStreamForUserNotification_tempByUserId';
var xhr1 = Titanium.Network.createHTTPClient();    

xhr1.open("POST", serverURL);
xhr1.setRequestHeader("Content-Type","application/json; charset=utf-8");

var user_id = Ti.App.Properties.getString('userid');
var params = { UserId : user_id, DateFrom : fromdate, DateTo : todate, ActivityId : null};
var widgets = JSON.stringify(params);
console.log(widgets);
xhr1.send(widgets);
   
xhr1.onload = function(){
     //alert("responseText: " + this.responseText);
 if(this.status == '200'){
    
    console.log(this.responseText);
    
    if(this.readyState == 4){

        	var parsed_data = JSON.parse(this.responseText);	
        	//console.log(parsed_data);
        	
        	var status = parsed_data.status;
        	if(status == 'Success')
        	{
        		var monthNames = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN","JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
        		var notificationObj = parsed_data.TypeNotificationList;
        		var notifyTime = '';
        		
        		//calculating server time
        		var serverdateStr = parsed_data.ServerDateTime;
			    var serverdateStrLength = serverdateStr.length-2;
			    var serverdateObj = new Date(parseInt(serverdateStr.substring(6,serverdateStrLength)));
        		
				var myCurrentTime = serverdateObj.getTime();
        		
        		serverdateObj.setHours(0,0,0,0);
        		var dayStartTime = serverdateObj.getTime();
        		
        		for(var i = 0, l = notificationObj.length; i < l;i++)
				{
					var dateOfNotification = notificationObj[i].DateCreated;
					var dateStr = notificationObj[i].DateCreated;
				    var dateStrLength = dateStr.length-2;
				    var dateObj = new Date(parseInt(dateStr.substring(6,dateStrLength)));
				    var activityId = notificationObj[i].ActivityId;
					var Related_User_Id = notificationObj[i].RelatedUserId;
	
				   	var dateText = '';
				//   alert((dateObj.getMonth() + 1) + '/' + dateObj.getDate() +'/'+ dateObj.getFullYear()+'');
				   //	alert(dateObj.getTime()+' >= '+dayStartTime+'  &&  '+dateObj.getTime()+' <= '+myCurrentTime );
				   
				    if(dateObj.getTime() >=  dayStartTime  &&  dateObj.getTime() <= myCurrentTime )
				    {
				    	var ms = myCurrentTime-dateObj.getTime();
				    	var s = Math.floor(ms / 1000);
					    var m = Math.floor(s / 60);
					    s = s % 60;
					    var h = Math.floor(m / 60);
					    m = m % 60;
					    var d = Math.floor(h / 24);
					    h = h % 24;
					 
					 	dateText = 'About '
				    	if(h > 0)
				    	{
				    		dateText += h+' hours ';
				    	}
				    	else if(m > 0){
				    		dateText += m+' minutes ';
				    	}
				    	else if(s > 0){
				    		dateText += s+' seconds ';
				    	}
				    	dateText += 'ago';
				    }
					else if(dateObj.getTime() <  dayStartTime) 
					{
						var dobj = new Date();
						dobj.setTime(dayStartTime-dateObj.getTime());
						var days = dobj.getDate()-1;
						
						if(dobj.getFullYear() != '1970')
						{
							dateText = ' year ago';
						}
						else if(dobj.getMonth() > 0)
						{
							dateText = dobj.getMonth();
							dateText += dobj.getMonth() == 1?' month ago':' months ago';
						}
						else if(days > 0)
						{
							dateText = days == 1?' yesterday ':days+' days ago';
						}
						else{
							dateText = 'About '+dobj.getHours()+' hours ago';
						}
						
					}
					
					dateObj.setHours(0,0,0,0);
					
					if(notifyTime !== dateObj.getTime())
					{
						var date_value = dateObj.getDate()+' '+monthNames[dateObj.getMonth()]+' ' + dateObj.getFullYear();
						
						var row = Titanium.UI.createTableViewRow({});
						
						var dateImage = Ti.UI.createImageView({
							image : 'date-bg.png',
							left : '10%',
							right : '10%',
							bottom : '1%',
						});
						
						row.add(dateImage);
						
						var dateLabel = Ti.UI.createLabel({
							text : date_value,
							textAlign : 'center',
							color : '#fff',
							font : {fontSize:12, fontWeight:'bold'}
						});
						
						row.add(dateLabel);
						
						inputData.push(row);
						notifyTime = dateObj.getTime();
					}
					
					var ActivityName = notificationObj[i].ActivityName;
					var notificationText = '';
					var notifyimage = '';
					
					if(ActivityName != '' && ActivityName != '-1')
					{
						switch(ActivityName.toUpperCase()){
							
							case "CONNECTION" : 
												if(notificationObj[i].UserFullName != '' && notificationObj[i].UserFullName != '-1')
												{
													notificationText = 'You Connected with <a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" >'+notificationObj[i].UserFullName + '</a>';
												}
												notifyimage = 'connNotification.png';
												break;
							
							case "CONNECTIONREQUEST" : 
												if(notificationObj[i].UserFullName != '' && notificationObj[i].UserFullName != '-1')
												{
													notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" >' + notificationObj[i].UserFullName+'</a> has sent you a connection request';
												}
												notifyimage = 'connNotification.png';
												break;
												
							case "MEMEXCOMMENT" : 
												if(notificationObj[i].UserFullName != '' && notificationObj[i].UserFullName != '-1')
												{
													notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" >' + notificationObj[i].UserFullName+'</a> has left a comment in ';
												}
												
												if(notificationObj[i].RelatedUserFullName != '' && notificationObj[i].RelatedUserFullName != '-1')
												{
													if(notificationObj[i].ProfileName == notificationObj[i].RelatedProfileName)
													{
														notificationText += 'own';
													}
													else
													{
														notificationText += notificationObj[i].RelatedUserFullName;	
													}
												}
												else
												{
													notificationText += 'your';
												}
												
												notificationText += ' Memex';
												notifyimage = 'memicon.png';
												break;
												
							case "MEMEXBUMPED" : 
												if(notificationObj[i].UserFullName != '' && notificationObj[i].UserFullName != '-1')
												{
													notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" >' + notificationObj[i].UserFullName+'</a> bumped ';
												}
												
												if(notificationObj[i].RelatedUserFullName != '' && notificationObj[i].RelatedUserFullName != '-1')
												{
													if(notificationObj[i].ProfileName == notificationObj[i].RelatedProfileName)
													{
														notificationText += 'own';
													}
													else
													{
														notificationText += notificationObj[i].RelatedUserFullName;	
													}
												}
												else
												{
													notificationText += 'your';
												}
												
												notificationText += ' Memex';
												notifyimage = 'memicon.png';
												break;
												
							case "MEMEXCLAPPED" : 
												if(notificationObj[i].UserFullName != '' && notificationObj[i].UserFullName != '-1')
												{
													notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" >'+ notificationObj[i].UserFullName+'</a> clapped ';
												}
												
												if(notificationObj[i].RelatedUserFullName != '' && notificationObj[i].RelatedUserFullName != '-1')
												{
													if(notificationObj[i].ProfileName == notificationObj[i].RelatedProfileName)
													{
														notificationText += 'own';
													}
													else
													{
														notificationText += notificationObj[i].RelatedUserFullName;	
													}
												}
												else
												{
													notificationText += 'your';
												}
												
												notificationText += ' Memex';
												notifyimage = 'memicon.png';
												break;
							
							case "HIGHFIVEMEMEX" : 
												if(notificationObj[i].UserFullName != '' && notificationObj[i].UserFullName != '-1')
												{
													notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" >' + notificationObj[i].UserFullName+'</a> high fived ';
												}
												
												if(notificationObj[i].RelatedUserFullName != '' && notificationObj[i].RelatedUserFullName != '-1')
												{
													if(notificationObj[i].ProfileName == notificationObj[i].RelatedProfileName)
													{
														notificationText += 'own';
													}
													else
													{
														notificationText += notificationObj[i].RelatedUserFullName;	
													}
												}
												else
												{
													notificationText += 'your';
												}
												
												notificationText += ' Memex';
												notifyimage = 'memicon.png';
												break;
							
							case "HIGHFIVEPHOUGHT" : 
												if(notificationObj[i].UserFullName != '' && notificationObj[i].UserFullName != '-1')
												{
													notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" >' + notificationObj[i].UserFullName+'</a> has high fived ';
												}
												
												if(notificationObj[i].RelatedUserFullName != '' && notificationObj[i].RelatedUserFullName != '-1')
												{
													if(notificationObj[i].ProfileName == notificationObj[i].RelatedProfileName)
													{
														notificationText += 'own';
													}
													else
													{
														notificationText += notificationObj[i].RelatedUserFullName;	
													}
												}
												else
												{
													notificationText += 'your';
												}
												
												notificationText += ' Phought';
												notifyimage = 'homeNotification.png';
												break;
												
							case "PHOUGHTRESPONSE" :  
												if(notificationObj[i].UserFullName != '' && notificationObj[i].UserFullName != '-1')
												{
													notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" >' + notificationObj[i].UserFullName+'</a> responded to ';
												}
												
												if(notificationObj[i].RelatedUserFullName != '' && notificationObj[i].RelatedUserFullName != '-1')
												{
													if(notificationObj[i].ProfileName == notificationObj[i].RelatedProfileName)
													{
														notificationText += 'own';
													}
													else
													{
														notificationText += notificationObj[i].RelatedUserFullName;	
													}
												}
												else
												{
													notificationText += 'your';
												}
												
												notificationText += ' Phought';
												notifyimage = 'homeNotification.png';
												break;
												
							case "HIGHFIVEPHOUGHTCOMMENT" : 
												if(notificationObj[i].UserFullName != '' && notificationObj[i].UserFullName != '-1')
												{
													notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" >'+notificationObj[i].UserFullName+'</a> has high fived your response';
												}
												notifyimage = 'homeNotification.png';
												break;
												
						}
					}
					//alert(notificationText);
					if(notificationText != '' && notifyimage != '')
					{
						var row = Titanium.UI.createTableViewRow({
							width : 316,
							height : 87,
							selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
							ActivityName:ActivityName.toUpperCase(),
							activityId:activityId,
							memexOwnerId:Related_User_Id
						});
						
						row.addEventListener('click',function(e)
						{
							//alert(e.rowData.ActivityName);
							if(e.rowData.ActivityName == 'CONNECTION')
							{
								var userDetailWindow = Titanium.UI.createWindow({
									url : 'showProfile.js',
								});
								
								userDetailWindow.user_id = User_id;
						
								Ti.UI.currentTab.open(userDetailWindow, {
									animate : true
								});
							}
							
							else if(e.rowData.ActivityName == 'CONNECTIONREQUEST')
							{
								var showRequestConnWindow = Ti.UI.createWindow({
									url : 'connRequests.js',
								});
							
								Ti.UI.currentTab.open(showRequestConnWindow);	
							}
							
							else if(e.rowData.ActivityName == 'HIGHFIVEPHOUGHT' || e.rowData.ActivityName == 'HIGHFIVEPHOUGHTCOMMENT' || e.rowData.ActivityName == 'PHOUGHTRESPONSE' )	
							{
								var phoughtCommentWindowObj = Ti.UI.createWindow({
									url : 'phoughtComment.js'
								});
			
								//alert(e.rowData.activityId);
								phoughtCommentWindowObj.phtId = e.rowData.activityId;
								Ti.UI.currentTab.open(phoughtCommentWindowObj);
							}	
							
							else if(e.rowData.ActivityName == 'MEMEXCOMMENT' || e.rowData.ActivityName == 'MEMEXBUMPED' || e.rowData.ActivityName == 'MEMEXCLAPPED' || e.rowData.ActivityName == 'HIGHFIVEMEMEX'  )
							{
								var memexDetailWindow = Titanium.UI.createWindow({
									url : 'memexDetail.js',
								});
								memexDetailWindow.memex_id = e.rowData.activityId;
								memexDetailWindow.memex_ownerid = e.rowData.memexOwnerId;
								Ti.UI.currentTab.open(memexDetailWindow,{animate:true});
							}
							
						});
						
						var imageView = Ti.UI.createView({
							left : '10%',
							width : '22%',
							
						});
						
						row.add(imageView);
						
						var iconImage = Ti.UI.createImageView({
							image : notifyimage,
							left : '20%',
						});
						
						imageView.add(iconImage);
						
						var lineImage = Ti.UI.createImageView({
							image : 'div-line.png',
							right : '1%',
						});
						
						imageView.add(lineImage);
						
						var verlineImage = Ti.UI.createImageView({
							image : 'line.png',
							bottom : '0%',
							
						});
						
						row.add(verlineImage);
						
						var htmlData = '<html><body style="color:#fff;font-size:14px;font-family: open sans;">'+ notificationText + '</body><script type="text/javascript">function showProfile(userid){ Ti.App.fireEvent("getUserProfileInfo", {user_id:userid}); }</script></html>';
							
						var label = Ti.UI.createWebView({
							html : htmlData,
							left : '32%',
							width : 210,
							backgroundColor:'transparent',
							top : '15%',
						 	//disableBounce : false
						});
						
						row.add(label);
						
						if(dateText != '')
						{
							var hrlabel = Ti.UI.createLabel({
								bottom : '15%',
								text : dateText,
								left : '35%',
								color : '#fff',
								font : {fontSize:12}
							});
							
							row.add(hrlabel);	
						}
						
						inputData.push(row);
					}
					
					tableView.setData(inputData);
					/*	
					
					var row = Titanium.UI.createTableViewRow({
						height : 75,
						width : 100,
					});
					
					var imageView = Ti.UI.createView({
						left : '10%',
						width : '22%',
						
					});
					
					row.add(imageView);
					
					var iconImage = Ti.UI.createImageView({
						image : 'connNotification.png',
						left : '20%',
					});
					
					imageView.add(iconImage);
					
					var lineImage = Ti.UI.createImageView({
						image : 'div-line.png',
						right : '1%',
					});
					
					imageView.add(lineImage);
					
					var verlineImage = Ti.UI.createImageView({
						image : 'line.png',
						bottom : '0%',
						
					});
					
					row.add(verlineImage);
					
					var label = Ti.UI.createLabel({
						top : '15%',
						text : 'Alix Caiger has responded to your phought',
						left : '40%',
						color : '#fff',
						font : {fontSize:12}
					});
					
					row.add(label);
					
					var hrlabel = Ti.UI.createLabel({
						bottom : '15%',
						text : 'about 1 hr ago',
						left : '40%',
						color : '#fff',
						font : {fontSize:10}
					});
					
					row.add(hrlabel);
					
					inputData.push(row);*/
				}
        	}
        	
        	
        }
     }
};

xhr1.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);};
	

/*
for(var i = 1;i<=2;i++)
{
	var row = Titanium.UI.createTableViewRow({});
	
	var dateImage = Ti.UI.createImageView({
		image : 'date-bg.png',
		left : '10%',
		right : '10%',
		bottom : '1%',
	});
	
	row.add(dateImage);
	
	var dateLabel = Ti.UI.createLabel({
		text : '22 Aug 2012',
		textAlign : 'center',
		color : '#fff',
		font : {fontSize:12, fontWeight:'bold'}
	});
	
	row.add(dateLabel);
	
	inputData.push(row);
	
	var row = Titanium.UI.createTableViewRow({
		height : 75,
		width : 100,
	});
	
	var imageView = Ti.UI.createView({
		left : '10%',
		width : '22%',
		
	});
	
	row.add(imageView);
	
	var iconImage = Ti.UI.createImageView({
		image : 'homeNotification.png',
		left : '20%',
	});
	
	imageView.add(iconImage);
	
	var lineImage = Ti.UI.createImageView({
		image : 'div-line.png',
		right : '1%',
	});
	
	imageView.add(lineImage);
	
	var verlineImage = Ti.UI.createImageView({
		image : 'line.png',
		bottom : '0%',
		
	});
	
	row.add(verlineImage);
	
	var label = Ti.UI.createLabel({
		top : '15%',
		text : 'Alix Caiger has responded to your phought',
		left : '40%',
		color : '#fff',
		font : {fontSize:12}
	});
	
	row.add(label);
	
	var hrlabel = Ti.UI.createLabel({
		bottom : '15%',
		text : 'about 1 hr ago',
		left : '40%',
		color : '#fff',
		font : {fontSize:10}
	});
	
	row.add(hrlabel);
	
	inputData.push(row);
	
	var row = Titanium.UI.createTableViewRow({
		height : 75,
		width : 100,
	});
	
	var imageView = Ti.UI.createView({
		left : '10%',
		width : '22%',
		
	});
	
	row.add(imageView);
	
	var iconImage = Ti.UI.createImageView({
		image : 'connNotification.png',
		left : '20%',
	});
	
	imageView.add(iconImage);
	
	var lineImage = Ti.UI.createImageView({
		image : 'div-line.png',
		right : '1%',
	});
	
	imageView.add(lineImage);
	
	var verlineImage = Ti.UI.createImageView({
		image : 'line.png',
		bottom : '0%',
		
	});
	
	row.add(verlineImage);
	
	var label = Ti.UI.createLabel({
		top : '15%',
		text : 'Alix Caiger has responded to your phought',
		left : '40%',
		color : '#fff',
		font : {fontSize:12}
	});
	
	row.add(label);
	
	var hrlabel = Ti.UI.createLabel({
		bottom : '15%',
		text : 'about 1 hr ago',
		left : '40%',
		color : '#fff',
		font : {fontSize:10}
	});
	
	row.add(hrlabel);
	
	inputData.push(row);
}
*/
var tableView = Titanium.UI.createTableView({
	top : 25,
	bottom : '5%',
	height : 'auto',
    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
    backgroundColor : 'transparent'
});

tableView.addEventListener('click',function(e){
	//showDetailPage(e);
});

scrollView.add(tableView);

notificationWindowObj.add(scrollView);

/******Content View End********/