Ti.include('overrideTabs.js');
//http://phinkit.aspnetdevelopment.in/Phinkit.svc/json/
//http://www.phinkit.com/Phinkit.svc/json/
Ti.App.Properties.setString('baseurl','http://www.phinkit.com/Phinkit.svc/json/');
Ti.App.Properties.setString('fbToken','');
Ti.App.Properties.setString('twToken','');
Ti.App.Properties.setString('twTokenSecret','');
Ti.App.Properties.setBool('isFbCredentials',false);
Ti.App.Properties.setBool('isTwitterCredentials',false);
Ti.App.Properties.setBool('isfbcheckboxclicked',false);


var signinWindow = Titanium.UI.currentWindow;
Titanium.Facebook.appid = "367738626631103";
Titanium.Facebook.permissions = ['email','publish_stream'];
//Titanium.Facebook.permissions = ['publish_stream', 'read_stream', 'email'];

function loadCountryList(){
	console.log('country is loading and saving in local database....');
	actInd.show();
	//creating database
	var db = Ti.Database.open('phinkitdb');
	
	db.execute('DROP TABLE IF EXISTS countrylist');
	db.execute('CREATE TABLE IF NOT EXISTS countrylist (id INTEGER,country_name TEXT ) ');
	
	//Call webservice for country list
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetAllCountry';
	var country_xhr = Titanium.Network.createHTTPClient();    
    
    country_xhr.open("POST", serverURL);
    country_xhr.setTimeout(10000);
 	country_xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    
    country_xhr.send();
   
    country_xhr.onload = function(){
     //alert("responseText: " + this.responseText);
     if(this.status == '200'){
        
        //console.log(this.responseText);
        
        if(this.readyState == 4){
        	
        	var parsed_data = JSON.parse(this.responseText);
			
			var status = parsed_data[0].status;
			var countryList = parsed_data[0].CountryList;
			
			if(status == 'Success')
			{
				//console.log(countryList[0].Country);
				for(var i = 0, l = countryList.length; i < l; i++)
	        	{
	        		var dataObj = countryList[i];
	        		
	        		var id = dataObj.CountryID;
	        		var country_name = dataObj.Country;
	        		
	        		db.execute('INSERT INTO countrylist (id,country_name) VALUES (?,?)',id,country_name);
	        	}
			}
        	
        }
       }
     };
     
    country_xhr.onerror = function(e){console.log(e.source); alert('Not loaded countries: ' + e.error);};
    
    
}

function loadNotifications(callback){
	console.log('loading notifications....');
	actInd.show();
	var db = Ti.Database.open('phinkitdb');
	
	//call service for notifications
    db.execute('DROP TABLE IF EXISTS notificationList');
    db.execute('CREATE TABLE IF NOT EXISTS notificationList (id INTEGER, servertime TEXT, datecreated TEXT, ActivityName TEXT, UserFullName TEXT, RelatedUserFullName TEXT, ProfileName TEXT, RelatedProfileName TEXT,UserId INTEGER,relatedUserId INTEGER,activityId INTEGER)');
	
	//Call webservice for country list
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetActivityStreamForUserNotification_tempByUserId';
	var notification_xhr = Titanium.Network.createHTTPClient();    
    
    notification_xhr.open("POST", serverURL);
    notification_xhr.setTimeout(10000);
 	notification_xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    
    var user_id = Ti.App.Properties.getString('userid');
    if(user_id != '')
    {
    	var params = { UserId : user_id};
	 	var widgets = JSON.stringify(params);
	 	console.log(widgets);
	 	notification_xhr.send(widgets);
    }
    
    notification_xhr.onload = function(){
     //alert("responseText: " + this.responseText);
     if(this.status == '200'){
        
        console.log('......................Notifications Data.................');
        console.log(this.responseText);
        
        if(this.readyState == 4){
        	
        	var parsed_data = JSON.parse(this.responseText);
			var status = parsed_data.status;
			
			var serverdateStr = parsed_data.ServerDateTime;
			
			Ti.App.Properties.setString('serverdate',serverdateStr);
        	Ti.App.Properties.setString('NotificationSeenDate',parsed_data.NotificationSeenDate);
        	
        	if(status == 'Success')
        	{
        		var notificationObj = parsed_data.TypeNotificationList;
    			
        		for(var i = 0, l = notificationObj.length; i < l; i++)
        		{
        			var notificationObjArr = notificationObj[i];
		        	var dateStr = notificationObjArr.DateCreated;
	    			console.log(dateStr);
	        		db.execute('INSERT INTO notificationList (id, servertime, datecreated, ActivityName, UserFullName, RelatedUserFullName, ProfileName, RelatedProfileName,UserId,relatedUserId,activityId) VALUES (?,?,?,?,?,?,?,?,?,?,?)', notificationObjArr.ActivityId, serverdateStr, dateStr, notificationObjArr.ActivityName, notificationObjArr.UserFullName, notificationObjArr.RelatedUserFullName, notificationObjArr.ProfileName, notificationObjArr.RelatedProfile, notificationObjArr.UserId, notificationObjArr.RelatedUserId, notificationObjArr.ActivityId);
        		}
        		callback();	
        	}else{
        		callback();
        	}
        	    					
        }
        else{
        		callback();
        	}
       }
     };
     
    notification_xhr.onerror = function(e){console.log(e.source); alert('Notifications not loaded: ' + e.error);callback();};
    actInd.hide();
   	
}
var tabBarModule = require('footer').tabBar;



