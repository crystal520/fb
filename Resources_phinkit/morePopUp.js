exports.imagePopUp = function(){
	
	var moreImage = Ti.UI.createImageView({
		image :  'morebg.png',
		top : '11%',
		right : '2%',
		height : 151,
		width : 144,
		zIndex:1
	});
	
	var profileLabel = Ti.UI.createLabel({
		top : '10%',
		left : '30%',
		text : 'Profile',
		color : '#fff',
		font : {fontSize:12,fontWeight:'bold'}
	});
	
	moreImage.add(profileLabel);
	
	var notificationLabel = Ti.UI.createLabel({
		top : '34%',
		left : '30%',
		text : 'Notification',
		color : '#fff',
		font : {fontSize:12,fontWeight:'bold'}
	});
	
	moreImage.add(notificationLabel);
	
	var searchLabel = Ti.UI.createLabel({
		top : '57%',
		left : '30%',
		text : 'Search',
		color : '#fff',
		font : {fontSize:12,fontWeight:'bold'}
	});
	
	moreImage.add(searchLabel);
	
	var settingsLabel = Ti.UI.createLabel({
		top : '81%',
		left : '30%',
		text : 'Settings',
		color : '#fff',
		font : {fontSize:12,fontWeight:'bold'}
	});
	
	moreImage.add(settingsLabel);
	
	profileLabel.addEventListener('click',function(){
		var profileWindow = Ti.UI.createWindow({
			url : 'profile.js'
		});
		
		Ti.UI.currentTab.open(profileWindow,{animated: true});
	});
	
	notificationLabel.addEventListener('click',function(){
		var notificationWindow = Ti.UI.createWindow({
			url : 'notificationList.js'
		});
		
		Ti.UI.currentTab.open(notificationWindow,{animated: true});
	});
	
	return moreImage;
}
