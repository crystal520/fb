
var privateData = 'private to the module\'s sandbox, not available globally';
 
//any property attached to the exports object becomes part of the module's public interface
function add() 
{
	var result = 0;
	for (var i = 0, l = arguments.length;i<l;i++) 
	{
	    result = result+arguments[i];
	}
	
	return result;
}

function view() 
{
	  var view = Ti.UI.createView({background:'green'});
	  
	  return view;
}

//create public interface
exports.view = view;
exports.add = add;