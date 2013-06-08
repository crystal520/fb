var countUnreadNotifications;
exports.notificationPopUp = function(){
	var notificationView = Ti.UI.createView({
		top : '11%',
		//bottom:'10%',
		left : '2%',
		height : 330,
		width : 316,
		zIndex:9999,	
		//borderColor:'blue'
	});
	
	var tableView = Titanium.UI.createTableView({
		top : '1%',
		height : 270,
		//bottom:'15%',
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
	    backgroundColor : 'transparent'
	});
	
	//alert(Ti.App.Properties.getInt('countOfNotifications'));
	var inputData = [];
	/*
	//show unread notifications 
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetRefreshedNotificationsToLatest';
	var xhr = Titanium.Network.createHTTPClient();    
    
    xhr.open("POST", serverURL);
 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    
    var user_id = Ti.App.Properties.getString('userid');
    var params = { UserId : user_id, DateFrom : null, DateTo : null, ActivityId : null};
 	var widgets = JSON.stringify(params);
 	console.log(widgets);
 	xhr.send(widgets);
   
    xhr.onload = function(){
     //alert("responseText: " + this.responseText);
     if(this.status == '200'){
        
        console.log(this.responseText);
        
        if(this.readyState == 4){
        	
        	var parsed_data = JSON.parse(this.responseText);	
        	
        	if(parsed_data.status == 'Success')
        	{
        		//calculating server time
        		var serverdateStr = parsed_data.ServerDateTime;
			    var serverdateStrLength = serverdateStr.length-2;
			    var serverdateObj = new Date(parseInt(serverdateStr.substring(6,serverdateStrLength)));
        		
				var myCurrentTime = serverdateObj.getTime();
        		
        		serverdateObj.setHours(0,0,0,0);
        		var dayStartTime = serverdateObj.getTime();
        		
        		var notificationObj = parsed_data.TypeNotificationList;
        		//alert(notificationObj.length);
        		for(var i = 0, l = notificationObj.length; i < l; i++)
        		{
        			
        			var dateStr = notificationObj[i].DateCreated;
				    var dateStrLength = dateStr.length-2;
				    var dateObj = new Date(parseInt(dateStr.substring(6,dateStrLength)));
				   
				   	var dateText = '';
				   	
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
					
					var ProfileName = notificationObj[i].ProfileName;
					var UserFullName = notificationObj[i].UserFullName;
					
					var RelatedProfileName = notificationObj[i].RelatedProfileName;
					var RelatedUserFullName = notificationObj[i].RelatedUserFullName;
					
					var ActivityName = notificationObj[i].ActivityName;
					var notificationText = '';
					var notifyimage = '';
					
					if(ActivityName != '' && ActivityName != '-1')
					{
						
						switch(ActivityName.toUpperCase()){
							
							case "CONNECTION" : 
												if(UserFullName != '' && UserFullName != '-1')
												{
													notificationText = 'You Connected with '+UserFullName;
												}
												notifyimage = 'connNotification.png';
												break;
							
							case "CONNECTIONREQUEST" : 
												if(UserFullName != '' && UserFullName != '-1')
												{
													notificationText = UserFullName+' has sent you a connection request';
												}
												notifyimage = 'connNotification.png';
												break;
												
							case "MEMEXCOMMENT" : 
												if(UserFullName != '' && UserFullName != '-1')
												{
													notificationText = UserFullName+' has left a comment in ';
												}
												
												if(RelatedUserFullName != '' && RelatedUserFullName != '-1')
												{
													if(ProfileName == RelatedProfileName)
													{
														notificationText += 'own';
													}
													else
													{
														notificationText += RelatedUserFullName;	
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
												if(UserFullName != '' && UserFullName != '-1')
												{
													notificationText = UserFullName+' bumped ';
												}
												
												if(RelatedUserFullName != '' && RelatedUserFullName != '-1')
												{
													if(ProfileName == RelatedProfileName)
													{
														notificationText += 'own';
													}
													else
													{
														notificationText += RelatedUserFullName;	
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
												if(UserFullName != '' && UserFullName != '-1')
												{
													notificationText = UserFullName+' clapped ';
												}
												
												if(RelatedUserFullName != '' && RelatedUserFullName != '-1')
												{
													if(ProfileName == RelatedProfileName)
													{
														notificationText += 'own';
													}
													else
													{
														notificationText += RelatedUserFullName;	
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
												if(UserFullName != '' && UserFullName != '-1')
												{
													notificationText = UserFullName+' high fived ';
												}
												
												if(RelatedUserFullName != '' && RelatedUserFullName != '-1')
												{
													if(ProfileName == RelatedProfileName)
													{
														notificationText += 'own';
													}
													else
													{
														notificationText += RelatedUserFullName;	
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
												if(UserFullName != '' && UserFullName != '-1')
												{
													notificationText = UserFullName+' has high fived ';
												}
												
												if(RelatedUserFullName != '' && RelatedUserFullName != '-1')
												{
													if(ProfileName == RelatedProfileName)
													{
														notificationText += 'own';
													}
													else
													{
														notificationText += RelatedUserFullName;	
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
												if(UserFullName != '' && UserFullName != '-1')
												{
													notificationText = UserFullName+' responded to ';
												}
												
												if(RelatedUserFullName != '' && RelatedUserFullName != '-1')
												{
													if(ProfileName == RelatedProfileName)
													{
														notificationText += 'own';
													}
													else
													{
														notificationText += RelatedUserFullName;	
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
												if(UserFullName != '' && UserFullName != '-1')
												{
													notificationText = UserFullName+' has high fived your response';
												}
												notifyimage = 'homeNotification.png';
												break;
												
						}
					}
					
					var background_image = 'notification2.png';
			        			
					if(i == 0)
					{
						background_image = 'notification1.png';
					}
					
					if(notificationText != '' && notifyimage != '')
					{
						
						var row = Titanium.UI.createTableViewRow({
							width : 316,
							height : 87,
							backgroundImage : background_image
						});
						
						var iconImage = Ti.UI.createImageView({
							image : notifyimage,
							top : '35%',
							left : '8%',
						});
						
						row.add(iconImage);
						
						var label = Ti.UI.createLabel({
							top : '30%',
							text : notificationText,
							left : '33%',
							color : '#fff',
							font : {fontSize:12}
						});
						
						row.add(label);
						
						if(dateText != '')
						{
							var hrlabel = Ti.UI.createLabel({
								bottom : '15%',
								text : dateText,
								left : '40%',
								color : '#fff',
								font : {fontSize:10}
							});
							
							row.add(hrlabel);	
						}
						tableView.appendRow(row);
						//inputData.push(row);
						
						
						i++;
						
						//inputData.push(row);
					}
					
					
					inputData.push(row);
        		}
        		//inputData.push(row1);
        		tableView.setData(inputData);
        		
        		setUpNotificationCount();
        		
        	}
         }
         else
         {
          alert('HTTP Ready State != 4');
         }           
     }
     else
     {
        alert('Transmission failed. Try again later. ' + this.status + " " + this.response);
     }              
    };
 
    xhr.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);};
	*/
	var db = Ti.Database.open('phinkitdb'); 
		
	var rows = db.execute('SELECT id, activityId, servertime,UserId, datecreated, ActivityName, UserFullName, RelatedUserFullName, ProfileName,relatedUserId, RelatedProfileName FROM notificationList ORDER BY datecreated DESC');
	var totalRows = rows.getRowCount();
	var i = 0;
	
	var notifyTime = '';
	
	while(rows.isValidRow())
	{
		//extracts the data and put into a variable
		var serverdateStr = rows.fieldByName('servertime');
		
		var serverdateStrLength = serverdateStr.length-2;
	    var serverdateObj = new Date(parseInt(serverdateStr.substring(6,serverdateStrLength)));
		
		var myCurrentTime = serverdateObj.getTime();
		
		serverdateObj.setHours(0,0,0,0);
		var dayStartTime = serverdateObj.getTime();
		
		var dayStartTime = serverdateObj.getTime();
		
		var dateStr = rows.fieldByName('datecreated');
		var dateStrLength = dateStr.length-2;
		var dateObj = new Date(parseInt(dateStr.substring(6,dateStrLength)));
		
		//alert(myCurrentTime+' '+dateObj.getTime());	   
	   	var dateText = '';
	//   alert((dateObj.getMonth() + 1) + '/' + dateObj.getDate() +'/'+ dateObj.getFullYear()+'');
	  	//alert(dateObj.getTime()+' >= '+dayStartTime+'  &&  '+dateObj.getTime()+' <= '+myCurrentTime );
	  
	    if(dateObj.getTime() >=  dayStartTime  &&  dateObj.getTime() <= myCurrentTime )
	    {
	    	var ms = myCurrentTime-dateObj.getTime();
	    	var s = Math.floor(ms / 1000);
		    var m = Math.floor(s / 60);
		    s = s % 60;
		    var h = Math.floor(m / 60);
		    m = m % 60;
		    var d = Math.floor(h / 24);
		   // h = h % 24;
		 
			// alert('hsdfsd  123');
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
		
		var ProfileName = rows.fieldByName('ProfileName');
		var UserFullName = rows.fieldByName('UserFullName');
		var User_id = rows.fieldByName('UserId');
		var activityId = rows.fieldByName('activityId');
		var Related_User_Id = rows.fieldByName('relatedUserId');
		var RelatedProfileName = rows.fieldByName('RelatedProfileName');
		var RelatedUserFullName = rows.fieldByName('RelatedUserFullName');
		
		var ActivityName = rows.fieldByName('ActivityName');
		var notificationText = '';
		var notifyimage = '';
		
		
		if(ActivityName != '' && ActivityName != '-1')
		{
			
			switch(ActivityName.toUpperCase()){
				
				case "CONNECTION" : 
									if(UserFullName != '' && UserFullName != '-1')
									{
										notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none; ">You</a> Connected with '+ '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">' +UserFullName+'</a>';
									}
									notifyimage = 'connNotification.png';
									break;
				
				case "CONNECTIONREQUEST" : 
									if(UserFullName != '' && UserFullName != '-1')
									{
										notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" onclick="showProfile(\'' + User_id + '\')">' +UserFullName+'</a> has sent <a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" onclick="showProfile(\'' + Related_User_Id + '\')">you </a>a connection request';
									}
									notifyimage = 'connNotification.png';
									break;
									
				case "MEMEXCOMMENT" : 
									if(UserFullName != '' && UserFullName != '-1')
									{
										notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">' +UserFullName+'</a> has left a comment in ';
									}
									
									if(RelatedUserFullName != '' && RelatedUserFullName != '-1')
									{
										if(ProfileName == RelatedProfileName)
										{
											notificationText += '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">own</a>';
										}
										else
										{
											notificationText += '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">' +RelatedUserFullName + '</a>';	
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
									if(UserFullName != '' && UserFullName != '-1')
									{
										notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">' +UserFullName+'</a> bumped ';
									}
									
									if(RelatedUserFullName != '' && RelatedUserFullName != '-1')
									{
										if(ProfileName == RelatedProfileName)
										{
											notificationText += '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">own</a>';
										}
										else
										{
											notificationText += '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">' +RelatedUserFullName + '</a>';	
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
									if(UserFullName != '' && UserFullName != '-1')
									{
										notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">' +UserFullName+'</a> clapped ';
									}
									
									if(RelatedUserFullName != '' && RelatedUserFullName != '-1')
									{
										if(ProfileName == RelatedProfileName)
										{
											notificationText += '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">own</a>';
										}
										else
										{
											notificationText += '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">' +RelatedUserFullName + '</a>';	
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
									if(UserFullName != '' && UserFullName != '-1')
									{
										notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">' +UserFullName+'</a> high fived ';
									}
									
									if(RelatedUserFullName != '' && RelatedUserFullName != '-1')
									{
										if(ProfileName == RelatedProfileName)
										{
											notificationText += '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">own</a>';
										}
										else
										{
											notificationText += '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">' +RelatedUserFullName+'</a>';	
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
									if(UserFullName != '' && UserFullName != '-1')
									{
										notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" onclick="showProfile(\'' + User_id + '\')">' +UserFullName+'</a> has high fived ';
									}
									
									if(RelatedUserFullName != '' && RelatedUserFullName != '-1')
									{
										if(ProfileName == RelatedProfileName)
										{
											notificationText += '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">own</a>';
										}
										else
										{
											notificationText += '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;">' +RelatedUserFullName+'/a';	
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
									if(UserFullName != '' && UserFullName != '-1')
									{
										notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" onclick="showProfile(\'' + User_id + '\')">' + UserFullName+'</a> responded to ';
									}
									
									if(RelatedUserFullName != '' && RelatedUserFullName != '-1')
									{
										if(ProfileName == RelatedProfileName)
										{
											notificationText += 'own';
										}
										else
										{
											notificationText += RelatedUserFullName;	
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
									if(UserFullName != '' && UserFullName != '-1')
									{
										notificationText = '<a href="#" style="color:#98bf1a;font-weight:bold;font-size:14px;text-decoration:none;" onclick="showProfile(\'' + User_id + '\')">'+UserFullName+'</a> has high fived your response';
									}
									notifyimage = 'homeNotification.png';
									break;
									
			}
		}
		
		
		
		var background_image = 'notification2.png';
        			
		if(i == 0)
		{
			background_image = 'notification1.png';
		}
		
		if(notificationText != '' && notifyimage != '')
		{
			var row = Titanium.UI.createTableViewRow({
				width : 316,
				height : 87,
				backgroundImage : background_image,
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
			
			var iconImage = Ti.UI.createImageView({
				image : notifyimage,
				top : '35%',
				left : '8%',
				//borderWidth:2,
				//borderColor:'#98bf1a'
			});
			
			if(i<Ti.App.Properties.getInt('countOfNotifications') && Ti.App.Properties.getInt('countOfNotifications') != 0)
			{
			    //alert('here');
			    iconImage.borderWidth = 2;
			    iconImage.borderColor = '#98bf1a';
			}
			
			row.add(iconImage);
			
			/*
			var username_label = Ti.UI.createLabel({
				top : '30%',
				text : UserFullName,
				left : '33%',
				color : '#98bf1a',
				font : {fontSize:14,fontWeight:'bold',fontName:'Halvetica'}
			});
			
			
			var label = Ti.UI.createLabel({
				top : '30%',
				text : notificationText,
				left : '33%',
				color : '#fff',
				font : {fontSize:12}
			});
			*/
			
			var htmlData = '<html><body style="color:#fff;font-size:14px;font-family: open sans;">'+ notificationText + '</body><script type="text/javascript">function showProfile(userid){ Ti.App.fireEvent("getUserProfileInfo", {user_id:userid}); }</script></html>';
			
			var label = Ti.UI.createWebView({
				html : htmlData,
				left : '30%',
				width : 210,
				backgroundColor:'transparent',
				top : '15%',
			 	disableBounce : true
			});
			
			//row.add(username_label);
			row.add(label);
			
			if(dateText != '')
			{
				var hrlabel = Ti.UI.createLabel({
					bottom : '15%',
					text : dateText,
					left : '33%',
					color : '#fff',
					font : {fontSize:12}
				});
				
				row.add(hrlabel);	
			}
			tableView.appendRow(row);
			//inputData.push(row);
			
			/*
			*/
			i++;
			
			//inputData.push(row);
		}
		
		rows.next();
	}
	
	rows.close();

	/*
	
	*/
	/*var row = Titanium.UI.createTableViewRow({
		width : 316,
		height : 87,
		backgroundImage : 'notification1.png'
	});
	
	var iconImage = Ti.UI.createImageView({
		image : 'homeNotification.png',
		top : '35%',
		left : '8%',
	});
	
	row.add(iconImage);
	
	var label = Ti.UI.createLabel({
		top : '30%',
		text : 'Alix Caiger has responded to your phought',
		left : '33%',
		color : '#fff',
		font : {fontSize:12}
	});
	
	row.add(label);
	
	var hrlabel = Ti.UI.createLabel({
		bottom : '15%',
		text : 'about 1 hr ago',
		left : '33%',
		color : '#fff',
		font : {fontSize:10}
	});
	
	row.add(hrlabel);
	
	inputData.push(row);
	
	var row = Titanium.UI.createTableViewRow({
		width : 316,
		height : 87,
		backgroundImage : 'notification2.png'
	});
	
	var iconImage = Ti.UI.createImageView({
		image : 'connNotification.png',
		top : '28%',
		left : '8%',
	});
	
	row.add(iconImage);
	
	var label = Ti.UI.createLabel({
		top : '24%',
		text : 'Alix Caiger has responded to your phought',
		left : '33%',
		color : '#fff',
		font : {fontSize:12}
	});
	
	row.add(label);
	
	var hrlabel = Ti.UI.createLabel({
		bottom : '15%',
		text : 'about 1 hr ago',
		left : '33%',
		color : '#fff',
		font : {fontSize:10}
	});
	
	row.add(hrlabel);
	
	inputData.push(row);*/
	
	
	notificationView.add(tableView);
	
	if(totalRows > 0)
	{
		var row1 = Titanium.UI.createView({
			top : '80%',
			height : '47',
			backgroundImage : 'view-all-but.png'
		});
		
		var label = Ti.UI.createLabel({
			top : '15%',
			text : 'View all notifications',
			textAlign : 'center',
			color : '#98bf1a',
			font : {fontSize:14,fontWeight:'bold'}
		});
		
		row1.addEventListener('click',function(){
			
			var notificationWindow = Ti.UI.createWindow({
				url : 'notificationList.js'
			});
			
			Ti.UI.currentTab.open(notificationWindow,{animated: true});
		});
		
		row1.add(label);
		notificationView.add(row1);
	}
	
		
	return notificationView;
	
}

function setUpNotificationCount(){
	//alert('setUpNotificationCount');
	//setup count of unread notifications
	var serverURL = Ti.App.Properties.getString('baseurl')+'UpdateUserNotificationCount';
	var xhr1 = Titanium.Network.createHTTPClient();    
	
	xhr1.open("POST", serverURL);
	xhr1.setRequestHeader("Content-Type","application/json; charset=utf-8");
	
	var user_id = Ti.App.Properties.getString('userid');
	var params = { LoggedInUserId : user_id };
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
	    }
	 }
	}
	
	xhr1.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);};
}



Ti.App.addEventListener('getUserProfileInfo', function(e) {
	return false;
	//alert('ever ocuus');
	var userDetailWindow = Titanium.UI.createWindow({
		url : 'showProfile.js',
	});
	userDetailWindow.user_id = e.user_id;

	Ti.UI.currentTab.open(userDetailWindow, {
		animate : true
	});
});
