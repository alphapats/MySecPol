var UAflag=true;
var UA_bl=['<all_urls>'];
var UA_wl=[];

var refererflag=true;
var referer_bl=[];
var referer_wl=['<all_urls>'];
var httpflag=true;
var non_https_bl=['http://*/*'];
var non_https_wl=[];
var jsflag=true;
var js_bl=['crossdomain', '*://*.iitb.ac.in/*', '*://*.zedo.com/*', '*://partner.googleadservices.com/*'];
var js_wl=[];
var imageflag=true;
var image_bl=[];
var image_wl=['<all_urls>'];
var objectflag=true;
var object_bl=['<all_urls>'];
var object_wl=[];
var fontflag=false;
var font_bl=[];
var font_wl=[];
var XHRflag=true;
var XHR_bl=['<all_urls>'];
var XHR_wl=[];
var stylesheetflag=false;
var stylesheet_bl=[];
var stylesheet_wl=[];
var mediaflag=false;
var media_bl=[];
var media_wl=[];
var blockflag=false;
var blocked_bl=[];
var white_list=[];
var exeflag=true;
var exe_bl=['<all_urls>'];
var exe_wl=[];
var appflag=true;
var app_bl=['<all_urls>'];
var app_wl=[];
var webRTCflag=false;
var webRTC_bl=[];
var webRTC_wl=[];
var thirdcookiesflag=false;
var thirdcookies_bl=[];
var thirdcookies_wl=[];
var autofillflag=false;
var autofill_bl=[];
var autofill_wl=[];
var safeBrowsingEnabledflag=false;
var safeBrowsingEnabled_bl=[];
var safeBrowsingEnabled_wl=[];
var passwordSavingEnabledflag=false;
var passwordSavingEnabled_bl=[];
var passwordSavingEnabled_wl=[];
var doNotTrackEnabledflag=false;
var doNotTrackEnabled_bl=[];
var doNotTrackEnabled_wl=[];
var tabflag=true;
var maxtabs=['6'];
var iframeflag=false;
var iframe_bl=[];
var iframe_wl=[];
var cookiesflag=false;
var cookies_bl=[];
var cookies_wl=[];
var sensitiveflag=false;
var sensitive_bl=[];
var sensitive_wl=[];
var HttpOnlycookiesflag=false;
var HttpOnlycookies_bl=[];
var HttpOnlycookies_wl=[];
/*
document.getElementById("UAstatus").innerText = UAflag + " deny:   " + UA_bl+ " allow:  "  + UA_wl;
document.getElementById("refererstatus").innerText = refererflag+ " deny:   " + referer_bl+" allow:  "  + referer_wl;
document.getElementById("httpsstatus").innerText = httpflag+ "   "  ;
document.getElementById("imagestatus").innerText = imageflag+ " deny:   " + image_bl+ " allow:  "  + image_wl;
document.getElementById("objectstatus").innerText = objectflag+ " deny:   "  + object_bl+ " allow:  "  + object_wl;
document.getElementById("iframestatus").innerText = iframeflag+ " deny:   " + iframe_bl+ " allow:  "  + iframe_wl;
document.getElementById("XHRstatus").innerText = XHRflag+ " deny:   " + XHR_bl+ " allow:  "  + XHR_wl;
document.getElementById("scriptstatus").innerText = jsflag+ " deny:   "  + js_bl+ " allow:  "  + js_wl;
document.getElementById("mediastatus").innerText = mediaflag+ " deny:   " + media_bl+ " allow:  "  + media_wl;
document.getElementById("fontstatus").innerText = fontflag+ " deny:   " + font_bl+ " allow:  "  + font_wl;
document.getElementById("appstatus").innerText = appflag+ "   "  + app_bl;
document.getElementById("exestatus").innerText = exeflag+ "   "  + exe_bl;
document.getElementById("blockURLstatus").innerText =blockflag;
document.getElementById("listofURL").innerText = blocked_bl;
document.getElementById("whitelist").innerText = white_list;
document.getElementById("httponlycookiestatus").innerText = HttpOnlycookiesflag+ " deny:   " + HttpOnlycookies_bl+ " allow:  "  + HttpOnlycookies_wl;
document.getElementById("cookiestatus").innerText = thirdcookiesflag+ " deny:   "  + thirdcookies_bl+" allow:  "  + thirdcookies_wl;
document.getElementById("autofillstatus").innerText = autofillflag+ "  deny:   "  + autofill_bl+ " allow:  "  + autofill_wl;
document.getElementById("safebrowsingstatus").innerText = safeBrowsingEnabledflag+ " deny:  "  + safeBrowsingEnabled_bl+ " allow:  "  + safeBrowsingEnabled_wl;
document.getElementById("passwordSavingEnabledstatus").innerText = passwordSavingEnabledflag+ " deny:  "  + passwordSavingEnabled_bl+ "  allow: "  + passwordSavingEnabled_wl;
document.getElementById("doNotTrackEnabledstatus").innerText = doNotTrackEnabledflag+ " deny:  "  + doNotTrackEnabled_bl+ "  allow: "  + doNotTrackEnabled_wl;
document.getElementById("webRTCstatus").innerText = webRTCflag+ " deny:  "  + webRTC_bl+ " allow:  "  + webRTC_wl;
document.getElementById("maxtabstatus").innerText = tabflag + " Limit " + maxtabs;
*/

var row = document.getElementById("https");
row.insertCell(0).innerText = "Non https connection";
row.insertCell(1).innerText = httpflag;
row.insertCell(2).innerText = non_https_bl;
row.insertCell(3).innerText = non_https_wl;

var row = document.getElementById("script");
row.insertCell(0).innerText = "JavaScript requests";
row.insertCell(1).innerText = jsflag;
row.insertCell(2).innerText = js_bl;
row.insertCell(3).innerText = js_wl;

var row = document.getElementById("image");
row.insertCell(0).innerText = "Image requests";
row.insertCell(1).innerText = imageflag;
row.insertCell(2).innerText = image_bl;
row.insertCell(3).innerText = image_wl;

var row = document.getElementById("media");
row.insertCell(0).innerText = "Media requests";
row.insertCell(1).innerText = mediaflag;
row.insertCell(2).innerText = media_bl;
row.insertCell(3).innerText = media_wl;

var row = document.getElementById("iframe");
row.insertCell(0).innerText = "Iframe requests";
row.insertCell(1).innerText = iframeflag;
row.insertCell(2).innerText = iframe_bl;
row.insertCell(3).innerText = iframe_wl;

var row = document.getElementById("XMLhttprequests");
row.insertCell(0).innerText = "XMLhttprequests requests";
row.insertCell(1).innerText = XHRflag;
row.insertCell(2).innerText = XHR_bl;
row.insertCell(3).innerText = XHR_wl;

var row = document.getElementById("font");
row.insertCell(0).innerText = "Font requests";
row.insertCell(1).innerText = fontflag;
row.insertCell(2).innerText = font_bl;
row.insertCell(3).innerText = font_wl;

var row = document.getElementById("access");
row.insertCell(0).innerText = "Access";
row.insertCell(1).innerText = blockflag;
row.insertCell(2).innerText = blocked_bl;
row.insertCell(3).innerText = white_list;

var row = document.getElementById("maxtabs");
row.insertCell(0).innerText = "Max tab limit set";
row.insertCell(1).innerText = tabflag;
row.insertCell(2).innerText = maxtabs;
row.insertCell(3).innerText = "NA";

var row = document.getElementById("app");
row.insertCell(0).innerText = "Application downloads";
row.insertCell(1).innerText = appflag;
row.insertCell(2).innerText = app_bl;
row.insertCell(3).innerText = app_wl;

var row = document.getElementById("exe");
row.insertCell(0).innerText = "Execuatble downloads";
row.insertCell(1).innerText = exeflag;
row.insertCell(2).innerText = exe_bl;
row.insertCell(3).innerText = exe_wl;

var row = document.getElementById("HttpOnlyCookie");
row.insertCell(0).innerText = "Set HttpOnlyCookie";
row.insertCell(1).innerText = HttpOnlycookiesflag;
row.insertCell(2).innerText = HttpOnlycookies_bl;
row.insertCell(3).innerText = HttpOnlycookies_wl;

var row = document.getElementById("cookie");
row.insertCell(0).innerText = "Cookie information";
row.insertCell(1).innerText = cookiesflag;
row.insertCell(2).innerText = cookies_bl;
row.insertCell(3).innerText = cookies_wl;

var row = document.getElementById("UA");
row.insertCell(0).innerText = "User-Agent information";
row.insertCell(1).innerText = UAflag;
row.insertCell(2).innerText = UA_bl;
row.insertCell(3).innerText = UA_wl;

var row = document.getElementById("referer");
row.insertCell(0).innerText = "Referer information";
row.insertCell(1).innerText = refererflag;
row.insertCell(2).innerText = referer_bl;
row.insertCell(3).innerText = referer_wl;

var row = document.getElementById("3pcookie");
row.insertCell(0).innerText = "Third party cookie enabled";
row.insertCell(1).innerText = thirdcookiesflag;
row.insertCell(2).innerText = thirdcookies_bl;
row.insertCell(3).innerText = thirdcookies_wl;

var row = document.getElementById("autofill");
row.insertCell(0).innerText = "Autofill enabled";
row.insertCell(1).innerText = autofillflag;
row.insertCell(2).innerText = autofill_bl;
row.insertCell(3).innerText = autofill_wl;


var row = document.getElementById("safebrowsing");
row.insertCell(0).innerText = "Safe Browsing enabled";
row.insertCell(1).innerText = safeBrowsingEnabledflag;
row.insertCell(2).innerText = safeBrowsingEnabled_bl;
row.insertCell(3).innerText = safeBrowsingEnabled_wl;

var row = document.getElementById("passwordSavingEnabled");
row.insertCell(0).innerText = "Password Saving  enabled";
row.insertCell(1).innerText = passwordSavingEnabledflag;
row.insertCell(2).innerText = passwordSavingEnabled_bl;
row.insertCell(3).innerText = passwordSavingEnabled_wl;


var row = document.getElementById("webRTC");
row.insertCell(0).innerText = "webRTC enabled";
row.insertCell(1).innerText = webRTCflag;
row.insertCell(2).innerText = webRTC_bl;
row.insertCell(3).innerText = webRTC_wl;


var row = document.getElementById("DNTEnabled");
row.insertCell(0).innerText = "doNotTrack enabled";
row.insertCell(1).innerText = doNotTrackEnabledflag;
row.insertCell(2).innerText = doNotTrackEnabled_bl;
row.insertCell(3).innerText = doNotTrackEnabled_wl;

