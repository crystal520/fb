
Ti.Facebook.appid = '406983586022141';
Titanium.Facebook.permissions = ['email','user_actions.music','user_activities', 'user_events','user_hometown','user_location','user_questions','user_religion_politics','user_videos','publish_actions','user_actions.news','user_birthday','user_games_activity','user_interests','user_notes','user_relationship_details','user_status','user_website','user_about_me','user_actions.video','user_education_history','user_groups','user_likes','user_photos','user_relationships','user_subscriptions','user_work_history'];


var loginWin = Titanium.UI.createWindow
({
	
});

var loginBut = Titanium.UI.createButton
({
	//title:'Login',
	backgroundImage:'iphone/fb.jpeg',
	height:40,
	width:140
});
loginWin.add(loginBut);

loginBut.addEventListener('click', function(e) 
{
	 Titanium.Facebook.authorize(); 

	 var value = Titanium.Facebook.loggedIn;
	
	 if( value == 1 )
	 {
		 	console.log('loginned');
		 	proceedHome();   // proceed to home
	 }	 
});

Ti.Facebook.addEventListener('login', function(e) 
{
    if (e.success) 
    {
    	console.log(e);
    	
		Titanium.App.Properties.setString("birthday",e.data.birthday);
		Titanium.App.Properties.setString("email",e.data.email);
		Titanium.App.Properties.setString("first_name",e.data.first_name);
		Titanium.App.Properties.setString("gender",e.data.gender);
		Titanium.App.Properties.setString("id",e.data.id);
		Titanium.App.Properties.setString("link",e.data.link);
		Titanium.App.Properties.setString("locale",e.data.locale);
		Titanium.App.Properties.setString("name",e.data.name);
		Titanium.App.Properties.setString("username",e.data.username);
		
        console.log('Logged In');
        
        proceedHome();   // proceed to home
    } 
    else if (e.error) 
    {
        alert(e.error);
    } 
    else if (e.cancelled) 
    {
        alert("Canceled");
    }
});

loginWin.open();

// proceed to home function
function proceedHome()
{
	var tabGroup =  Titanium.UI.createTabGroup();
	
	var homeWin = Titanium.UI.createWindow
	({
		url:'home.js',
		title:'Home',
		navBarHidden:true
	});
	
	var tab = Titanium.UI.createTab
	({
	    window:homeWin,
	    title:'Home',
	    icon:'KS_nav_ui.png'
	});
	tabGroup.addTab(tab);
	
	loginWin.close();
	tabGroup.open({animated:true});

}
