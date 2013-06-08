var moreFlag = 0;
var profileWindowObj = Ti.UI.currentWindow;
 
Ti.App.Properties.setString('base64image','');
Ti.App.Properties.setString('profile_name','');
Ti.App.Properties.setString('profile_mobile_image','');

profileWindowObj.setBackgroundImage('bg.png');
profileWindowObj.exitOnClose = true;

/******Header View Start********/
var title = 'Profile';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');
/*
setTimeout(function(){
	var headerModule = require('header').addHeader;
	var headerView = new headerModule('Profile');
	
	profileWindowObj.add(headerView);
},1000);
*/
profileWindowObj.addEventListener('focus',function(){
	if(notificationView != '' && notiFlag == 1)
		{
			profileWindowObj.remove(notificationView);	
			notiFlag = 0;
		}
	getLatestNotifications();	
});



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

profileWindowObj.add(actInd);

var backButton = Ti.UI.createButton({
    backgroundImage: 'green_bg.png',
    title:'Back',
    height: 28,
    width: 51,
    top:'15%',
    left:'3%',
});

profileWindowObj.add(backButton);

backButton.addEventListener('click',function(e){
	Ti.UI.currentWindow.close();
});


var profileTable = Ti.UI.createTableView({
	top : '25%',
	height : '350',
	//bottom:'25%',
	backgroundColor : 'transparent',
	separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
});

var inputRow = []

var userProfileImageRow = Ti.UI.createTableViewRow({
	backgroundColor : 'transparent',
});

var profileLargeImage = Ti.App.Properties.getString('profileLargeImage');

var userProfileImage = Ti.UI.createImageView({
	width : 200,
	height : 200,
	image : profileLargeImage,
	borderColor:'#fff',
	borderRadius:8,
	borderWidth:3
});

userProfileImageRow.add(userProfileImage)

inputRow.push(userProfileImageRow);

var uploadButtonImageRow = Ti.UI.createTableViewRow({
	backgroundColor : 'transparent',
});

var uploadButtonImage = Ti.UI.createButton({
	top : '10%',
	width : 130,
	height : 30,
	title : 'Add Photo',
	backgroundImage:'green_bg.png'
});


uploadButtonImageRow.add(uploadButtonImage)

inputRow.push(uploadButtonImageRow);

uploadButtonImage.addEventListener('click',function(e){
	
	if(e.source.title == 'Upload Photo')
	{
		actInd.message = 'Uploading Photo..';
		saveData('Upload Photo');
	}
	else
	{
		var t = Titanium.UI.create2DMatrix();
		t = t.scale(0);
	
		var w = Titanium.UI.createWindow({
			backgroundColor:'none',
			backgroundImage : 'bg.png',
			borderWidth:8,
			borderColor:'#999',
			height:400,
			width:300,
			borderRadius:10,
			opacity:0.92,
			transform:t
		});
	
		// create first transform to go beyond normal size
		var t1 = Titanium.UI.create2DMatrix();
		t1 = t1.scale(1.1);
		var a = Titanium.UI.createAnimation();
		a.transform = t1;
		a.duration = 200;
	
		// when this animation completes, scale to normal size
		a.addEventListener('complete', function()
		{
			Titanium.API.info('here in complete');
			var t2 = Titanium.UI.create2DMatrix();
			t2 = t2.scale(1.0);
			w.animate({transform:t2, duration:200});
		});
	
		//create a button from camera or gallary
		var c = Titanium.UI.createButton({
			title:'From Camera',
			top : '30%',
			height:30,
			width:200
		});
		w.add(c);
		c.addEventListener('click', function()
		{
			var t3 = Titanium.UI.create2DMatrix();
			t3 = t3.scale(0);
			w.close({transform:t3,duration:300});
			
			Ti.Media.showCamera({
			
			success : function(event){
				Ti.API.info(event);
				var cropRect = event.cropRect;
				var image = event.media;
				Ti.API.info("image :"+image);
				Ti.API.debug('Our type was: '+event.mediaType);
				
				if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
				{
					var filename = new Date().getTime() + '_mobile.png';
					
					var createdFile = Titanium.Filesystem.getFile(Ti.Filesystem.tempDirectory,filename);
					createdFile.write(image);
					
					var blob =createdFile.read();
					var blob1=Ti.Utils.base64encode(blob);
					
					userProfileImage.image = event.media;
					
					Ti.App.Properties.removeProperty('profile_mobile_image');
					Ti.App.Properties.setString('profile_mobile_image',filename);
					
					//alert('here ' + Ti.App.Properties.get('profile_image'));
					
					Ti.App.Properties.removeProperty('base64image');
					Ti.App.Properties.setString('base64image',blob1);
					uploadButtonImage.title = 'Upload Photo';
					//Ti.App.Properties.setString('base64image',event.media);
					console.log('base64code for image');
					//console.log(blob1);
				}
				else
				{
					alert("got the wrong type back ="+event.mediaType);
				}
				},
				
				cancel : function(){
					
				},
				
				error : function(error){
					
					var a = Ti.UI.createAlertDialog({title : 'Camera'});
					
					if(error.code == Titanium.Media.NO_CAMERA)
					{
						a.setMessage('Please run this test on device');
					}
					else
					{
						a.setMessage('Unexpected error: ' + error.code);
					}
					// show alert
					a.show();
				},
				
				saveToPhotoGallery:true,
				allowEditing:true,
				mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
			});
		});
		
		var g = Titanium.UI.createButton({
			title:'From Gallery',
			top : '50%',
			height:30,
			width:200
		});
		w.add(g);
		
		g.addEventListener('click', function()
		{
			var t3 = Titanium.UI.create2DMatrix();
			t3 = t3.scale(0);
			w.close({transform:t3,duration:300});
			
			Ti.Media.openPhotoGallery({
	               success: function(e)
	               {
		           		var filename  = new Date().getTime() + '_mobile.png';
		                var tmp = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory,filename);
		                tmp.write(e.media);
		                var blob = tmp.read();
		                var blob1=Ti.Utils.base64encode(blob);
		                userProfileImage.image = e.media;
					
						Ti.App.Properties.removeProperty('profile_mobile_image');
						Ti.App.Properties.setString('profile_mobile_image',filename);
						Ti.App.Properties.removeProperty('base64image');
						Ti.App.Properties.setString('base64image',blob1);
						uploadButtonImage.title = 'Upload Photo';
				   }
			});		   
	 	});
		var b = Titanium.UI.createButton({
			title:'Close',
			top : '70%',
			height:30,
			width:200
		});
		w.add(b);
		
		b.addEventListener('click', function()
		{
			var t3 = Titanium.UI.create2DMatrix();
			t3 = t3.scale(0);
			w.close({transform:t3,duration:300});
		});
	
		w.open(a);
	}
	
});

/******Content View Start *******/
/*var profileDetailScrollView = Ti.UI.createScrollView({
	top : '55%',
	left : '1%',
	width : '317',
	height : 'auto',
	contentHeight : 'auto',
	contentWidth : 'auto',
	showHorizontalScrollIndicator : false,
	showVerticalScrollIndicator : true,
	backgroundImage : 'contentarea.png',
});
*/

var profileDetailScrollView = Ti.UI.createTableViewRow({
	top : '5%',
	left : '1%',
	//bottom:'5%',
	width : 317,
	height : 800,
	backgroundImage : 'contentarea.png',
});

inputRow.push(profileDetailScrollView);

var tableViewRow = Ti.UI.createTableView({
	top : '5%',
	backgroundColor : 'transparent',
	scrollable : false,
	separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
});

profileDetailScrollView.add(tableViewRow);

var profileData = [];

var fnameRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
});

var fname = Ti.UI.createTextField({
	top : '0%',
	height : 34,
	width : 261,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'First Name',
	font:{fontSize:16,fontName : 'Helvetica'},
	paddingLeft : 10,
	color : '#fff',
});

fnameRow.add(fname);

profileData.push(fnameRow);

var lnameRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
});

var lname = Ti.UI.createTextField({
	top : '0%',
	height : 34,
	width : 261,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Last Name',
	font:{fontSize:16,fontName : 'Helvetica'},
	paddingLeft : 10,
	color : '#fff',
});

lnameRow.add(lname);

profileData.push(lnameRow);

var emailRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
});

var email = Ti.UI.createTextField({
	top : '0%',
	height : 34,
	width : 261,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Email',
	font:{fontSize:16,fontName : 'Helvetica'},
	paddingLeft : 10,
	color : '#fff',
});

emailRow.add(email)

profileData.push(emailRow);

var oldpasswordRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
});

var oldpswrd = Ti.UI.createTextField({
	top : '0%',
	height : 34,
	width : 261,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Old Password',
	passwordMask : true,
	font:{fontSize:16,fontName : 'Helvetica'},
	paddingLeft : 10,
	color : '#fff',
});

oldpasswordRow.add(oldpswrd)

profileData.push(oldpasswordRow);

var passwordRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
});

var pswrd = Ti.UI.createTextField({
	top : '0%',
	height : 34,
	width : 261,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Password',
	passwordMask : true,
	font:{fontSize:16,fontName : 'Helvetica'},
	paddingLeft : 10,
	color : '#fff',
});

passwordRow.add(pswrd)

profileData.push(passwordRow);

var confirmPasswordRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
});

var confirmPswrd = Ti.UI.createTextField({
	top : '0%',
	height : 34,
	width : 261,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Confirm Password',
	passwordMask : true,
	font:{fontSize:16,fontName : 'Helvetica'},
	paddingLeft : 10,
	color : '#fff',
});

confirmPasswordRow.add(confirmPswrd)

profileData.push(confirmPasswordRow);

/****start picker handling ******/
var picker = Ti.UI.createPicker({
	bottom :-320 ,
    zIndex :1,
});

var data = [];

var db = Ti.Database.open('phinkitdb'); 
	
var rows = db.execute('SELECT id,country_name FROM countrylist');

while(rows.isValidRow())
{
	//extracts the data and put into a variable
	var country_name = rows.fieldByName('country_name');
	var country_id = rows.fieldByName('id');
	var c = Ti.UI.createPickerRow({title : country_name,custom_item : country_id});
	data.push(c);
	rows.next();
}

rows.close();

if(data.length > 0)
{
	picker.add(data);	
}


profileWindowObj.add(picker);

var donebtn = Ti.UI.createButton({
	title : 'Done',
	zIndex : 1,
	right : '1%',
	borderRadius : 5,
});

var toolbar_pick = Ti.UI.iOS.createToolbar({
	 backgroundColor : "#f00",
	  bottom        : -50,
	  items       :[donebtn],
	  barColor      :'#000',
	  zIndex :1
});

profileWindowObj.add(toolbar_pick);

picker.addEventListener('change',function(e){
	countryList.value = e.row.title;
	Ti.App.Properties.setString('country_id',e.row.custom_item);
});

var dob_picker = Ti.UI.createPicker({
    type:Ti.UI.PICKER_TYPE_DATE,
    bottom :-320 ,
    zIndex :1
});

profileWindowObj.add(dob_picker);

dob_picker.addEventListener('change',function(e){
	var dateObj = new Date(e.value) ;
	var dob_value = (dateObj.getMonth() + 1) + '/' + dateObj.getDate() +'/'+ dateObj.getFullYear();
	dob.value =  dob_value;
	Ti.App.Properties.setString('dateOfBirth','\/Date(' + dateObj.getTime() + ')\/');
});

donebtn.addEventListener('click',function(){
     picker.animate({bottom:-270, duration: 500});
     toolbar_pick.animate({bottom:-50, duration: 500});
	 dob_picker.animate({bottom:-270, duration: 500});
});
/****end picker handling ******/

var dobRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
});

var dob = Ti.UI.createTextField({
	top : '0%',
	height : 34,
	width : 261,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Date of Birth',
	font:{fontSize:16,fontName : 'Helvetica'},
	paddingLeft : 10,
	color : '#fff',
});

dobRow.add(dob)

dob.addEventListener('focus',function(){
	dob.blur();
	dob_picker.animate({bottom:0, duration: 500});
    toolbar_pick.animate({bottom:215, duration: 500});
});

profileData.push(dobRow);

var postCodeRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
});

var postCode = Ti.UI.createTextField({
	top : '0%',
	height : 34,
	width : 261,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Postal Code',
	font:{fontSize:16,fontName : 'Helvetica'},
	paddingLeft : 10,
	color : '#fff',
});

postCodeRow.add(postCode);

profileData.push(postCodeRow);

var locationRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
});

var location = Ti.UI.createTextField({
	top : '0%',
	height : 34,
	width : 261,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Location',
	font:{fontSize:16,fontName : 'Helvetica'},
	paddingLeft : 10,
	color : '#fff',
});

locationRow.add(location);

profileData.push(locationRow);

var countryRow = Ti.UI.createTableViewRow({
	width : 317,
	height : 50,
	backgroundColor : 'transparent',
});

var countryList = Ti.UI.createTextField({
	top : '0%',
	height : 34,
	width : 261,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Country',
	font:{fontSize:16,fontName : 'Helvetica'},
	paddingLeft : 10,
	color : '#fff',
});

countryRow.add(countryList);

profileData.push(countryRow);

countryList.addEventListener('focus',function(e){
	countryList.blur();
	picker.animate({bottom:0, duration : 500});
	toolbar_pick.animate({bottom:215, duration: 500});
});

//picker.setSelectedRow(0, 2, false); // select Mangos
/*
var roleRow = Ti.UI.createTableViewRow({
	width : '317',
	height : 'auto',
	backgroundColor : 'transparent',
});

var roleTextArea = Ti.UI.createTextArea({
	borderRadius : 10,
	backgroundColor : 'transparent',
	backgroundImage : 'logininputbg.png',
	value : 'Role',
	top : '0%',
	width : 265,
	height : 124,
	color : '#fff'
});

roleRow.add(roleTextArea)

profileData.push(roleRow);
*/

/*roleTextArea._hintText = roleTextArea.value;

roleTextArea.addEventListener('focus',function(e){
	if(e.source.value == e.source._hintText){
		e.source.value = "";
	}
});

roleTextArea.addEventListener('blur',function(){
	if(e.source.value == ""){
		e.source.value = e.source._hintText;
	}
});*/

var jobTitleRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
});

var jobTitle = Ti.UI.createTextField({
	top : '0%',
	height : 34,
	width : 261,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Job Title',
	font:{fontSize:16,fontName : 'Helvetica'},
	paddingLeft : 10,
	color : '#fff',
});

jobTitleRow.add(jobTitle);

//profileData.push(jobTitleRow);

var companyRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
	
});

var company = Ti.UI.createTextField({
	top : '0%',
	height : 34,
	width : 261,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'Company',
	font:{fontSize:16,fontName : 'Helvetica'},
	paddingLeft : 10,
	color : '#fff',
});

companyRow.add(company);

//profileData.push(companyRow);

var genderRow = Ti.UI.createTableViewRow({
	width : 317,
	height : 50,
	backgroundColor : 'transparent',
	selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
});

var genderLabel = Ti.UI.createLabel({
	left : '10%',
	height : 'auto',
	width :70,
	font:{fontSize:16,fontName : 'Helvetica'},
	color : '#fff',
	text:'Gender',
	backgroundColor : 'transparent'
});

genderRow.add(genderLabel);

var tickMale = Ti.UI.createImageView({
    left : '37%',
	width: 'auto',
    height: 'auto',
    image: 'radiobland.png',
    value: false //value is a custom property in this casehere.
});
 
//Attach some simple on/off actions
tickMale.on = function() {
    this.image = 'radioselected.png';
    this.value = true;
};
 
tickMale.off = function() {
    this.image = 'radiobland.png';
    this.value = false;
};

tickMale.addEventListener('click', function(e) {
	if(e.source.value == false) {
    	tickFemale.off();
        e.source.on();
    } else {
    	tickFemale.on();
        e.source.off();
    }
});

genderRow.add(tickMale);

var maleLabel = Ti.UI.createLabel({
	left : '45%',
	height : 'auto',
	width : 'auto',
	font:{fontSize:16,fontName : 'Helvetica'},
	color : '#fff',
	text : 'Male',
	backgroundColor : 'transparent'
});

genderRow.add(maleLabel);

var tickFemale = Ti.UI.createImageView({
    left : '60%',
	width: 'auto',
    height: 'auto',
    image: 'radiobland.png',
    value: false //value is a custom property in this casehere.
});
 
//Attach some simple on/off actions
tickFemale.on = function() {
    this.image = 'radioselected.png';
    this.value = true;
};
 
tickFemale.off = function() {
    this.image = 'radiobland.png';
    this.value = false;
};

tickFemale.addEventListener('click', function(e) {
    if(e.source.value == false) {
    	tickMale.off();
        e.source.on();
    } else {
    	tickMale.on();
        e.source.off();
    }
});

genderRow.add(tickFemale);

var femaleLabel = Ti.UI.createLabel({
	left : '68%',
	height : 'auto',
	width : 'auto',
	font:{fontSize:16,fontName : 'Helvetica'},
	color : '#fff',
	text : 'Female',
	backgroundColor : 'transparent'
});

genderRow.add(femaleLabel);

profileData.push(genderRow);

var medalRow = Ti.UI.createTableViewRow({
	width : 317,
	height:90,
	//top:40,
	backgroundColor : 'transparent',
	selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
});

var medalLabel = Ti.UI.createLabel({
	left : '10%',
	height : 'auto',
	width : 'auto',
	font:{fontSize:16,fontName : 'Helvetica'},
	color : '#fff',
	text : 'Medals',
	backgroundColor : 'transparent'
});

var medalView = Titanium.UI.createView({
	right:'10%',
	width:180,
	height:90,
	top:0,
	//borderColor:'red'
});

medalRow.add(medalLabel);
medalRow.add(medalView);

profileData.push(medalRow);

var errorMessageRow = Ti.UI.createTableViewRow({
	width : 317,
	height : 20,
	backgroundColor : 'transparent',
});

var errorMessage = Ti.UI.createLabel({
	left : '10%',
	height : 'auto',
	width : 'auto',
	font:{fontSize:16,fontName : 'Helvetica'},
	color : 'red',
	text : 'Please fill details',
	backgroundColor : 'transparent'
});

errorMessageRow.add(errorMessage)

errorMessage.hide();

profileData.push(errorMessageRow);

var submitRow = Ti.UI.createTableViewRow({
	width : '317',
	height : 50,
	//bottom:50,
	backgroundColor : 'transparent',
	selectionStyle:'none'
});

var submitBtn = Ti.UI.createImageView({
	height : 'auto',
	width : 'auto',
	image : 'submit.png'
});

submitRow.add(submitBtn)

profileData.push(submitRow);

profileTable.setData(inputRow);

tableViewRow.setData(profileData);

//profileDetailScrollView.add(profileTable);

profileWindowObj.add(profileTable);
//profileWindowObj.add(profileDetailScrollView);

/******Content View End *******/

/*headerImage.addEventListener('click',function(e)
{
	
	alert(e.source.custid);
	
	
})
*/

profileWindowObj.addEventListener('focus',function(){
	actInd.show();
	
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetUserEditProfileDetailsByUserId';
	
	console.log('get user details =' + serverURL);
	var xhr = Titanium.Network.createHTTPClient();    
    
    xhr.open("POST", serverURL);
 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    var userid = '';
    userid = Ti.App.Properties.getString('userid');
    
    var params = { LoggedInUserId : userid ,RequestedUserId : userid};
 	var widgets = JSON.stringify(params);
 	console.log(widgets);
 	xhr.send(widgets);
   
    xhr.onload = function(){
     //alert("responseText: " + this.responseText);
     if(this.status == '200'){
        
        console.log(this.responseText);
        
        if(this.readyState == 4){
        	
        	var parsed_data = JSON.parse(this.responseText);	
        	console.log(parsed_data.status);
        	
        	if(parsed_data.status == 'Success')
        	{
        		if(parsed_data.FirstName != '-1')
        		{
        			fname.value  = parsed_data.FirstName
        		}
        		if(parsed_data.Surname != '-1')
        		{
        			lname.value  = parsed_data.Surname;
        		}
        		if(parsed_data.Email != '-1')
        		{
        			email.value  = parsed_data.Email;
        		}
        		if(parsed_data.DateOfBirth != '-1')
        		{
        			var dateStr = parsed_data.DateOfBirth;
				    var dateStrLength = dateStr.length-2;
				    var dateObj = new Date(parseInt(dateStr.substring(6,dateStrLength)));
				    var dob_value = (dateObj.getMonth() + 1) + '/' + dateObj.getDate() +'/'+ dateObj.getFullYear();
					dob.value =  dob_value;
					Ti.App.Properties.setString('dateOfBirth','\/Date(' + dateObj.getTime() + ')\/');
        		}
        		if(parsed_data.PostalOrZipCode != '-1')
        		{
        			postCode.value  = parsed_data.PostalOrZipCode;
        		}
        		if(parsed_data.Location != '-1')
        		{
        			location.value  = parsed_data.Location;
        		}
        		if(parsed_data.CountryID != '-1')
        		{
        			countryList.value  = parsed_data.Country;
        			Ti.App.Properties.setString('country_id',parsed_data.CountryID);
        			//picker.setSelectedRow(0, CountryID, false);
        		}
        		if(parsed_data.JobTitle != '-1')
        		{
        			jobTitle.value  = parsed_data.JobTitle;
        		}
        		if(parsed_data.Company != '-1')
        		{
        			company.value  = parsed_data.Company;
        		}
        		if(parsed_data.Gender != '-1')
        		{
        			if(parsed_data.Gender == 'Male')
        			{
        				tickFemale.off();
        				tickMale.on();
        			}
        			else if(parsed_data.Gender == 'Female')
        			{
        				tickMale.off();
        				tickFemale.on();
        			}
        		}
        		if(parsed_data.ProfileImage != '-1')
        		{
        			Ti.App.Properties.setString('profile_image',Ti.App.Properties.getString('profileImageName'));
        			//alert('heres also');
        		}
        		
        		if(parsed_data.ProfileName != '-1')
        		{
        			Ti.App.Properties.setString('profile_name',Ti.App.Properties.getString('profileImageName'));
        		}
        		
        		if(parsed_data.MedalsAchieved != '-1')
        		{
        			var imgArr = parsed_data.MedalsAchieved;
        			left_c = 14;
        			top_c = 10
        			for(var i=0;i<imgArr.length;i++)
        			{
        				if(imgArr[i].MedalImagePath != null && imgArr[i].MedalImagePath != '')
        				{
        					var medalImage = Ti.UI.createImageView({
							    image: imgArr[i].MedalImagePath,
							    left:left_c,
							    top:top_c,
							    borderRadius:4
							}); 			
							
							medalView.add(medalImage);
							left_c += 40;
						 	//top_c += 40; 	
							if(i==3)
							{
								top_c = 50;
								left_c = 14;
							}
							
						}
        			}
        		}
        		
        		Ti.App.Properties.setString('profile_name',Ti.App.Properties.getString('profileImageName'));
        		
        	}
        	actInd.hide();
        }
      }
    };
    
    xhr.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);};
    actInd.hide();    		
});

var submitFlag='';

//saving profile data on server

function saveData(submitFlag)
	{
		Ti.API.info('Submit button clicked');
		errorMessage.hide();
		
		var isValidate = false;
		var error_message = '';
		
		if( pswrd.value != '' && confirmPswrd.value != '')
		{
			if(pswrd.value == confirmPswrd.value)
			{
				if(oldpswrd.value != '')
				{
					isValidate = true;
				}
				else
				{
					error_message = 'Please fill old password';
				}
			}
			else
			{
				error_message = 'Password and Confirm password both must same';
			}
		}
		else{
			
			if(pswrd.value != '' && confirmPswrd.value == '')
			{
				error_message = 'Please fill confirm password';
			}
			else if(pswrd.value == '' && confirmPswrd.value != '')
			{
				error_message = 'Please fill password';
			}
			else
			{
				isValidate = true;
			}
		}
		
		/*if(Ti.App.Properties.getString('profile_image') == null || Ti.App.Properties.getString('profile_image') == '')
		{
			alert('Please upload image');
			return false;
		}*/
		
		if(isValidate)
		{
			actInd.show();
		
			/*console.log('fname.value '+fname.value+' lname.value'+lname.value+' email '+email.value+'  old password '+oldpswrd.value+' new password '+pswrd.value+'  confirm password '+confirmPswrd.value+' dob '+dob.value);
			console.log(' postal code' + postCode.value+' location '+location.value+' countryList.value '+countryList.value+' jobtitle : '+jobTitle.value+' company name:'+company.value+' gender male'+tickMale.value);
			console.log(' female'+tickFemale.value);
			console.log(Ti.App.Properties.getString('country_id'));*/
			
			
			var gender_value = '';
			if(tickFemale.value)
			{
				gender_value = 'Female';
			}
			else
			{
				gender_value = 'Male';
			}
			
			var serverURL = Ti.App.Properties.getString('baseurl')+'UpdateUserProfileDetails';
			var xhr = Titanium.Network.createHTTPClient();    
		    
		    xhr.open("POST", serverURL);
		    xhr.setTimeout(10000);
		 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
		    
		    var userid = Ti.App.Properties.getString('userid');
		    var dateOfBirth = '';
		    
		    var dob_value = Ti.App.Properties.getString('dateOfBirth');
		    var country_id = Ti.App.Properties.getString('country_id');
		    if(Ti.App.Properties.getString('profile_mobile_image') != '' && Ti.App.Properties.getString('profile_mobile_image') != null)
		    {
		    	var profile_image = Ti.App.Properties.getString('profile_mobile_image');
		    }
		    else
		    {
		    	var profile_image = Ti.App.Properties.getString('profile_image');
		    } 
		    
		    var base64code = Ti.App.Properties.getString('base64image');
			if(base64code == '' || base64code == null || submitFlag != 'Upload Photo')
			{
				base64code = '-1';
				profile_image = Ti.App.Properties.getString('profileImageName');
			}
		    
		    var profileName = Ti.App.Properties.getString('profile_name');
		    //console.log('profiel image  '+profile_image);
		    var params = { UserId : userid, FirstName : fname.value, Surname : lname.value, DateOfBirth : dob_value, Location : location.value, JobTitle : jobTitle.value, Company : company.value, Gender : gender_value, PostalOrZipCode : postCode.value, CountryID : country_id, Email : email.value, OldPassword : oldpswrd.value, NewPassword : pswrd.value, ConfirmPassword : confirmPswrd.value, ProfileImage : profile_image, ProfileImageBase64Content: base64code };
		    
		    //console.log(params);
		 	var widgets = JSON.stringify(params);
		 	
		 	console.log(serverURL);
		 	console.log('................Parameters.............................');
		 	console.log(widgets);
		 	xhr.send(widgets);
		 	
		 	xhr.onload = function(){
		     
		     		var parsed_data = JSON.parse(this.responseText);	
	        	    console.log(this.responseText);
	        	   
	        	    actInd.hide();
		         	if(parsed_data.status == 'Success')
		        	{
		        		var profileImageName = parsed_data.UpdatedUserImagePath;
		        		var profileSmallImageNamePath = parsed_data.UpdatedSmallThumbImagePath;
		        		var profileLargeImageNamePath = parsed_data.UpdatedUserImagePath;
						if(profileImageName != '' && profileImageName != '-1')
		        		{
							Ti.App.Properties.setString('profileSmallImage',profileSmallImageNamePath);
			        		Ti.App.Properties.setString('profileLargeImage',profileLargeImageNamePath);
			        	}
		        		
		        		errorMessage.color = '#98bf1a';
		        		errorMessage.text = parsed_data.Message;
		        		
		        		if(submitFlag == 'Upload Photo')
		        		{
		        			uploadButtonImage.title = 'Add Photo';
		        		}
		      		}
		        	else
		        	{
		        		errorMessage.color = 'r';
		        		errorMessage.text = parsed_data.Message;
					}
					
					errorMessage.show();
		     }
		 
		    xhr.onerror = function(e){console.log(e.source); 
		    	
		    	actInd.hide(); 
		    	alert('Transmission error: ' + e.error);
		    	};
			}
	}

	submitBtn.addEventListener('click',function(){
		actInd.message = 'Saving Settings..';
		saveData('');
	});

