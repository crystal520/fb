exports.tabBar = function(){
	
	var tabGroup = Titanium.UI.createTabGroup(); 
	
	var homeWindow = Titanium.UI.createWindow({
		title:'Phoughts',
    	url:'phoughtsList.js',
    	navBarHidden:true
	
	});

	var homeTab = Titanium.UI.createTab({
		icon : 'homeicon.png',
		backgroundImage : 'naviconbg.png',
		title : 'Phoughts',
		window : homeWindow,
	});

	//second tab is for Memex
	var memexWindow = Titanium.UI.createWindow({
		url:'memexList.js',
		title:'Memex',
		navBarHidden:true
	});
	
	var memexTab = Titanium.UI.createTab({
		icon : 'memicon.png',
		backgroundImage : 'naviconbg.png',
		title : 'Phink Tank',
		window : memexWindow,
	});
	
	//Third tab is for Connection
	var connectionWindow = Titanium.UI.createWindow({
		url:'connectionList.js',
		title:'Connection',
		navBarHidden:true
	});
	
	var connectionTab = Titanium.UI.createTab({
		icon : 'connectionicon.png',
		backgroundImage : 'naviconbg.png',
		title : 'My Phinkers',
		window : connectionWindow,
	});
	
	//Fourth tab is for Chat
	var chatWindow = Titanium.UI.createWindow({
		url:'groupchatlist.js',
		title:'Chat',
		navBarHidden:true
	});
	
	var chatTab = Titanium.UI.createTab({
		icon : 'chaticon.png',
		backgroundImage : 'naviconbg.png',
		title : 'Chat',
		window : chatWindow,
	});
	
	tabGroup.addTab(homeTab);
	tabGroup.addTab(memexTab);
	tabGroup.addTab(connectionTab);
	tabGroup.addTab(chatTab);
	
	return tabGroup;
}