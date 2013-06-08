var profileWindowObj = Ti.UI.currentWindow;

profileWindowObj.setBackgroundImage('bg.png');
profileWindowObj.exitOnClose = true;

var firstName = profileWindowObj.fb_fname;
var lastName = profileWindowObj.fb_lname;
var emailAddress = profileWindowObj.fb_email;

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

var pftext = Ti.UI.createLabel({
	top : '0%',
	height : 34,
	width : 261,
	backgroundImage:'transparent',
	text : "Profile Join Form ",
	font:{fontSize:16,fontWight:'bold'},
	textAlign : 'center',
	color : '#fff',
});
profileWindowObj.add(pftext);

var profileTable = Ti.UI.createTableView({
	top : '8%',
	height : 'auto',
	backgroundColor : 'transparent',
	separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
});

var inputRow = []

var profileDetailScrollView = Ti.UI.createTableViewRow({
	top : '5%',
	left : '1%',
	width : 317,
	height : 'auto',
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
var fname = '';
if(firstName != '')
{
	fname = Ti.UI.createLabel({
		top : '0%',
		height : 34,
		width : 261,
		borderRadius : 5,
		backgroundImage:'logininputbg.png',
		text : firstName,
		font:{fontSize:12},
		paddingLeft : 20,
		color : '#fff',
	});
}
else
{
	fname = Ti.UI.createTextField({
		top : '0%',
		height : 34,
		width : 261,
		borderRadius : 5,
		backgroundImage:'logininputbg.png',
		hintText : 'First Name',
		font:{fontSize:12},
		paddingLeft : 10,
		color : '#fff',
	});
}

fnameRow.add(fname);

profileData.push(fnameRow);


var lnameRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
});

var lname = '';
if(lastName != '')
{
	lname = Ti.UI.createLabel({
		top : '0%',
		height : 34,
		width : 261,
		borderRadius : 5,
		backgroundImage:'logininputbg.png',
		text : lastName,
		font:{fontSize:12},
		paddingLeft : 20,
		color : '#fff',
	});
}
else
{
	lname = Ti.UI.createTextField({
		top : '0%',
		height : 34,
		width : 261,
		borderRadius : 5,
		backgroundImage:'logininputbg.png',
		hintText : 'Last Name',
		font:{fontSize:12},
		paddingLeft : 10,
		color : '#fff',
	});
}

lnameRow.add(lname);

profileData.push(lnameRow);

var emailRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
});

var email = '';
if(emailAddress != '')
{
	email = Ti.UI.createLabel({
		top : '0%',
		height : 34,
		width : 261,
		borderRadius : 5,
		backgroundImage:'logininputbg.png',
		text : emailAddress,
		font:{fontSize:12},
		paddingLeft : 20,
		color : '#fff',
	});
}
else
{
	email = Ti.UI.createTextField({
		top : '0%',
		height : 34,
		width : 261,
		borderRadius : 5,
		backgroundImage:'logininputbg.png',
		hintText : 'Email',
		font:{fontSize:12},
		paddingLeft : 10,
		color : '#fff',
	});
}


emailRow.add(email)

profileData.push(emailRow);

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
	font:{fontSize:12},
	paddingLeft : 10,
	color : '#fff',
});

passwordRow.add(pswrd)

profileData.push(passwordRow);

/****start picker handling ******/
var picker = Ti.UI.createPicker({
	bottom :-320 ,
    zIndex :1,
    selectionIndicator :true
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
if(data.length>0)
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

donebtn.addEventListener('click',function(){
     picker.animate({bottom:-270, duration: 500});
     toolbar_pick.animate({bottom:-50, duration: 500});
});
/****end picker handling ******/

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
	font:{fontSize:12},
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
	font:{fontSize:12},
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


/*
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
	font:{fontSize:12},
	paddingLeft : 10,
	color : '#fff',
});

jobTitleRow.add(jobTitle);

profileData.push(jobTitleRow);

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
	font:{fontSize:12},
	paddingLeft : 10,
	color : '#fff',
});

companyRow.add(company);

profileData.push(companyRow);
*/

var checkboxTCRow = Ti.UI.createTableViewRow({
	width : 317,
	height : 20,
	backgroundColor : 'transparent',
	selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
});

var checkboxTC = Ti.UI.createImageView({
    left : '10%',
	top : '25%',
    width: 'auto',
    height: 'auto',
    image: 'checkbox.png',
    value: false //value is a custom property in this casehere.
});
 
var lineTC = Ti.UI.createLabel({
	top : '0%',
	height : 34,
	width : 261,
	left : '18%',
	backgroundImage:'transparent',
	text : 'To register on Phinkit you must agree to this Terms and Conditions',
	font:{fontSize:12},
	paddingLeft : 20,
	color : '#98bf1a',
});
//Attach some simple on/off actions
checkboxTC.on = function() {
    this.image = 'checkbox_selected.png';
    this.value = true;
};

checkboxTC.off = function() {
    this.image = 'checkbox.png';
    this.value = false;
};
 
checkboxTC.addEventListener('click', function(e) {
    if(e.source.value == false) {
        e.source.on();
    } else {
        e.source.off();
    }
});
checkboxTCRow.add(lineTC);
checkboxTCRow.add(checkboxTC);
profileData.push(checkboxTCRow);

var errorMessageRow = Ti.UI.createTableViewRow({
	width : 317,
	height : 20,
	backgroundColor : 'transparent',
});

var errorMessage = Ti.UI.createLabel({
	top : '30%',
	left : '10%',
	height : 'auto',
	width : 'auto',
	font:{fontSize:12},
	color : 'red',
	text : 'Please fill details',
	backgroundColor : 'transparent'
});

errorMessageRow.add(errorMessage)

errorMessage.hide();

profileData.push(errorMessageRow);


var submitRow = Ti.UI.createTableViewRow({
	width : '317',
	height : '50',
	backgroundColor : 'transparent',
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

//saving profile data on server
submitBtn.addEventListener('click',function(){
	Ti.API.info('Submit button clicked');
	errorMessage.hide();
	
	var isValidate = false;
	var error_message = '';
	
	if( location.value == '')
	{
		error_message = 'Please fill location';
	}
	else if( countryList.value == '')
	{
		error_message = 'Please select Country';
	}
	else if(!checkboxTC.value)
	{
		error_message = 'Please accept the Terms and Conditions';
	}
	else
	{
		isValidate = true;
	}
	
	if(isValidate)
	{
		actInd.show();
	
		/*console.log('fname.value '+fname.value+' lname.value'+lname.value+' email '+email.value+'  old password '+oldpswrd.value+' new password '+pswrd.value+'  confirm password '+confirmPswrd.value+' dob '+dob.value);
		console.log(' postal code' + postCode.value+' location '+location.value+' countryList.value '+countryList.value+' jobtitle : '+jobTitle.value+' company name:'+company.value+' gender male'+tickMale.value);
		console.log(' female'+tickFemale.value);
		console.log(Ti.App.Properties.getString('country_id'));*/
		
		var serverURL = Ti.App.Properties.getString('baseurl')+'SaveProfileJoinForFB';
		var xhr = Titanium.Network.createHTTPClient();    
	    
	    xhr.open("POST", serverURL);
	 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
	    
	    var userid = Ti.App.Properties.getString('userid');
	    
	    if(firstName == '')
	    {
	    	firstName = fname.value;
	    }
	    
	    if(lastName == '')
	    {
	    	lastName = lname.value;
	    }
	    
	    if(emailAddress == '')
	    {
	    	emailAddress = email.value;
	    }
	    
	    var country_id = Ti.App.Properties.getString('country_id');
	    
	    var params = { UserId : userid, FirstName : firstName, LastName : lastName, FB_Email : emailAddress, Location : location.value,  CountryID : country_id, chkTermsAndConditions : true, Password : pswrd.value, JobTitle : "", Company : "" };
	     
	 	var widgets = JSON.stringify(params);
	 	console.log(widgets);
	 	xhr.send(widgets);
	 	
	 	xhr.onload = function(){
	     
	     if(this.status == '200'){
	       
	        console.log(this.responseText);
	        
	        if(this.readyState == 4){
	        	var parsed_data = JSON.parse(this.responseText);
	        	errorMessage.text = parsed_data.Message;
	        	if(parsed_data.Status == 'Success')
	        	{
	        		errorMessage.text = parsed_data.Message;
	        		profileWindowObj.close();
				}
	        	else
	        	{
	        		errorMessage.text = parsed_data.Message;
				}
				//Profile couldn\'t updated due to errors.
	        	errorMessage.show();
	        	actInd.hide();  
	        }
	        else
	        {
	          alert('HTTP Ready State != 4');
	          actInd.hide();  
	        }
	                
	     }else{
	        alert('Transmission failed. Try again later. ' + this.status + " " + this.response);
	         actInd.hide();  
	     }              
	    };
	 
	    xhr.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);};
	}
	else
	{
		errorMessage.text = error_message;
		errorMessage.show();		
	}
	
	
});
