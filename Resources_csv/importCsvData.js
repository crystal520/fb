exports.importCsvData = function(_filename)
{
 
     //var sep = Titanium.Filesystem.getSeparator();
     //var importfile = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory + sep + _filename);
	 var importfile = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'applist.csv');
     
     if(importfile.exists()) 
         { Ti.API.info('file exists'); 
 
             var contents = importfile.read();
 
	         var blob = importfile.read();
			 var readText = blob.text;
             Ti.API.info("simple text = " + typeof readText);
             Ti.API.info("-----------------------------------------------------------------------");
             
             var arrData = CSVToArray(readText , ",");
             Ti.API.info("array text = " + typeof arrData);
             
             for(var i = 0 ; i < arrData.length ; i++ )
             {
             	Ti.API.info("---->" + arrData[i]);
             	innerData = arrData[i];
             	
             	for(var ii = 0 ; ii < arrData.length ; ii ++ )
             	{
             		Ti.API.info("------------>" + innerData[ii]);
             	}
             }
             
             // return import array
             // return readText;  
     }
     else{
         alert('Import file does not exist.');
 
         return 0; 
     } 
}

function CSVToArray( strData, strDelimiter )
{
	// Check to see if the delimiter is defined. If not,
	// then default to comma.
	strDelimiter = (strDelimiter || ",");
	 
	// Create a regular expression to parse the CSV values.
	var objPattern = new RegExp(
	(
	// Delimiters.
	"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
	 
	// Quoted fields.
	"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
	 
	// Standard fields.
	"([^\"\\" + strDelimiter + "\\r\\n]*))"
	),
	"gi"
	);
	 
	 
	// Create an array to hold our data. Give the array
	// a default empty first row.
	var arrData = [[]];
	 
	// Create an array to hold our individual pattern
	// matching groups.
	var arrMatches = null;
	 
	 
	// Keep looping over the regular expression matches
	// until we can no longer find a match.
	while (arrMatches = objPattern.exec( strData )){
	 
	// Get the delimiter that was found.
	var strMatchedDelimiter = arrMatches[ 1 ];
	 
	// Check to see if the given delimiter has a length
	// (is not the start of string) and if it matches
	// field delimiter. If id does not, then we know
	// that this delimiter is a row delimiter.
	if (
	strMatchedDelimiter.length &&
	(strMatchedDelimiter != strDelimiter)
	){
	 
	// Since we have reached a new row of data,
	// add an empty row to our data array.
	arrData.push( [] );
	 
	}
	 
	 
	// Now that we have our delimiter out of the way,
	// let's check to see which kind of value we
	// captured (quoted or unquoted).
	if (arrMatches[ 2 ]){
	 
	// We found a quoted value. When we capture
	// this value, unescape any double quotes.
	var strMatchedValue = arrMatches[ 2 ].replace(
	new RegExp( "\"\"", "g" ),
	"\""
	);
	 
	} else {
	 
	// We found a non-quoted value.
	var strMatchedValue = arrMatches[ 3 ];
	 
	}
	 
	 
	// Now that we have our value string, let's add
	// it to the data array.
	arrData[ arrData.length - 1 ].push( strMatchedValue );
	}
	 
	// Return the parsed data.
	return( arrData );
}

