var win = Ti.UI.createWindow({
  backgroundColor: 'black',
  exitOnClose: true,
  fullscreen: false,
  title: 'TableView Demo'
});

var tableData = [];

for (var i=1; i<=20; i++)
{
	var row = Ti.UI.createTableViewRow
  	({
		className:'forumEvent', // used to improve table performance
		selectedBackgroundColor:'white',
		rowIndex:i, // custom property, useful for determining the row during events
		height:110
  	});
  
	var textField1 = Ti.UI.createTextField
	({
  		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	  	color: '#336699',
	  	top: 10, left: 10,
	  	width: 250,
	  	customValue : 'text_field_1_'+i
	});
	
	var textField2 = Ti.UI.createTextField
	({
  		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	  	color: '#336699',
	  	top: 10, left: 10,
	  	width: 250,
	  	customValue : 'text_field_2_'+i
	});

  	row.add(textField1);
  	row.add(textField2);
  	tableData.push(row);
}

var tableView = Ti.UI.createTableView({
  backgroundColor:'white',
  data:tableData
});

var textValue = null;
for( var i = 0 ; i < tableData.length ; i++ )
{	
	for( var j = 0 ; j < tableData[i].children.length ; j++ )
	{
		if( tableData[i].children[j] ==  "[object TiUITextField]" )
		{
			tableData[i].children[j].addEventListener( 'focus' , function(e)
			{	
				//textValue.blur();
				customFun( e );
			});	
		}
	
	}
}


win.add(tableView);
win.open();


function customFun(e)
{
	var pickVal = "Bananas";
	
	e.source.blur();
	console.log(JSON.stringify(e));
	
	var picker = Ti.UI.createPicker
	({
  		bottom:50
	});
	picker.addEventListener('change',function(ee)
	{
		console.log(JSON.stringify(ee.row.title));
  		pickVal = ee.row.title;
	});
	
	var data = [];
	data[0]=Ti.UI.createPickerRow({title:'Bananas'});
	data[1]=Ti.UI.createPickerRow({title:'Strawberries'});
	data[2]=Ti.UI.createPickerRow({title:'Mangos'});
	data[3]=Ti.UI.createPickerRow({title:'Grapes'});

	picker.add(data);
	picker.selectionIndicator = true;
	
	var btn = Ti.UI.createButton
	({
		bottom : 0,
		title : "done"
	})
	btn.addEventListener('click' , function()
	{
		e.source.value = pickVal;
		win.remove(picker);
		win.remove(btn);
	});
	
	win.add(btn);
	win.add(picker);
	
	//e.source.value= "fewqkbh";
}
