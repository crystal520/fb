var moreFlag = 0;
var groupChatWindowObj = Ti.UI.currentWindow;

groupChatWindowObj.setBackgroundImage('bg.png');

/******Header View Start********/

Ti.App.Properties.setString('selected_member_list','');

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

groupChatWindowObj.add(actInd);

var title = 'New Phink Tank';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');

groupChatWindowObj.addEventListener('focus',function(){
	if(notificationView != '' && notiFlag == 1)
	{
		groupChatWindowObj.remove(notificationView);	
		notiFlag = 0;
	}
	getLatestNotifications();
});

/*
setTimeout(function(){
	//actInd.hide();
	//alert('loading header in chat');
	var headerModule = require('header').addHeader;
	var headerView = new headerModule('New Phink Tank');
	                                                                                                                                                                                                                                                                                                                                                                                                                                           
	groupChatWindowObj.add(headerView);
},1000);
*/

/******Header View End********/
/*
var newGroupView = Ti.UI.createScrollView({
	 width:'auto',
 	 height:'auto',
   	 contentHeight:200,
     contentWidth:'auto'
});
*/

var table = Ti.UI.createTableView({
	top : 55,
	backgroundColor: 'transparent',
  	width:320,
  	separatorStyle : Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
  	scrollable : false
});

groupChatWindowObj.add(table);

var inputData = [];

var nameView = Ti.UI.createTableViewRow({
	height : 80
});

var groupNameLabel = Ti.UI.createLabel({
	text : 'GROUP NAME',
	height : 'auto',
	width : 'auto',
	top : '10%',
	left : '10%',
	font:{fontSize:12},
	color : '#fff'
});

nameView.add(groupNameLabel);

var groupNameField = Ti.UI.createTextField({
	height : 34,
	width : 261,
	top : '50%',
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	hintText : 'text..',
	font:{fontSize:12},
	paddingLeft : 10,
	color : '#fff',
});

nameView.add(groupNameField);

inputData.push(nameView);


var imageView = Ti.UI.createTableViewRow({
	height : 'auto'
});

var groupImageLabel = Ti.UI.createLabel({
	text : 'GROUP IMAGE',
	height : 'auto',
	width : 'auto',
	top : 10,
	left : '10%',
	font:{fontSize:12},
	color : '#fff'
});

imageView.add(groupImageLabel);

var addGroupImageButton = Ti.UI.createButton({
	title : '+',
	top : 10,
	right : '10%',
	height : 20,
	width : 20,
	font:{fontSize:16,fontWeight:'bold'},
});

imageView.add(addGroupImageButton);

var groupImageField = Ti.UI.createImageView({
	image : 'bigpic.png',
	width : 250,
	height : 140,
	top : 30,
});

imageView.add(groupImageField);

inputData.push(imageView);

var memberView = Ti.UI.createTableViewRow({
	height : 'auto'
});

var memberNameLabel = Ti.UI.createLabel({
	text : 'GROUP MEMBER',
	height : 'auto',
	width : 'auto',
	top : 10,
	left : '10%',
	font:{fontSize:12},
	color : '#fff'
});

memberView.add(memberNameLabel);

var groupMembersField = Ti.UI.createLabel({
	height : 34,
	width : 261,
	top : 30,
	borderRadius : 5,
	backgroundImage:'logininputbg.png',
	font:{fontSize:12},
	paddingLeft : 10,
	left : '10%',
	color : '#fff',
	text : 'selected memebers'
});

memberView.add(groupMembersField);

var addGroupMemberButton = Ti.UI.createButton({
	title : '+',
	top : 38,
	right : '10%',
	height : 20,
	width : 20,
	font:{fontSize:16,fontWeight:'bold'},
});

memberView.add(addGroupMemberButton);

inputData.push(memberView);

var createView = Ti.UI.createTableViewRow({
	height : 'auto'
});

var createGroupButton = Ti.UI.createButton({
	top : 10,
	title : 'Create Group',
	height : 26,
	width : 120,
	font:{fontSize:14,fontWeight:'bold'},
	backgroundImage : 'green_bg.png',
	borderRadius : 5
});

createView.add(createGroupButton);

inputData.push(createView);

table.setData(inputData);

groupChatWindowObj.addEventListener('click',function(){
	groupNameField.blur();
});
/*
groupChatWindowObj.addEventListener('return',function(){
	newGroupView.scrollTo(0, 0);
});
*/
addGroupMemberButton.addEventListener('click', function()
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
	
	w.add(actInd);

	var tableView = Titanium.UI.createTableView({
		top : 10,
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
	    backgroundColor : 'transparent',
	    left : '5%',
	    height : 320
	});
	
	w.add(tableView);
	
	tableView.addEventListener('click', function(e) {
		
		//connected_user_id
		console.log(e.row.connected_user_id);
		
		if(e.row.connected_user_id != '0')
		{
			var d = e.row.children[0];
		    if (d.isChecked == false) {
		        d.image = 'checkbox_selected.png';
		        d.isChecked = true;
		    } else {
		        d.image = 'checkbox.png';
		        d.isChecked = false;
		    }
		    
		    var mainR = tableView.data[0].rows[0].children[0];
		    mainR.image = 'checkbox.png';
		    mainR.isChecked = false;
		}
		else
		{
			var countRows = tableView.data[0].rows.length;
			var mainR = e.row.children[0];
			
			var replaceImage = '';
			var checkValue = '';
			
			if (mainR.isChecked == false) {
		        replaceImage = 'checkbox_selected.png';
		        checkValue = true;
		    } else {
		        replaceImage = 'checkbox.png';
		        checkValue = false;
		    }
			
			if(countRows > 0)
			{
				for(var i=1;i<countRows;i++)
				{
					var row = tableView.data[0].rows[i];
					
					var d = row.children[0];
					
				    d.image = replaceImage;
				    d.isChecked = checkValue;
				}
				
				if (mainR.isChecked == false) {
			        mainR.image = 'checkbox_selected.png';
			        mainR.isChecked = true;
			    } else {
			        mainR.image = 'checkbox.png';
			        mainR.isChecked = false;
			    }
			}
		}
	});
	
	w.addEventListener('focus',function(){
		actInd.show();
		var serverURL = Ti.App.Properties.getString('baseurl')+'GetConnectionsListByUserId';
		var xhr = Titanium.Network.createHTTPClient();    
	    
	    console.log(serverURL);
	    xhr.open("POST", serverURL);
	    xhr.setTimeout(99000);
	 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
	    
	    var userid = Ti.App.Properties.getString('userid');
	    var params = { UserId : userid };
	 	var widgets = JSON.stringify(params);
	 	
	 	console.log(widgets);
	 	xhr.send(widgets);
	   
	    xhr.onload = function(){
	     //alert("responseText: " + this.responseText);
	     if(this.status == '200'){
	        
	        console.log(this.responseText);
	        
	        if(this.readyState == 4){
	        	
	        	var parsed_data = JSON.parse(this.responseText);
	        	var index = [];
				var rows = [];   
	        	
	        	if(parsed_data[0].status == 'Success')
	        	{
	        		var conn_result_list = parsed_data[0].ConnectionsList;
	        		var model = [];
	        		for(var i = 0, l = conn_result_list.length; i < l;i++)
	        		{
	        			console.log(conn_result_list[i].UserName);
	        			var user_detail = '';
	        			
	        			if(conn_result_list[i].JobTitle != '-1')
	        			{
	        				user_detail += conn_result_list[i].JobTitle+', ';
	        			}
	        			if(conn_result_list[i].Company != '-1')
	        			{
	        				user_detail += conn_result_list[i].Company+', ';
	        			}
	        			if(conn_result_list[i].Location != '-1')
	        			{
	        				user_detail += conn_result_list[i].Location;
	        			}
	        			        			
	        			model.push({  Title : conn_result_list[i].FirstName+' '+conn_result_list[i].Surname, userDetail : user_detail, user_image : encodeURI(conn_result_list[i].ProfileImage), connectedUserId : conn_result_list[i].ConnectedUserId  });
	        		}
	        		console.log(model);
	        		
					
					var curheader = '0';
					
					var alphaRowCount = 0;
					var rowIndexArray = [];
					var rowcount = 0;
					var jobtitle = '';
					
					if( model.length > 0)
					{
						var row = Ti.UI.createTableViewRow({
							width : 200,
							height : 'auto',
							left : '5%'
						});
						
						var selectAll = Ti.UI.createImageView({
							left : '1%',
					        width: 'auto',
						    height: 'auto',
						    image: 'checkbox.png',
					        isChecked : false
					    });
					 	
					 	row.connected_user_id = 0;
					    /*
					    selectAll.addEventListener('click', function(e) {
					        if (e.source.isChecked == false) {
					            e.source.image = 'checkbox_selected.png';
					            e.source.isChecked = true;
					        } else {
					            e.source.image = 'checkbox.png';
					            e.source.isChecked = false;
					        }
					    });
					   	*/		    
					    row.add(selectAll);
					    
						var selectAllText = Ti.UI.createLabel({
							text : 'Select All',
							color : '#98bf1a',
							top : '2%',
							left : '7%',
							font : {fontSize:14,fontWeight:'bold'}
						});	
						
						row.add(selectAllText);
						rows.push( row );
					}
					
					// loop through model to add rows to table
					for (var i = 0, l = model.length; i < l; i++) 
					{
						var row = Ti.UI.createTableViewRow({
							width : 200,
							height : '75',
							left : '10%'
						});
						
						row.connected_user_id = model[i].connectedUserId;
						row.username = model[i].Title;
						
						var star = Ti.UI.createImageView({
							left : '1%',
					        width: 'auto',
						    height: 'auto',
						    image: 'checkbox.png',
					        isChecked : false
					    });
					    
					    row.add(star);
					    
						if(model[i].user_image != '' && model[i].user_image != null)
						{
							var userImage = Ti.UI.createImageView({
								top : '15%',
								left : '7%',
								width : '20%',
								image : model[i].user_image,
							});
							
							row.add(userImage);
						}
						
						
						var userDerailView = Ti.UI.createView({
							top : '15%',
							left : '30%',
							width : '60%',
							height : '80%',
							
						});
						
						var userNameText = Ti.UI.createLabel({
							text : model[i].Title,
							color : '#98bf1a',
							top : '2%',
							left : '1%',
							font : {fontSize:13}
							
						});
						
						userDerailView.add(userNameText);
						
						if(model[i].userDetail != '')
						{
							var detailText1 = Ti.UI.createLabel({
								text : model[i].userDetail,
								color : '#fff',
								top : '28%',
								left : '1%',
								font : {fontSize:12},
								height : 'auto',
								wordWrap : true
							});
							
							userDerailView.add(detailText1);
						}
						
						row.add(userDerailView);
						
						rows.push( row );
						rowcount++;
					}
					tableView.setData(rows);
					actInd.hide();
					//table.setData(  rows );
					
	        	}	
	        	else
	        	{
	        		var row = Ti.UI.createTableViewRow({
						width : 'auto',
						height : 'auto',
					});
	        		var msg = Ti.UI.createLabel({
						text : 'No connections in list',
						color : '#fff',
						font : {fontSize:12},
						wordWrap : true
					});
					row.add(msg);
					tableView.setData(  row );
	
	        	}			
				actInd.hide();
	        }else{
	          alert('HTTP Ready State != 4');
	          actInd.hide();
	        }           
	     }else{
	        alert('Transmission failed. Try again later. ' + this.status + " " + this.response);
	        actInd.hide();
	     }              
	    };
	 
	    xhr.onerror = function(e){console.log(e.source); actInd.hide();alert('Transmission error: ' + e.error);};
	    
	    
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

	//arrowDirection:arrowDirection,
	// create a button to close window
	var d = Titanium.UI.createButton({
		title:'Done',
		bottom : '3%',
		left : '12%',
		height:30,
		width:100
	});
	w.add(d);
	
	d.addEventListener('click', function()
	{
		//alert('done clicked');
		var countRows = tableView.data[0].rows.length;
		var selectedMembers = '';
		if(countRows > 0)
		{
			for(var i=1;i<countRows;i++)
			{
				var row = tableView.data[0].rows[i];
				
				var d = row.children[0];
				var username = row.username;
				
			   	if(d.isChecked)
			   	{
			   		if(selectedMembers != '')
			   		{
			   			selectedMembers += ",";
			   		}
			   		selectedMembers += username;
			   	}
			    
			}
			Ti.App.Properties.setString('selected_member_list',selectedMembers);
			//groupMembersField.value = selectedMembers;
			groupMembersField.text = selectedMembers;
		}
		
		var t3 = Titanium.UI.create2DMatrix();
		t3 = t3.scale(0);
		w.close({transform:t3,duration:300});
	});

	// create a button to close window
	var b = Titanium.UI.createButton({
		title:'Close',
		bottom : '3%',
		right : '12%',
		height:30,
		width:100
	});
	w.add(b);
	
	b.addEventListener('click', function()
	{
		var t3 = Titanium.UI.create2DMatrix();
		t3 = t3.scale(0);
		w.close({transform:t3,duration:300});
	});

	w.open(a);


});
addGroupImageButton.addEventListener('click', function()
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
					groupImageField.image = event.media;
					/*var imageView = Ti.UI.createImageView({
						image:event.media
					});
					win.add(imageView);*/
					/*Ti.App.Properties.setString('profile_image','large.png');
					userProfileImage.image = event.media;
					//win.close();
					var imagebase64 = Ti.Utils.base64encode(event.media);
					//Ti.API.info('Base 64 code'); 
					//Ti.API.info(imagebase64);
					Ti.App.Properties.setString('base64image',imagebase64);*/
					/*
					var filename = new Date().getTime() + '_mobile.png';
					var createdFile = Titanium.Filesystem.getFile(Ti.Filesystem.tempDirectory,filename);
					createdFile.write(image);
					var blob =createdFile.read();
					var blob1=Ti.Utils.base64encode(blob);
					userProfileImage.image = event.media;
					
					Ti.App.Properties.setString('profile_image',filename);
					
					Ti.App.Properties.removeProperty('base64image');
					Ti.App.Properties.setString('base64image',blob1);
					//Ti.App.Properties.setString('base64image',event.media);
					*/
					
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
				
				//set message
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
		
		Titanium.Media.openPhotoGallery({
	
			success:function(event)
			{
				var cropRect = event.cropRect;
				var image = event.media;
		
				// set image view
				Ti.API.debug('Our type was: '+event.mediaType);
				if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
				{
					groupImageField.image = image;
				}
				else
				{
					// is this necessary?
				}
		
				Titanium.API.info('PHOTO GALLERY SUCCESS cropRect.x ' + cropRect.x + ' cropRect.y ' + cropRect.y  + ' cropRect.height ' + cropRect.height + ' cropRect.width ' + cropRect.width);
		
			},
			cancel:function()
			{
		
			},
			error:function(error)
			{
			},
			allowEditing:true,
			popoverView:groupImageField,
			mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
		});
	});
	//arrowDirection:arrowDirection,
	// create a button to close window
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


});


/*
var groupImageLabel = Ti.UI.createLabel({
	text : 'GROUP IMAGE',
	height : 'auto',
	width : 'auto',
	top : '40%',
	left : '10%',
	font:{fontSize:12},
	color : '#fff'
});

newGroupView.add(groupImageLabel);

var addGroupImageButton = Ti.UI.createButton({
	title : '+',
	top : '40%',
	right : '10%',
	height : 20,
	width : 20,
	font:{fontSize:16,fontWeight:'bold'},
});

newGroupView.add(addGroupImageButton);

var groupImageField = Ti.UI.createImageView({
	image : 'bigpic.png',
	width : 250,
	height : 150,
	top : '45%',
});

newGroupView.add(groupImageField);

var groupMemberLabel = Ti.UI.createLabel({
	text : 'GROUP MEMBERS',
	height : 'auto',
	width : 'auto',
	top : '90%',
	left : '10%',
	font:{fontSize:12},
	color : '#fff'
});

newGroupView.add(groupNameLabel);



groupChatWindowObj.addEventListener('click',function(){
	groupNameField.blur();
});

groupChatWindowObj.addEventListener('return',function(){
	newGroupView.scrollTo(0, 0);
});

addGroupImageButton.addEventListener('click', function()
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
					groupImageField.image = event.media;
					/*var imageView = Ti.UI.createImageView({
						image:event.media
					});
					win.add(imageView);*/
					/*Ti.App.Properties.setString('profile_image','large.png');
					userProfileImage.image = event.media;
					//win.close();
					var imagebase64 = Ti.Utils.base64encode(event.media);
					//Ti.API.info('Base 64 code'); 
					//Ti.API.info(imagebase64);
					Ti.App.Properties.setString('base64image',imagebase64);*/
					/*
					var filename = new Date().getTime() + '_mobile.png';
					var createdFile = Titanium.Filesystem.getFile(Ti.Filesystem.tempDirectory,filename);
					createdFile.write(image);
					var blob =createdFile.read();
					var blob1=Ti.Utils.base64encode(blob);
					userProfileImage.image = event.media;
					
					Ti.App.Properties.setString('profile_image',filename);
					
					Ti.App.Properties.removeProperty('base64image');
					Ti.App.Properties.setString('base64image',blob1);
					//Ti.App.Properties.setString('base64image',event.media);
					*/
				/*	
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
				
				//set message
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
		
		Titanium.Media.openPhotoGallery({
	
			success:function(event)
			{
				var cropRect = event.cropRect;
				var image = event.media;
		
				// set image view
				Ti.API.debug('Our type was: '+event.mediaType);
				if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
				{
					groupImageField.image = image;
				}
				else
				{
					// is this necessary?
				}
		
				Titanium.API.info('PHOTO GALLERY SUCCESS cropRect.x ' + cropRect.x + ' cropRect.y ' + cropRect.y  + ' cropRect.height ' + cropRect.height + ' cropRect.width ' + cropRect.width);
		
			},
			cancel:function()
			{
		
			},
			error:function(error)
			{
			},
			allowEditing:true,
			popoverView:groupImageField,
			mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
		});
	});
	//arrowDirection:arrowDirection,
	// create a button to close window
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


});

groupChatWindowObj.addEventListener('focus',function(){
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetConnectionsListByUserId';
	var xhr = Titanium.Network.createHTTPClient();    
    
    console.log(serverURL);
    xhr.open("POST", serverURL);
    xhr.setTimeout(99000);
 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    
    var userid = Ti.App.Properties.getString('userid');
    var params = { UserId : userid };
 	var widgets = JSON.stringify(params);
 	
 	console.log(widgets);
 	xhr.send(widgets);
   
    xhr.onload = function(){
     //alert("responseText: " + this.responseText);
     if(this.status == '200'){
        
        console.log(this.responseText);
        
        if(this.readyState == 4){
        	
        	var parsed_data = JSON.parse(this.responseText);
        	var index = [];
			var rows = [];   
        	
        	if(parsed_data[0].status == 'Success')
        	{
        		var conn_result_list = parsed_data[0].ConnectionsList;
        		var model = [];
        		for(var i = 0, l = conn_result_list.length; i < l;i++)
        		{
        			console.log(conn_result_list[i].UserName);
        			var user_detail = '';
        			
        			if(conn_result_list[i].JobTitle != '-1')
        			{
        				user_detail += conn_result_list[i].JobTitle+', ';
        			}
        			if(conn_result_list[i].Company != '-1')
        			{
        				user_detail += conn_result_list[i].Company+', ';
        			}
        			if(conn_result_list[i].Location != '-1')
        			{
        				user_detail += conn_result_list[i].Location;
        			}
        			        			
        			model.push({  Title : conn_result_list[i].FirstName+' '+conn_result_list[i].Surname, userDetail : user_detail, user_image : encodeURI(conn_result_list[i].ProfileImage), connectedUserId : conn_result_list[i].ConnectedUserId  });
        		}
        		console.log(model);
        		
				
				var curheader = '0';
				
				var alphaRowCount = 0;
				var rowIndexArray = [];
				var rowcount = 0;
				var jobtitle = '';
				// loop through model to add rows to table
				for (var i = 0, l = model.length; i < l; i++) 
				{
					var row = Ti.UI.createTableViewRow({
						width : 200,
						height : '75',
						left : '10%'
					});
					
					row.connected_user_id = model[i].connectedUserId;
					
					if(model[i].user_image != '' && model[i].user_image != null)
					{
						var userImage = Ti.UI.createImageView({
							top : '15%',
							left : '3%',
							width : '20%',
							image : model[i].user_image,
						});
						
						row.add(userImage);
					}
					
					
					var userDerailView = Ti.UI.createView({
						top : '15%',
						left : '25%',
						width : '60%',
						height : '80%',
						
					});
					
					var userNameText = Ti.UI.createLabel({
						text : model[i].Title,
						color : '#98bf1a',
						top : '2%',
						left : '1%',
						font : {fontSize:13}
						
					});
					
					userDerailView.add(userNameText);
					
					if(model[i].userDetail != '')
					{
						var detailText1 = Ti.UI.createLabel({
							text : model[i].userDetail,
							color : '#fff',
							top : '28%',
							left : '1%',
							font : {fontSize:12},
							height : 'auto',
							wordWrap : true
						});
						
						userDerailView.add(detailText1);
					}
					
					row.add(userDerailView);
					
					rows.push( row );
					rowcount++;
				}
				
				table.setData(  rows );
				
        	}	
        	else
        	{
        		var row = Ti.UI.createTableViewRow({
					width : 'auto',
					height : 'auto',
				});
        		var msg = Ti.UI.createLabel({
					text : 'No connections in list',
					color : '#fff',
					font : {fontSize:12},
					wordWrap : true
				});
				row.add(msg);
				table.setData(  row );

        	}			
			actInd.hide();
        }else{
          alert('HTTP Ready State != 4');
          actInd.hide();
        }           
     }else{
        alert('Transmission failed. Try again later. ' + this.status + " " + this.response);
        actInd.hide();
     }              
    };
 
    xhr.onerror = function(e){console.log(e.source); actInd.hide();alert('Transmission error: ' + e.error);};
});
*/