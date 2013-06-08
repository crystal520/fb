var win = Ti.UI.currentWindow;

var but = Ti.UI.createButton({
	title : 'back',
	bottom : 0
});
but.addEventListener('click', function() {
	win.close();
});

win.add(but);


	var url = "http://dev.zone2serve.me/e.wb4.dev.zone2serve.me/peoplevpn-api/version-1/manage/test/gzip.php";
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
	client.open("GET", url);
	client.send();