var win = Ti.UI.currentWindow;

var but = Ti.UI.createButton({
	title : 'back',
	bottom : 0
});
but.addEventListener('click', function() {
	win.close();
});

win.add(but);

var methodBox = Ti.UI.createTextField({
	top : 20,
	width : 200,
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	value : "DELETE",
	visible : false
});
win.add(methodBox);

var option = Ti.UI.createTextField({
	top : 20,
	width : 200,
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	hintText : "option"
});
win.add(option);

var param2 = Ti.UI.createTextField({
	top : 20,
	width : 200,
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	hintText : "param2"
});
win.add(param2);

var butn = Ti.UI.createButton({
	top : 20,
	title : "load"
});
win.add(butn);

butn.addEventListener("click", function() {
	var methodBoxValue = methodBox.value;
	var optionValue = option.value;
	var param2Value = param2.value;

	Ti.API.info("-------------------------------------------------------------------------------------------------------");

	loadAjax(methodBoxValue, optionValue, param2Value);
});

function loadAjax(methodBoxValue, optionValue, param2Value) {
	/* var data =
	 {
	 "friendFirstName" : "optionValue" ,
	 "friendLastName" : "param2Value" ,
	 "userId" : "1446",
	 "friendPhoneCode" :"2!s"
	 }
*/
	 var addFriends = new Array();
	 var addFriend = new Array();

	 for(var i = 0 ; i < 1 ; i++ )
	 {
			addFriends[i] = { "friendFirstName" : "friendFirstName" , "friendLastName" : "friendLastName" };
	 }

	 var rahul =
	 {
	 	"u":
	 			{"eventName":"Test123","eventDate":"12-02-1990","eventTime":"12:44:36"}
	 }

	rahul = JSON.stringify(rahul);
	
	var data = {
		"u":addFriends
	}
	data = JSON.stringify(data);

	var frndsData= JSON.stringify(new Array(946 , 935));

	var url = "http://dev.zone2serve.me/a.wb4.dev.zone2serve.me/slim/index.php/user/1446/friends";
	Ti.API.info("url = " + url + "\n" + data);

	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			Ti.API.info(" status = " + this.status + "\n responseText = " + this.responseText);
			alert(" status = " + this.status + "\n responseText = " + this.responseText);
			
		},
		onerror : function(e) {
			Ti.API.info(" error = " + e.error + "\n status = " + this.status + "\n responseText = " + this.responseText);
			alert(" error = " + e.error + "\n status = " + this.status + "\n responseText = " + this.responseText);
		},
		timeout : 5000 // in milliseconds
	});
	client.open("POST", url);
	client.setRequestHeader("Accept-Encoding", "gzip,deflate");
	client.setRequestHeader('TOKEN', 'qwdqwdqwwq');
	//client.setRequestHeader('HASHCODE', '3b87c97d15e8eb11e51aa25e9a5770e9');
	// client.setRequestHeader('HASHCODE', '39fd5c0b483bfa0a5cbc0c92ebc2e04f');
	client.setRequestHeader("Content_Type", "application/vnd.ok.cloodevent.api.v1");
	client.send(data);
}
