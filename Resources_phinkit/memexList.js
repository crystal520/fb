Ti.include('htmlEntities.js');

var memexWindowObj = Ti.UI.currentWindow;

memexWindowObj.setBackgroundImage('bg.png');

/******Header View Start********/
var title = 'Memex';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');

/*
setTimeout(function(){
	//actInd.hide();
	//alert('loading header in chat');
	var headerModule = require('header').addHeader;
	var headerView = new headerModule('Memex');
	
	memexWindowObj.add(headerView);
},1000);
*/
/******Header View End********/

Ti.App.Properties.setBool('mixit',false);
Ti.App.Properties.setString('selectedTab','');

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

memexWindowObj.add(actInd);

var subHeaderView = Ti.UI.createView({
	top : '13%',
	height : '13%',
	backgroundImage : 'memexnavbg.png'
});

var editorChoiceView = Ti.UI.createView({
	top : '1%',
	width : '33%',
	left : '0%',
	backgroundColor : 'transparent',
});

subHeaderView.add(editorChoiceView);

var editorsChoice = Ti.UI.createLabel({
	top : '30%',
	width : 'auto',
	height : 'auto',
	textAlign : 'center',
	text : 'Editor\'s Choice',
	font :  {fontSize:14, fontName : 'Helvetica', fontWeight : 'bold'},
	color : '#fff',
	
});

editorChoiceView.add(editorsChoice);

var latestView = Ti.UI.createView({
	top : '1%',
	width : '32%',
	left : '34%',
	backgroundColor : 'transparent',
});

subHeaderView.add(latestView);

var latestText = Ti.UI.createLabel({
	top : '30%',
	width : 'auto',
	height : 'auto',
	textAlign : 'center',
	text : 'Latest',
	font : {fontSize:14, fontName : 'Helvetica', fontWeight : 'bold'},
	color : '#fff'
});


latestView.add(latestText);
/*
var filterView = Ti.UI.createView({
	top : '1%',
	width : '13%',
	left : '58%',
	backgroundColor : 'transparent',
});

subHeaderView.add(filterView);

var filterImage = Ti.UI.createImageView({
	top : '34%',
	width : 'auto',
	height : 'auto',
	image : 'memicon1.png',
});

filterView.add(filterImage);
*/
var mixitView = Ti.UI.createView({
	top : '1%',
	width : '33%',
	right : 1,
	backgroundColor : 'transparent',
});

subHeaderView.add(mixitView);

var mixitText = Ti.UI.createLabel({
	top : '30%',
	width : 'auto',
	height : 'auto',
	left : '25%',
	text : 'Mix it',
	font : {fontSize:14, fontName : 'Helvetica', fontWeight : 'bold'},
	color : '#fff'
});

mixitView.add(mixitText);

var mixitImage = Ti.UI.createImageView({
	top : '34%',
	width : 'auto',
	height : 'auto',
	right : '20%',
	image : 'memicon2.png',
});

mixitView.add(mixitImage);

memexWindowObj.add(subHeaderView);


/******Memex Listing Start********/

var memexScrollView = Ti.UI.createScrollView({
	top : 110,
	width : 317,
	contentHeight : 'auto',
	contentWidth : 'auto',
	showHorizontalScrollIndicator : false,
	showVerticalScrollIndicator : true,
	backgroundColor : 'transparent'
});

var tableViewLatest = Titanium.UI.createTableView({
	top : 110,
	width : 317,
    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
    backgroundColor : 'transparent'
});

tableViewLatest.addEventListener('click',function(e){
	showDetailPage(e);
});

memexWindowObj.add(tableViewLatest);

var tableViewEditor = Titanium.UI.createTableView({
	top : 110,
	width : 317,
    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
    backgroundColor : 'transparent'
});

tableViewEditor.addEventListener('click',function(e){
	showDetailPage(e);
});

var lastDistance = 0; 
var updating = false;
var indexOfMemex = 0;
var lastRow = 9;
var isLastResponseNull = false;

function beginUpdate()
{
    updating = true;
    actInd.show();
	indexOfMemex++;
    //tableView.appendRow(loadingRow);

    // just mock out the reload
    setTimeout(endUpdate,2000);
}

Ti.App.addEventListener('goToMemex', function(e) {
	
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetBlogticleIdByBlogticleUrl';
	var xhr = Titanium.Network.createHTTPClient();    
    xhr.open("POST", serverURL);
 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    var params = { BlogticleUrl : e.url};
 	var widgets = JSON.stringify(params);
 	console.log(serverURL);
 	console.log(widgets);
 	xhr.send(widgets);
   
    xhr.onload = function()
    {
    	console.log(this.responseText);
    	
    	parsed_data = JSON.parse(this.responseText);
    	
    	if(parsed_data.Status == 'Success')
    	{
    		var memexDetailWindow = Titanium.UI.createWindow({
				url : 'memexDetail.js',
			});
			memexDetailWindow.memex_id = parsed_data.BlogticleID;
			memexDetailWindow.memex_ownerid = parsed_data.MemexOwnerId;
		
			Ti.UI.currentTab.open(memexDetailWindow, {
				animate : true
			});
    	}
    	else
    	{
    		alert('Memex is not Present');
    	}
    	
    	
    };
    
    xhr.onerror = function()
    {
    	alert('Some Error Occure With Webservice');	
    }
	
});

function endUpdate()
{
    updating = false;
	var startMemex = indexOfMemex*9;
	console.log('start Memex : '+startMemex);
  
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetMemexListForLatestFollowingConnections';
	var xhr = Titanium.Network.createHTTPClient();    
    
    xhr.open("POST", serverURL);
    xhr.setTimeout(99000);
 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    
    var mixitvale = Ti.App.Properties.getBool('mixit');
    var userid = Ti.App.Properties.getString('userid');
	var params = { SubMenuType : "latest", UserId : userid, StartMemexRowNumber : startMemex, NoOfRowsRetuns : 9, IsMixItFlag : mixitvale };
	var widgets = JSON.stringify(params);
 	
 	console.log(widgets);
 	xhr.send(widgets);
 	
 	xhr.onload = function(){
     
     if(this.status == '200'){
       
        console.log(this.responseText);
        if(this.responseText == null || this.responseText == '')
        {
        	isLastResponseNull = true;
        }
        
        if(this.readyState == 4){
        	var parsed_data = JSON.parse(this.responseText);
        	
        	//console.log(parsed_data);	
        	//console.log('input arr');
        	
        	for(var i = 0, l = parsed_data.length; i < l; i++)
        	{	
        		var dataObj = parsed_data[i];
        		
        		var name = dataObj.FirstName+" "+dataObj.Surname;
        		
        		var data = {"BlogticleURLTitles" : dataObj.BlogticleURLTitles, "memexImage" : dataObj.MainImage, "memexTitle" : dataObj.Title, "memexUsername" : name};
        		
        		var imageName =  dataObj.MainImage;
        		
        		var memexCompleteSmallImagePath = '';
        		
        		memexCompleteSmallImagePath = imageName;
				
				var row = Titanium.UI.createTableViewRow({
					width : 317,
					height : 100,
					backgroundColor : 'transparent',
					backgroundImage : 'memexbg.png',
				});
				
				row.memexId = dataObj.BlogticleID;
				row.memexOwnerId = dataObj.UserId;
				
				//console.log(dataObj.BlogticleURLTitles);
				if(memexCompleteSmallImagePath != '' && memexCompleteSmallImagePath != '-1' && memexCompleteSmallImagePath != null)
				{
					var userImage = Ti.UI.createImageView({
						top : '19%',
						left : '3%',
						width : 65,
						height : 40,
						image : encodeURI(memexCompleteSmallImagePath),
						borderRadius : 5,
						borderColor : '#c0c0c0'
					});
					
					row.add(userImage);
				}
				
				var titleView = Ti.UI.createView({
					left : '25%',
					width : '64%',
					height : '70%',
					top : '15%',
				});
				//dataObj.Title
				//unescape(dataObj.Title)
				var title = dataObj.Title;
				var height = '33%';
				var top  =  '33%';
				if(title.length > 25){
					height = '53%';
					top = '53%';
				}
				var titleText = Ti.UI.createLabel({
					text : entityToHtml(unescape(dataObj.Title)),
					color : '#98bf1a',
					left : '3%',
					font : {fontSize:'16', fontName : 'Helvetica', fontWeight : 'bold'},
					/*borderColor : 'red',*/
					top : 1,
					height : height,
					
				});
				
				titleView.add(titleText);
				
				var name_height = '33%';
				if(name.length > 25)
				{
					name_height = '50%';
				}
				var userNameText = Ti.UI.createLabel({
					text : 'By '+unescape(name),
					color : '#fff',
					top : height,
					left : '3%',
					height : name_height,
					font : {fontSize:'14', fontName : 'Helvetica'},
					/*borderColor : 'blue'*/
				});
				
        		titleView.add(userNameText);
				
				row.add(titleView);
				
				var rightArrowImage = Ti.UI.createImageView({
					top : '40%',
					right : '3%',
					image : 'memarrow.png',
				});
				
				row.add(rightArrowImage);
				tableViewLatest.appendRow(row);
				//inputData.push(row);
				
        	}
        	lastRow += parsed_data.length;
        	//tableViewLatest.setData(inputData);
        	
        	// just scroll down a bit to the new rows to bring them into view
		    //tableViewLatest.scrollToIndex(lastRow,{animated:true,position:Ti.UI.iPhone.TableViewScrollPosition.BOTTOM});
        }
        else
        {
          alert('HTTP Ready State != 4');
          actInd.hide();  
        }
                
     }else{
        alert('Transmission failed. Try again later. ' + this.status + " " + this.response);
     }              
    };
 
    xhr.onerror = function(e){console.log(e.source); alert('Transmission error: ' + e.error);};
    actInd.hide();
}
        	
tableViewLatest.addEventListener('scroll',function(e){
	//console.log('scrolling...');
	var offset = e.contentOffset.y;
    var height = e.size.height;
    var total = offset + height;
    var theEnd = e.contentSize.height;
    var distance = theEnd - total;
   // console.log("offset : "+offset+' height : '+height+" total: "+total+" theEnd : "+theEnd+" distance: "+distance);
    
    // going down is the only time we dynamically load,
    // going up we can safely ignore -- note here that
    // the values will be negative so we do the opposite
    if (distance < lastDistance)
    {
    	// adjust the % of rows scrolled before we decide to start fetching
    	var nearEnd = theEnd * .75;
    	//console.log('near End...'+nearEnd);
    	if (!updating && (total >= nearEnd))
        {
        	console.log('Updating.....');
        	if(!isLastResponseNull)
        	{
        		beginUpdate();	
        	}
        }
    }
    lastDistance = distance;
});  

memexWindowObj.add(tableViewEditor);

function getMemexList()
{
	var editorOrLatest = Ti.App.Properties.getString('selectedTab');
	//alert(editorOrLatest);
	/*var scrollChild = memexScrollView.children.length;
	if(scrollChild > 0)
	{
		memexScrollView.remove(memexScrollView.children[0]);
	}*/
	
	actInd.show();
	//alert('Called memex listing');
	//console.log(memexScrollView.children.length);
	
	var inputData = [];
	
	var memexArr = [];
	
	tableViewLatest.hide();
	tableViewEditor.hide();
	
	if(editorOrLatest == 'latest')
    {
    	editorChoiceView.setBackgroundColor('transparent');
    	latestView.setBackgroundColor('#98bf1a');	
    	tableViewLatest.show();
    }
    else
    {
    	editorChoiceView.setBackgroundColor('#98bf1a');
    	latestView.setBackgroundColor('transparent');
    	tableViewEditor.show();
    }
	
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetMemexListForEditorChoice';
	console.log(editorOrLatest);
	
	
	var xhr = Titanium.Network.createHTTPClient();    
	xhr.setTimeout(99000);
    xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    //xhr.setTimeout('300');
    if(editorOrLatest == 'latest')
	{
		var serverURL = Ti.App.Properties.getString('baseurl')+'GetMemexListForLatestFollowingConnections';
		var xhr = Titanium.Network.createHTTPClient();    
	    
	    xhr.open("POST", serverURL);
	    xhr.setTimeout(99000);
	 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
	   // xhr.setTimeout('300');
	    
	    var mixitvale = Ti.App.Properties.getBool('mixit');
	    var userid = Ti.App.Properties.getString('userid');
		var params = { SubMenuType : "latest", UserId : userid, StartMemexRowNumber : 1, NoOfRowsRetuns : 9, IsMixItFlag : mixitvale };
		var widgets = JSON.stringify(params);
	 	
	 	console.log(widgets);
	 	xhr.send(widgets);
	}
	else
	{
		Ti.App.Properties.setBool('mixit',false);
		mixitView.setBackgroundColor('transparent');
		
		console.log(serverURL)
		xhr.open("GET", serverURL);
	 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
	    
	    xhr.send();
	}
   
   
    xhr.onload = function(){
     
     if(this.status == '200'){
       
        console.log(this.responseText);
        
        if(this.readyState == 4){
        	var parsed_data = JSON.parse(this.responseText);
        	
        	console.log(parsed_data);	
        	//console.log('input arr');
        	
        	for(var i = 0, l = parsed_data.length; i < l; i++)
        	{
        		var dataObj = parsed_data[i];
        		
        		var name = dataObj.FirstName+" "+dataObj.Surname;
        		
        		var data = {"BlogticleURLTitles" : dataObj.BlogticleURLTitles, "memexImage" : dataObj.MainImage, "memexTitle" : dataObj.Title, "memexUsername" : name};
        		console.log(data);
        		var imageName =  dataObj.MainImage;
        		
        		var memexCompleteSmallImagePath = '';
        		memexCompleteSmallImagePath = imageName;
        		/*
        		if(editorOrLatest == 'latest')
				{
					memexCompleteSmallImagePath = imageName;
				}
				else
				{
					if(imageName != '' && imageName != null)
	        		{
	        			memexCompleteSmallImagePath = 'http://development.phinkit.com/Images/memex/'+imageName;
	        		}
	        		else
	        		{
	        			memexCompleteSmallImagePath = 'http://development.phinkit.com/Assets/Images/memex/default_img.jpg';
	        		}
				}
				*/
        		
        		var row = Titanium.UI.createTableViewRow({
					width : 317,
					height : 100,
					backgroundColor : 'transparent',
					backgroundImage : 'memexbg.png',
					borderColor : 'red'
				});
				
				row.memexId = dataObj.BlogticleID;
				row.memexOwnerId = dataObj.UserId;
				
				//console.log(dataObj.BlogticleURLTitles);
				if(memexCompleteSmallImagePath != '' && memexCompleteSmallImagePath != null )
				{
					var userImage = Ti.UI.createImageView({
						top : '19%',
						left : '3%',
						width : 65,
						height : 40,
						image : encodeURI(memexCompleteSmallImagePath),
						borderRadius : 5,
						borderColor : '#c0c0c0'
					});
					
					row.add(userImage);
				}
				
				
				var titleView = Ti.UI.createView({
					left : '25%',
					width : '64%',
					height : '70%',
					top : '15%',
				});
				//dataObj.Title
				//unescape(dataObj.Title)
				var title = dataObj.Title;
				var height = '33%';
				var top  =  '33%';
				if(title.length > 25){
					height = '53%';
					top = '53%';
				}
				var titleText = Ti.UI.createLabel({
					text : entityToHtml(unescape(dataObj.Title)),
					color : '#98bf1a',
					left : '3%',
					font : {fontSize:'16', fontName : 'Helvetica', fontWeight : 'bold'},
					/*borderColor : 'red',*/
					top : 1,
					height : height,
					
				});
				
				titleView.add(titleText);
				
				var name_height = '33%';
				if(name.length > 25)
				{
					name_height = '50%';
				}
				var userNameText = Ti.UI.createLabel({
					text : 'By '+unescape(name),
					color : '#fff',
					top : height,
					left : '3%',
					height : name_height,
					font : {fontSize:'14', fontName : 'Helvetica'},
					/*borderColor : 'blue'*/
				});
				
				titleView.add(userNameText);
					
				row.add(titleView);
				
				var rightArrowImage = Ti.UI.createImageView({
					right : '3%',
					image : 'memarrow.png',
				});
				
				row.add(rightArrowImage);
			
				inputData.push(row);
				
        	}
        	
        	if(editorOrLatest == 'latest')
        	{
        		tableViewLatest.setData(inputData);
        	}
        	else
        	{
        		tableViewEditor.setData(inputData);
        	}
        	
        	actInd.hide();
        	
        }
        else
        {
          alert('HTTP Ready State != 4');
          actInd.hide();  
        }
                
     }else{
     	actInd.hide();  
        alert('Transmission failed. Try again later. ' + this.status + " " + this.response);
     }              
    };
 
    xhr.onerror = function(e){console.log(e.source); actInd.hide();  alert('Transmission error: ' + e.error);};
    
    console.log(inputData);
	
	
}

//memexWindowObj.add(memexScrollView);

function showDetailPage(e)
{
	var rowdata = e.rowData;
	//alert(rowdata.phoughtId);
	
	/*var phoughtDetailWindow = Titanium.UI.createWindow({
		url : 'phoughtDetail.js',
		navBarHidden : false,
		barImage : 'headerbg.png',
		backButtonTitleImage : 'smalllogo.png',
		barColor : 'green'
		
	});
	*/
	
	if(rowdata.memexId > 0)
	{
		var memexDetailWindow = Titanium.UI.createWindow({
			url : 'memexDetail.js',
		});
		memexDetailWindow.memex_id = rowdata.memexId;
		memexDetailWindow.memex_ownerid = rowdata.memexOwnerId;
		
		Ti.UI.currentTab.open(memexDetailWindow,{animate:true});
	}
	
	
	/*var nav = Ti.UI.iPhone.createNavigationGroup({
		window : phoughtDetailWindow
	});
	
	*/
	
	
	
}

memexWindowObj.addEventListener('focus',function(){
	if(notificationView != '' && notiFlag == 1)
	{
		memexWindowObj.remove(notificationView);	
		notiFlag = 0;
	}
	getLatestNotifications();
	var selectedTab = Ti.App.Properties.getString('selectedTab');
	if(selectedTab == '')
	{
		Ti.App.Properties.setString('selectedTab','latest');
	}
	getMemexList();
});

/******Memex Listing End********/

editorChoiceView.addEventListener('click',function(){
	Ti.App.Properties.setString('selectedTab','editor');
	getMemexList();
});

latestView.addEventListener('click',function(){
	Ti.App.Properties.setString('selectedTab','latest');
	Ti.App.Properties.setBool('mixit',false);
	mixitView.setBackgroundColor('transparent');
	getMemexList();
});

mixitView.addEventListener('click',function(){
	//alert('mixit clicked'+Ti.App.Properties.getBool('mixit'));
	
	var mixitvale = Ti.App.Properties.getBool('mixit');
	Ti.App.Properties.setBool('mixit',true);
	mixitView.setBackgroundColor('#98bf1a');
	//alert(mixitvale);
	/*
	if(mixitvale)
	{
		//alert('I am in true');
		Ti.App.Properties.setBool('mixit',false);
		mixitView.setBackgroundColor('transparent');
	}
	else
	{
		//alert('I am in else/false');
		Ti.App.Properties.setBool('mixit',true);
		mixitView.setBackgroundColor('#98bf1a');
	}
	*/
	Ti.App.Properties.setString('selectedTab','latest');
	getMemexList();
});
/*headerImage.addEventListener('click',function(e)
{
	
	alert(e.source.custid);
	
	
})
*/
