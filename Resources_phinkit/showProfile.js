var moreFlag = 0;
var showProfileWindowObj = Ti.UI.currentWindow;

showProfileWindowObj.setBackgroundImage('bg.png');

/******Header View Start********/

var title = 'Profile';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');

/*
setTimeout(function(){
	var headerModule = require('header').addHeader;
	var headerView = new headerModule('Profile');
	
	showProfileWindowObj.add(headerView);
},1000);

*/

showProfileWindowObj.addEventListener('focus',function(){
	if(notificationView != '' && notiFlag == 1)
		{
			showProfileWindowObj.remove(notificationView);	
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

showProfileWindowObj.add(actInd);

var profileTable = Ti.UI.createTableView({
	top : '23%',
	height : 'auto',
	backgroundColor : 'transparent',
	separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
});

var backButton = Ti.UI.createButton({
    backgroundImage: 'green_bg.png',
    title:'Back',
    height: 28,
    width: 51,
    top:'15%',
    left:'3%',
});

showProfileWindowObj.add(backButton);

backButton.addEventListener('click',function(e){
	Ti.UI.currentWindow.close();
});


showProfileWindowObj.add(profileTable);

var inputRow = []

/******Content View Start *******/

	actInd.show();
	
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetUserEditProfileDetailsByUserId';
	var xhr = Titanium.Network.createHTTPClient();    
    
    xhr.open("POST", serverURL);
 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    
    var userid = showProfileWindowObj.user_id;
    var loginUserId = Ti.App.Properties.getString('userid');
    
    var params = { LoggedInUserId :loginUserId,RequestedUserId :userid };
 	var widgets = JSON.stringify(params);
 	console.log('Get User Profile' + serverURL);
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
        		var userProfileImageRow = Ti.UI.createTableViewRow({
					backgroundColor : 'transparent',
					height : 240,
				});
				
				if(parsed_data.ProfileImage != '' && parsed_data.ProfileImage != '-1')
				{
					var userProfileImage = Ti.UI.createImageView({
						top:4,
						width : 200,
						height : 200,
						image : encodeURI(parsed_data.ProfileImage),
						borderColor:'#fff',
						borderRadius:8,
						borderWidth:3
					});
					
					userProfileImageRow.add(userProfileImage)
				}
								
				inputRow.push(userProfileImageRow);
				
				var profileDetailScrollView = Ti.UI.createTableViewRow({
					top : 0,
					left : '1%',
					width : 317,
					height : 480,
					backgroundImage : 'contentarea.png',
				});
				
				inputRow.push(profileDetailScrollView);
				
				var tableViewRow = Ti.UI.createTableView({
					top : '5%',
					backgroundColor : 'transparent',
					scrollable : false,
					separatorStyle : Ti.UI.iPhone.TableViewSeparatorStyle.NONE
				});
				
				profileDetailScrollView.add(tableViewRow);
				
				var profileData = [];
				
				if(parsed_data.FirstName != '-1')
        		{
        			var fnameRow = Ti.UI.createTableViewRow({
						width : '317',
						height : '50',
						backgroundColor : 'transparent',
					});
					
					var fnameLabel = Ti.UI.createLabel({
						text : 'Name :',
						top : '0%',
						left : '10%',
						color : '#fff',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					var fname = Ti.UI.createLabel({
						text : parsed_data.FirstName +' ' + parsed_data.Surname,
						top : '0%',
						color : '#fff',
						left : '39%',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					fnameRow.add(fnameLabel);
					fnameRow.add(fname);
					
					profileData.push(fnameRow);
        		}
        		
        		if(parsed_data.Surname != '-1')
        		{
        			var lnameRow = Ti.UI.createTableViewRow({
						width : '317',
						height : '50',
						backgroundColor : 'transparent',
					});
					
					var lnameLabel = Ti.UI.createLabel({
						text : 'Last Name :',
						top : '0%',
						left : '10%',
						color : '#fff',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					var lname = Ti.UI.createLabel({
						text : parsed_data.Surname,
						top : '0%',
						color : '#fff',
						left : '39%',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					lnameRow.add(lnameLabel);
					lnameRow.add(lname);
					
					//profileData.push(lnameRow);
        		}
        		
        		if(parsed_data.Email != '-1')
        		{
        			var emailRow = Ti.UI.createTableViewRow({
						width : '317',
						height : '50',
						backgroundColor : 'transparent',
					});
					
					var emailLabel = Ti.UI.createLabel({
						text : 'Email :',
						top : '0%',
						left : '10%',
						color : '#fff',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					var email1 = Ti.UI.createLabel({
						text : parsed_data.Email,
						top : '0%',
						color : '#fff',
						left : '39%',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					emailRow.add(emailLabel);
					emailRow.add(email1);
					
					//profileData.push(emailRow);
        		}
        		
        		if(parsed_data.DateOfBirth != '-1')
        		{
        			var dateStr = parsed_data.DateOfBirth;
				    var dateStrLength = dateStr.length-2;
				    var dateObj = new Date(parseInt(dateStr.substring(6,dateStrLength)));
				    var dob_value = (dateObj.getMonth() + 1) + '/' + dateObj.getDate() +'/'+ dateObj.getFullYear();
					
					var dobRow = Ti.UI.createTableViewRow({
						width : '317',
						height : '50',
						backgroundColor : 'transparent',
					});
					
					var dobLabel = Ti.UI.createLabel({
						text : 'Date of Birth :',
						top : '0%',
						left : '10%',
						color : '#fff',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					var dob = Ti.UI.createLabel({
						text : dob_value,
						top : '0%',
						color : '#fff',
						left : '39%',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					dobRow.add(dobLabel);
					dobRow.add(dob);
					
					//profileData.push(dobRow);
        		}

				if( parsed_data.PostalOrZipCode != "" && parsed_data.PostalOrZipCode != '-1')
        		{
        			var postCodeRow = Ti.UI.createTableViewRow({
						width : '317',
						height : '50',
						backgroundColor : 'transparent',
					});
					
					var postCodeLabel = Ti.UI.createLabel({
						text : 'Post Code :',
						top : '0%',
						left : '10%',
						color : '#fff',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					var postCode = Ti.UI.createLabel({
						text : parsed_data.PostalOrZipCode,
						top : '0%',
						color : '#fff',
						left : '39%',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					postCodeRow.add(postCodeLabel);
					postCodeRow.add(postCode);
					
					//profileData.push(postCodeRow);
        		}
        		
        		if(parsed_data.Location != '-1')
        		{
        			var locationRow = Ti.UI.createTableViewRow({
						width : '317',
						height : '50',
						backgroundColor : 'transparent',
					});
					
					var locationLabel = Ti.UI.createLabel({
						text : 'Location :',
						top : '0%',
						left : '10%',
						color : '#fff',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					var location = Ti.UI.createLabel({
						text : parsed_data.Location,
						top : '0%',
						color : '#fff',
						left : '39%',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					locationRow.add(locationLabel);
					locationRow.add(location);
					
					profileData.push(locationRow);
        		}
        		
        		if(parsed_data.CountryID != '-1')
        		{
        			var countryRow = Ti.UI.createTableViewRow({
						width : 317,
						height : 50,
						backgroundColor : 'transparent',
					});
					
					var countryLabel = Ti.UI.createLabel({
						text : 'Country :',
						top : '0%',
						left : '10%',
						color : '#fff',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					var country = Ti.UI.createLabel({
						text : parsed_data.Country,
						top : '0%',
						color : '#fff',
						left : '39%',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					countryRow.add(countryLabel);
					countryRow.add(country);
					
					profileData.push(countryRow);
        		}
        		if(parsed_data.JobTitle != '-1')
        		{
        			var jobTitleRow = Ti.UI.createTableViewRow({
						width : 317,
						height : 50,
						backgroundColor : 'transparent',
					});
					
					var jobTitleLabel = Ti.UI.createLabel({
						text : 'Job :',
						top : '0%',
						left : '10%',
						color : '#fff',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					var jobTitle = Ti.UI.createLabel({
						text : parsed_data.JobTitle,
						top : '0%',
						color : '#fff',
						left : '39%',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					jobTitleRow.add(jobTitleLabel);
					jobTitleRow.add(jobTitle);
					
					profileData.push(jobTitleRow);
        		}
        		if(parsed_data.Company != '-1')
        		{
        			var companyRow = Ti.UI.createTableViewRow({
						width : 317,
						height : 50,
						backgroundColor : 'transparent',
					});
					
					var companyLabel = Ti.UI.createLabel({
						text : 'Company :',
						top : '0%',
						left : '10%',
						color : '#fff',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					var companyTitle = Ti.UI.createLabel({
						text : parsed_data.Company,
						top : '0%',
						color : '#fff',
						left : '39%',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					companyRow.add(companyLabel);
					companyRow.add(companyTitle);
					
					profileData.push(companyRow);
        		}
        		
        		if(parsed_data.MedalsAchieved != '-1')
        		{
        				var medalRow = Ti.UI.createTableViewRow({
							width : 317,
							height:80,
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
							height:80,
							top:0,
							//borderColor:'red'
						});
						
						medalRow.add(medalLabel);
						medalRow.add(medalView);
		
						profileData.push(medalRow);
        			
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
        			
        		if(parsed_data.Gender != '-1')
        		{
        			var genderRow = Ti.UI.createTableViewRow({
						width : 317,
						height : 50,
						backgroundColor : 'transparent',
					});
					
					var genderLabel = Ti.UI.createLabel({
						text : 'Gender  :',
						top : '0%',
						left : '10%',
						color : '#fff',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					var genderTitle = Ti.UI.createLabel({
						text : parsed_data.Gender,
						top : '0%',
						color : '#fff',
						left : '39%',
						font:{fontSize:16,fontName : 'Helvetica'},
					});
					
					genderRow.add(genderLabel);
					genderRow.add(genderTitle);
					
					//profileData.push(genderRow);
        		}
        		if(parsed_data.ConnectionStatus != '' &&  parsed_data.ConnectionStatus != null)
        		{
        			var buttonRow = Ti.UI.createTableViewRow({
						width : 317,
						height : 80,
						backgroundColor : 'transparent',
					});
					
        			var connectionButton = Ti.UI.createButton({
						textAlign : 'center',
						backgroundImage : 'Send-Connection-Request.png',
						title:parsed_data.ConnectionStatus,
						top : '25%',
						width:230,
						height:30,
						font:{fontFamily:'Helvetica Neue', fontSize:16, fontWeight:'bold'},
					});
					
					connectionButton.addEventListener('click',function(e){
						
						if(e.source.title == 'CONNECTED')
						{
							alert('You are already Connected');
							return false;
						}
						else if(e.source.title == 'PENDING')
						{
							alert('Your connection request is pending');
							return false;
						}
								
						var popUpWindow = Ti.UI.createWindow({
							url : 'sendConnectionRequest.js',
							navBarHidden : true,
						});
						
						popUpWindow.to_user_id = userid;
						popUpWindow.user_name = parsed_data.FirstName +' ' + parsed_data.Surname;
						
						popUpWindow.open();
						
						popUpWindow.addEventListener('close',function(event){
							console.log(event.source);
							console.log(event.source.completed);
							searchlabel.fireEvent('click');
						});
					});
					
					
					buttonRow.add(connectionButton);
					profileData.push(buttonRow);
        		}
        		
        		

        		profileTable.setData(inputRow);

				tableViewRow.setData(profileData);
				
				//profileDetailScrollView.add(profileTable);
				
        	}
        	actInd.hide();
        }
      }
    };
    
    xhr.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);};
    actInd.hide();    		
