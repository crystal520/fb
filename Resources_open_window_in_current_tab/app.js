var win1 = Ti.UI.createWindow({ url : "tab1.js", backgroundColor : "green"});
var win3 = Ti.UI.createWindow({url : "tab2.js" , backgroundColor : "blue"});

var tabGroup = Ti.UI.createTabGroup();

var tab1 = Titanium.UI.createTab
({
    window:win1,
    title:'Hello',
});
tabGroup.addTab(tab1);

var tab2 = Titanium.UI.createTab
({
    window:win3,
    title:'Hello2',
});
tabGroup.addTab(tab2);

tabGroup.open();