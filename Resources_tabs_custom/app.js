
var initWin4 = Titanium.UI.createWindow({  
	title:'History',
	backgroundColor:'#fff',
	navBarHidden:true,
	tabBarHidden:true,
	url : "home.js",
});
var data_1 = commonTabsView();
initWin4.add(data_1);		
		
var initWin_vpn = Titanium.UI.createWindow({  
    title:'VPN',
    backgroundColor:'#f0f000',
	navBarHidden:true,
	tabBarHidden:true,
});
var data_2 = commonTabsView();
initWin_vpn.add(data_2);

var initWin_msg = Titanium.UI.createWindow({  
    title:'Messages',
    backgroundColor:'#8f8f8f',
    navBarHidden:true,
	tabBarHidden:true,
});
var data_3 = commonTabsView();
initWin_msg.add(data_3);

var tab2 = Titanium.UI.createTab({  
    title:'History',
    window:initWin4
});

var tab3 = Titanium.UI.createTab({  
    title:'VPN',
    window:initWin_vpn
});

var tab4 = Titanium.UI.createTab({  
    title:'Messages',
    window:initWin_msg
});

var tabGroup1 = Titanium.UI.createTabGroup();

tabGroup1.addTab(tab2);
tabGroup1.addTab(tab3);  
tabGroup1.addTab(tab4);

//open tab group
tabGroup1.open();


function commonTabsView()
{
	var bb1 = Titanium.UI.createButtonBar
	({
	    labels:['One', 'Two', 'Three'],
	    backgroundColor:'#336699',
	    bottom:0,
	    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
	    height:30,
	    width:Ti.UI.FILL
	});
	
	bb1.addEventListener('click' , function(e) 
	{
		Ti.API.info(e);
		
		switch(e.index)
		{
			case 0 : 	tab2.setActive(true);
						break;
			case 1 : 	tab3.setActive(true);
						break;
			case 2 : 	tab4.setActive(true);
						break;							
		}
	});
	
	return bb1;
}
