var moreFlag = 0;

var currentWindowObj = Ti.UI.currentWindow;

if(currentWindowObj.children > 0)
{
	console.log('children '+currentWindowObj.children[0]);
	currentWindowObj.remove(currentWindowObj.children[0]);
}

var headerView = Ti.UI.createView({
	top : 0,
	height : '13%',
	backgroundImage : 'headerbg.png',
});
/*
var leftIconImage = 'back_icon.png';

if(title == 'Memex' || title == 'News Stream' || title == 'Connections' || title == 'Phinkit Tank Chat' || title == 'Phought Detail' || title == 'Add Phought'|| title == 'Add Connections')
{
	leftIconImage = 'smalllogo.png';
}
*/
leftIconImage = 'smalllogo.png';

var leftIconView = Ti.UI.createView({
	top : '10%',
	left : '5%',
	width : '20%',
	//borderColor:'red'
});

var headerLeftIconImage = Ti.UI.createImageView({
	top : '18%',
	left : '0%',
	image : leftIconImage,
});

var headerLeftIconImage2; 

leftIconView.add(headerLeftIconImage);
//getLatestNotifications();
// getLatestNotifications(function(returnData){
	// console.log('latest return data '+returnData);
// 	
// 	
// });

headerView.add(leftIconView);

var rightIconImageName = '';
currentWindowObj.addEventListener('focus',function(e){
	rightIconImageName = Ti.App.Properties.getString('profileSmallImage');	

	var topSize = '24%';
	
	if(title == 'Profile')
	{
		rightIconImageName = 'logout.png';
		topSize = '30%';
	}

	if(rightIconImageName != '' && rightIconImageName != '-1')
	{
		var headerRightIconImage = Ti.UI.createImageView({
			top : topSize,
			right : 30,
			width:35,
			height : 35,
			image : rightIconImageName,
		});
		
		if(title != 'Profile')
		{	
			headerRightIconImage.borderColor = '#fff';
			headerRightIconImage.borderRadius = 5;
		}
		
		headerView.add(headerRightIconImage);
		
		headerRightIconImage.addEventListener('click',function(){
		
			if(title == 'Profile')
			{
				// Ti.App.Properties.setString('fbToken','');
				// Ti.App.Properties.setString('twToken','');
				// Ti.App.Properties.setString('twTokenSecret','');
				// Ti.App.Properties.setBool('isFbCredentials',false);
				// Ti.App.Properties.setBool('isTwitterCredentials',false);
				// Ti.App.Properties.setBool('isfbcheckboxclicked',false);
				// Ti.App.Properties.removeProperty()
				
				if(Ti.App.Properties.getString('fbToken') != '')
				{
					Ti.Facebook.logout();	
				}
				var myBaseUrl = Ti.App.Properties.getString('baseurl');
				var props = Titanium.App.Properties.listProperties();
				for (var c=0;c<props.length;c++)
				{
				    var value = Titanium.App.Properties.getString(props[c]);
				    Titanium.API.info(props[c]+" = "+value);
				    Titanium.App.Properties.removeProperty(props[c]);
				}
				setTimeout(function(){
					for (var c=0;c<props.length;c++)
					{
					    var value = Titanium.App.Properties.getString(props[c]);
					    Titanium.API.info(props[c]+" = "+value);
					}
					Ti.App.Properties.setInt('countOfNotifications',0);
					//clearInterval(notifiaction_timer);
					Ti.App.Properties.setString('baseurl',myBaseUrl);	
					Ti.API.fireEvent('app:closeAllTabGroup');
				},1000);
			}
			else
			{
				var profileWindow = Ti.UI.createWindow({
					url : 'profile.js'
				});
				Ti.UI.currentTab.open(profileWindow,{animated: true});
			}
		});
	}

});


var headerLabel = Ti.UI.createLabel({
	text : title,
	top : '30%',
	textAlign : 'center',
	color : '#fff',
	font : {fontSize:'18', fontName : 'Helvetica', fontWeight : 'bold'},
});

headerView.add(headerLabel);

leftIconView.addEventListener('click',function(){
	/*
	if(title == 'Memex' || title == 'News Stream' || title == 'Connections' || title == 'Phinkit Tank Chat' || title == 'Phought Detail' || title == 'Add Phought' || title == 'Add Connections' || title == 'Add Phought')
	{*/
		
		if(notiFlag)
		{
			currentWindowObj.remove(notificationView);
			notiFlag = 0;
		}
		else
		{
			//alert('href comes');
			setUpNotificationCount(function(status){
				console.log(' status '+status);
				if(status)
				{
					Ti.App.Properties.setInt('countOfNotifications',0);
					if(headerLeftIconImage2)
					{
						leftIconView.remove(headerLeftIconImage2);
					}	
				}
			});
		
			var notificationModule = require('notificationPopUp').notificationPopUp;
			notificationView = new notificationModule;
			currentWindowObj.add(notificationView);
			notiFlag = 1;
		}
	
/*	}else
	{
		Ti.UI.currentWindow.close();
	}
	*/
	
});



currentWindowObj.add(headerView);

function getLatestNotifications(){
   
	var serverdate = Ti.App.Properties.getString('serverdate');
	var NotificationSeenDate = Ti.App.Properties.getString('NotificationSeenDate');
	console.log('NotificationSeenDate : '+NotificationSeenDate);
	if(NotificationSeenDate != '')
	{
		var serverURL = Ti.App.Properties.getString('baseurl')+'GetRefreshedNotificationsToLatest';
		var xhr = Titanium.Network.createHTTPClient();
		
		xhr.open('POST',serverURL);
		xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
		
		var user_id = Titanium.App.Properties.getString('userid');
		var params = { UserId : user_id, DisplayedDate : NotificationSeenDate };
		var widgets = JSON.stringify(params);
		console.log(widgets);
		xhr.send(widgets);
	   
	    xhr.onload = function(){
	    	//**These all data will me moved to table of local database where onclick of notifications I am showing table data only
	    	if(this.status == '200'){
				console.log('Loading latest notifications in getLatestNotifications');
			    console.log(this.responseText);
			    
			    if(this.readyState == 4){

		        	var parsed_data = JSON.parse(this.responseText);	
		        	console.log(parsed_data);
		        	var status = parsed_data.status;
		        	
		        	var NotificationSeenDate = parsed_data.ServerDateTime;
					var serverdateStr = parsed_data.ServerDateTime;
					
					Ti.App.Properties.setString('NotificationSeenDate',NotificationSeenDate);
		        	var maxLength = '';
		        	if(status == 'Success')
		        	{
		        		console.log('in latest success');
		        		
		        		var notificationObj = parsed_data.TypeNotificationList;
						console.log(notificationObj.length);
						maxLength = notificationObj.length;
		        		for(var i = 0; i < maxLength; i++)
		        		{
		        			console.log(i);
		        			var notificationObjArr = notificationObj[i];
				        	var dateStr = notificationObjArr.DateCreated;
			    			
			    			console.log('date '+notificationObjArr.DateCreated);
			    			
			    			var db = Ti.Database.open('phinkitdb');
			    			
			        		db.execute('INSERT INTO notificationList (id, servertime, datecreated, ActivityName, UserFullName, RelatedUserFullName, ProfileName, RelatedProfileName,UserId,relatedUserId,activityId) VALUES (?,?,?,?,?,?,?,?,?,?,?)', notificationObjArr.ActivityId, serverdateStr, dateStr, notificationObjArr.ActivityName, notificationObjArr.UserFullName, notificationObjArr.RelatedUserFullName, notificationObjArr.ProfileName, notificationObjArr.RelatedProfileName, notificationObjArr.UserId, notificationObjArr.RelatedUserId, notificationObjArr.ActivityId);
			        		
			        		console.log(' added '+i);
		        		}
		        		//console.log('count of latest notifications '+maxLength);
		        	}
		        	
		        	var old_countOfNotifications = Ti.App.Properties.getInt('countOfNotifications');
					console.log('old notifiction count : '+old_countOfNotifications);
					var latest_countOfNotifications = maxLength;
					
					
					if(old_countOfNotifications != null && old_countOfNotifications != '')
					{
						console.log(' i am in if');
						latest_countOfNotifications = old_countOfNotifications + maxLength;
					}
					
					console.log('latest notifiction count : '+latest_countOfNotifications);
					
					Ti.App.Properties.setInt('countOfNotifications',latest_countOfNotifications);
					
	        		if(latest_countOfNotifications > 0)
	        		{
	        			//callback(latest_countOfNotifications);
	        			console.log('I am setting notifcations');
	        			headerLeftIconImage2 = Ti.UI.createImageView({
							image : 'notification.png',
							top : '1%',
							right : '20%',
						});
						var countOfNotifications = Ti.UI.createLabel({
							top : '5%',
							text : latest_countOfNotifications,
							font : {fontSize:12,fontWeight:'bold'},
							color : '#fff',
							textAlign : 'center'
						});
						
						headerLeftIconImage2.add(countOfNotifications);
						
						leftIconView.add(headerLeftIconImage2);
	        		}
		       }
			}    
	    };
	    
	    xhr.onerror = function(e){ /*console.log(e.source); alert('getLatestNotifications Transmission error: ' + e.error);*/};
	}
} 

function setUpNotificationCount(callback){
	//alert('setUpNotificationCount');
	//setup count of unread notifications
	var serverURL = Ti.App.Properties.getString('baseurl')+'UpdateUserNotificationCount';
	var xhr1 = Titanium.Network.createHTTPClient();    
	
	xhr1.open("POST", serverURL);
	xhr1.setRequestHeader("Content-Type","application/json; charset=utf-8");
	
	var user_id = Ti.App.Properties.getString('userid');
	var params = { LoggedInUserId : user_id };
	var widgets = JSON.stringify(params);
	var return_val = false;
	
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
	        		return_val = true;
	        	}
	        	
	    }
	 }
	 callback(return_val);
	}
	
	xhr1.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);return false;};
}


//var notifiaction_timer = setInterval(getLatestNotifications,300000);