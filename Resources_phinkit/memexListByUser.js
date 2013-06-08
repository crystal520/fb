Ti.include('htmlEntities.js');

var memexListWindowObj = Ti.UI.currentWindow;

memexListWindowObj.setBackgroundImage('bg.png');

/******Header View Start********/

var title = 'Connections';
var notificationView = '';
var notiFlag = 0;

Ti.include('header.js');




/*
setTimeout(function(){
	var headerModule = require('header').addHeader;
	var headerView = new headerModule('Memex');
	
	memexListWindowObj.add(headerView);
},1000);
*/

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

memexListWindowObj.add(actInd);

var backButton = Ti.UI.createButton({
    backgroundImage: 'green_bg.png',
    title:'Back',
    height: 28,
    width: 51,
    top:'15%',
    left:'3%',
});

memexListWindowObj.add(backButton);

backButton.addEventListener('click',function(e){
	Ti.UI.currentWindow.close();
});

/******Memex Listing Start********/

var memexScrollView = Ti.UI.createScrollView({
	top : '25%',
	left : '1%',
	width : '317',
	contentHeight : 'auto',
	contentWidth : 'auto',
	showHorizontalScrollIndicator : false,
	showVerticalScrollIndicator : true,
	backgroundColor : 'transparent'
});

var tableView = Titanium.UI.createTableView({
	top : 110,
	width : 317,
    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
    backgroundColor : 'transparent'
});

tableView.addEventListener('click',function(e){
	showDetailPage(e);
});

var lastDistance = 0; 
var updating = false;
var indexOfMemex = 0;
var lastRow = 9;
var isLastResponseNull = false;

function beginUpdate()
{
	console.log('I am in begin');
    updating = true;
    actInd.show();
    console.log('before Memex1 : '+indexOfMemex);
	indexOfMemex++;
    //tableView.appendRow(loadingRow);

    // just mock out the reload
    setTimeout(endUpdate,2000);
}

function endUpdate()
{
    updating = false;
    console.log('before Memex : '+indexOfMemex);
    console.log('after Memex : '+indexOfMemex);
	var startMemex = indexOfMemex*9;
	console.log('start Memex : '+startMemex);
  
	showMemexListByUser(startMemex,9);
    actInd.hide();
}
        	
tableView.addEventListener('scroll',function(e){
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


//memexScrollView.add(tableView);

memexListWindowObj.add(tableView);
var inputData = [];
function showMemexListByUser(start,end)
{
	var serverURL = Ti.App.Properties.getString('baseurl')+'GetMemexListByUser';
	var xhr = Titanium.Network.createHTTPClient();    
    
    xhr.open("POST", serverURL);
 	xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
    xhr.setTimeout('300');
    
    var userid = memexListWindowObj.memexUserId;
	var params = { SubMenuType : "MEMEXBYUSER", UserId : userid,"StartMemexRowNumber":start,"NoOfRowsRetuns":end};
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
        	console.log('lavina');
        	//console.log(parsed_data);	
        	//console.log('input arr');
        	
        	for(var i = 0, l = parsed_data.length; i < l; i++)
        	{
        		var dataObj = parsed_data[i];
        		if(dataObj.status == 'Failure')
        		{
        			isLastResponseNull = true;
        		}
        		else{
        			
        			var name = dataObj.FirstName+" "+dataObj.Surname;
        		
	        		var data = {"BlogticleURLTitles" : dataObj.BlogticleURLTitles, "memexImage" : dataObj.MainImage, "memexTitle" : dataObj.Title, "memexUsername" : name};
	        		
	        		var imageName =  dataObj.MainImage;
	        		
	        		var memexCompleteSmallImagePath = '';
	        		
	        		if(imageName != '' && imageName != null)
	        		{
	        			memexCompleteSmallImagePath = encodeURI(imageName);
	        		}
	        		else
	        		{
	        			memexCompleteSmallImagePath = 'http://development.phinkit.com/Assets/Images/memex/default_img.jpg';
	        		}
	        		
					
	        		var row = Titanium.UI.createTableViewRow({
						width : 317,
						height : 100,
						backgroundColor : 'transparent',
						backgroundImage : 'memexbg.png',
					});
					
					row.memexId = dataObj.BlogticleID;
					row.memexOwnerId = dataObj.UserId;
					
					//console.log(dataObj.BlogticleURLTitles);
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
					
					var titleView = Ti.UI.createView({
						left : '25%',
						width : '64%',
						height : '70%',
						top : '15%',
					});
					
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
					
					inputData.push(row);
        		}
        		
				//tableView.appendRow(row);
        	}
        	
        	tableView.setData(inputData);
        	
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

memexListWindowObj.addEventListener('focus',function(){
	if(notificationView != '' && notiFlag == 1)
		{
			connectionWindowObj.remove(notificationView);	
			notiFlag = 0;
		}
	getLatestNotifications();
	
	inputData = [];
	indexOfMemex = 0;
	showMemexListByUser(0,9);
});

function showDetailPage(e)
{
	var rowdata = e.rowData;
	
	if(rowdata.memexId > 0)
	{
		var memexDetailWindow = Titanium.UI.createWindow({
			url : 'memexDetail.js',
		});
		memexDetailWindow.memex_id = rowdata.memexId;
		memexDetailWindow.memex_ownerid = rowdata.memexOwnerId;
		
		Ti.UI.currentTab.open(memexDetailWindow,{animate:true});
	}
	
}