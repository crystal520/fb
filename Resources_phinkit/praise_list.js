var currentWindow = Ti.UI.currentWindow;

var memexId = currentWindow.memexid;

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

actInd.hide();

currentWindow.add(actInd);

var delete_image = Ti.UI.createImageView({
	top : 90,
	image : 'delet.png',
	right : 9,
	zIndex:9999
}); 

var scrollView = Ti.UI.createScrollView({
	 width:'auto',
 	 height:'auto',
   	 contentHeight:'auto',
     contentWidth:'auto'
});

var tableView = Ti.UI.createTableView({
	height : 250,
	width:300,
	backgroundColor:'#2D2E32',
	separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
})

currentWindow.add(tableView);

var row = Ti.UI.createTableViewRow({
	height : 100,
	width : 323,
	backgroundColor : 'red'	
});

tableView.add(row);

//popUpView.add(scrollView1);

// Listen for click events.
delete_image.addEventListener('click', function() {
	currentWindow.close();
});

	var userid = Ti.App.Properties.getString('userid');

	var serverURL = Ti.App.Properties.getString('baseurl') + 'GetWhosGivenPraiseUserList';
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open("POST", serverURL);
	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	var params = {
		"UserId" : userid,
		"BlogticleID" : memexId,
		"BumpClampType" : "Bump"
	};

	var cwidgets = JSON.stringify(params);
	console.log(cwidgets);

	console.log('Whos given prais url=  ' + serverURL);
	xhr.send(cwidgets);

	xhr.onload = function() {
		console.log(this.responseText);
		var parsed_data = JSON.parse(this.responseText);

		if (parsed_data != null && parsed_data != '') {
			if (parsed_data.Status == 'Success') 
			{
				var dataArr = parsed_data.TypeWhosGivenPraiseList;
				//alert(dataArr.length);
				
				for(var i=0;i<dataArr.length;i++)
				{
					var row = Ti.UI.createTableViewRow({
						backgroundColor : 'transparent',
						selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
					});
				
					var popUpView = Ti.UI.createView({
						backgroundImage : 'pop-up-bg.png',
						width : 300,
						height : 250,
						//borderRadius : 5,
						//borderColor :'black',
						//borderWidth : 3,
					});
					
					var title_text = Ti.UI.createLabel({
						text : 'Who\'s Clapped, Fist Bumped & High Fived?',
						top : '10%',
						color : '#fff',
						font : {fontSize:13,fontWeight:'normal'}
					});
					
					var textarea_image = Ti.UI.createImageView({
					  image:'text-bg.png',
					  width:270,
					  top:'20%'
					});
					
					var user_image = Ti.UI.createImageView({
					  image:dataArr[i].ProfileImage,
					  width:45,
					  height:45,
					  top:'5%',
					  left:'3%',
					  borderColor:'white',
					  borderRadius:3,
					});
					
					var username = Ti.UI.createLabel({
						text : dataArr[i].FirstName +' ' +dataArr[i].Surname,
						top : '3%',
						left: '23%',
						color : '#98bf1a',
						font : {fontSize:14,fontWeight:'normal'}
					});
					 
					var description = '';
					
					if(dataArr[i].JobTitle != -1 && dataArr[i].JobTitle != "-1")
					{
						var job_title = dataArr[i].JobTitle;
						//alert(job_title.length);
						if(job_title.length > 16)
						{
							job_title = job_title.substring(0,14) + '..';
						}
						//alert(job_title);
						description += job_title;
					}
					if(dataArr[i].Company != -1 && dataArr[i].Company != "-1")
					{
						description += ', ' + dataArr[i].Company;
					}
					if(dataArr[i].Location != -1 && dataArr[i].Location != "-1")
					{
						description +=dataArr[i].Location + ', ' ;
					}
					else
					{
						//description += ' \n';
					}
					if(dataArr[i].Country != -1 && dataArr[i].Location != "-1")
					{
						description += dataArr[i].Country;
					}
					 
					var user_description = Ti.UI.createLabel({
						text : description,
						top : '26%',
						left: '23%',
						color : '#fff',
						width:200,
						//borderColor:'white',
						font : {fontSize:13,fontWeight:'normal'}
					});
					
					//Country Company JobTitle Location
					var connection_image_url = 'Send-Connection-Request.png';
					
					if(dataArr[i].ConnectStatus == 'Connected')
					{
						connection_image_url = 'Send-Connection-Request.png';
						connection_image_title = 'Connected';
					}
					else if(dataArr[i].ConnectStatus == 'Send Connection Request')
					{
						connection_image_title = 'Send Connection Request';
					}
					else if(dataArr[i].ConnectStatus != "Its you!")
					{
						connection_image_title = 'Pending';
					}
					else
					{
						connection_image_title = '';
						connection_image_url = '';
					}
					
					var connection_image = Titanium.UI.createButton({
						title: connection_image_title,
					  	backgroundImage:connection_image_url,
					  	width:170,
					  	height:30,
					  	bottom:'10%',
					  	font:{fontSize:13}
					});
					
					textarea_image.add(user_image);
					textarea_image.add(username);
					textarea_image.add(user_description);
					textarea_image.add(connection_image);
					
					popUpView.add(title_text);
					popUpView.add(textarea_image);
					
					currentWindow.add(delete_image);
					
					var ClappedLabel = Ti.UI.createLabel({
						bottom : '30%',
						text : 'Clapped',
						left : '8%',
						color : '#98bf1a',
						font : {fontSize:13,fontWeight:'bold'}
					});
					
					var divider1 = Ti.UI.createImageView({
					  image:'whose_given_prs_div.png',
					  bottom:'6%',
					  left:'33%',
					  height:78
					});
					
					var divider2 = Ti.UI.createImageView({
					  image:'whose_given_prs_div.png',
					  bottom:'6%',
					  right:'35%',
					  height:78
					});
					popUpView.add(divider2);
					
					popUpView.add(ClappedLabel);
					popUpView.add(divider1);
					
					var BumpedLabel = Ti.UI.createLabel({
						bottom : '30%',
						text : 'Bumped',
						textAlign:'center',
						color : '#98bf1a',
						font : {fontSize:13,fontWeight:'bold'}
					});
					
					popUpView.add(BumpedLabel);
					
					var HighFivedLabel = Ti.UI.createLabel({
						bottom : '30%',
						text : 'High Fived',
						right : '8%',
						color : '#98bf1a',
						font : {fontSize:13,fontWeight:'bold'}
					});
					
					popUpView.add(HighFivedLabel);
					
					var clap_image = Ti.UI.createImageView({
					  image:'clap_praise.png',
					  bottom:'12%',
					  left:'8%',
					  height:40,
					  widht:40
					 });
					
					var bumped_image = Ti.UI.createImageView({
					  image:'bumped_praise.png',
					  bottom:'12%',
					  textAlign:'center',
					  height:40,
					  widht:40
					});
					
					var high_five_image = Ti.UI.createImageView({
					  image:'high_five_praise.png',
					  bottom:'12%',
					  right:'8%',
					  height:40,
					  widht:40
					});
					
					if(dataArr[i].ClapCount != false)
					{
						popUpView.add(clap_image);
					}
					if(dataArr[i].BumpCount != false)
					{
						popUpView.add(bumped_image);
					}
					if(dataArr[i].HighFiveCount != false)
					{
						popUpView.add(high_five_image);
					}
					
					row.add(popUpView);
					
					tableView.appendRow(row);
				}
			} 
			else 
			{
				alert('No one is given Praise');
				currentWindow.close();
			}
		} else 
		{
			alert('Some error Occure with webservice');
		}
	}

	xhr.onerror = function() 
	{
		alert('error comes');
	}
	
