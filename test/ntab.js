var tabflag =localStorage.getItem('tabbox');
var maxtabs =localStorage.getItem('maxtabs');
var tabs_count;

function updateTCount() {
    chrome.tabs.query({
       
    }, function (tabs) {
        tabs_count = tabs.length;
        
        
    });
}

function TabCreated(tab) {
   
    if (tabs_count >= maxtabs) {
        chrome.tabs.remove(tab.id);
        alert("max limit of tabs reached");
    }
    else {
        updateTCount();
    }
}

function TabRemoved(tab) {
    updateTCount();
}

function TabUpdated(tab) {
    updateTCount();
}

function init() {
    updateTCount();
    chrome.tabs.onCreated.addListener(TabCreated);
    chrome.tabs.onRemoved.addListener(TabRemoved);
    chrome.tabs.onUpdated.addListener(TabUpdated);
}

function rem() {
    chrome.tabs.onCreated.removeListener(TabCreated);
    chrome.tabs.onRemoved.removeListener(TabRemoved);
    chrome.tabs.onUpdated.removeListener(TabUpdated);
}


if (tabflag=="true") {
        init();
        
    }
    else {
        rem();
       
 }


