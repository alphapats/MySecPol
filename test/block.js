/*
File: block.js
Author: Amit Pathania
*/

//Setting flag, white-list and black-list for fields

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


//Strips http or https from URL
function strip_http(url){
  /* Remove http from URL */
  if (url.indexOf("http://") != -1){
    url = url.substr("http://".length);
  }
  /* Remove https from URL */
  if (url.indexOf("https://") != -1){
    url = url.substr("https://".length);
  }
  return url;
}

//checks for crossdomain or crossdomain- in the blacklist
function check_wildchar(bl){
   var index = bl.indexOf("crossdomain"); 
   var index2 = bl.indexOf("crossdomain-");
   if(index>-1){
     bl.splice(index, 1);
   }
    if(index2>-1){
     bl.splice(index2, 1);

   }

   if((index>-1) || (index2>-1)){

      return true;
   }

   return false;

}

//checks whether given request is to same domain or different domain
function check_xdomain(details,wl){
  var s_source = details.url.split("://");
  var s_source1=s_source[1].split("/")
  var s_source2=s_source1[0].split(".");
  script_source=s_source2[1]+"."+s_source2[2];
          //alert(script_source);
   var flag_wl=false;   

   //check whether whitelist is empty
   if (typeof wl !== 'undefined' && wl.length > 0) {
       var wl_len=wl.length;

      for (i = 0; i < wl_len; i++) {
        flag_wl=wl[i].search(script_source);
          if(flag_wl)
          {          
            return flag_wl;
          }
          }

   }
   var referer_value="dummy";
  for (var i = 0; i < details.requestHeaders.length; ++i) {
    if (details.requestHeaders[i].name.toLowerCase() === 'referer')
      {
        var r_value=details.requestHeaders[i].value.split("://");
        var r_domain=r_value[1].split("/");
        var r_value2=r_domain[0].split(".");
        referer_value=r_value2[1]+"."+r_value2[2];
            
      }
      }  
     var result= referer_value.search(script_source);
     //alert(referer_value+script_source+result);
     return result;

}

//checks and whitelists the requets made by our extension
function check_extn(url){
   url=strip_http(url);
  var s=url.split("/");
  url = "*://"+s[0]+"/*";
  if (url=="*://chrome-extension:/*"){
       return true;
  }
 return false;
}

//function to strip additonal RegEx charcters from whitelist
function strip_whitelist(wl){
  var wl_len=wl.length;
  var strip_wl=[]
  
  for (var i = 0; i < wl_len; i++) {
    if(wl[i]=="<all_urls>"){
      strip_wl.push(wl[i]) ;
    }
    else{
      
        var temp2=wl[i].split('*://*.');
        if(typeof temp2[1] ==='undefined'){
           temp2=wl[i].split('*://.');
        }
         if(typeof temp2[1] ==='undefined'){
           temp2=wl[i].split('www.');
        }
         if(typeof temp2[1] !=='undefined'){
           var temp3=temp2[1].split("/*");
             if(typeof temp3[1] ==='undefined'){
            temp3=temp2[1].split("/");
            }
            if(typeof temp3[0] !=='undefined'){
            strip_wl.push(temp3[0]) ;
            }
        }
       }
    }
  
return strip_wl;
}

//Disables inline scripts by adding CSP headers
function CSP_filterJS(details) {
  //strips additional characters
  var strip_wl=strip_whitelist(wl);
  // check for whitelist
  var wl_flag=check_white_list(details.url,strip_wl);
    if(!wl_flag){
      var headers = details.responseHeaders;
      var jLen=headers.length;
      var flag=false;
        for (var j = 0; j !== jLen; ++j) {
          var header = headers[j];
          var name = header.name.toLowerCase();
            

            if (name !== "content-security-policy" &&
                name !== "x-webkit-csp") {
                continue;
            }
            else
            {
              flag=true;
              alert(header.value);
              var n = header.value.search("script-src");
              
              if(n<0)
              {
                header.value =header.value+ "script-src 'none'";
              }

              header.value=header.value.replace("'unsafe-inline'","");
              header.value=header.value.replace("'unsafe-eval'","");
              
              } 
                       
            }
            
           
        if(!flag){
          var element = {};
          var new_csp_header="content-security-policy";
          var new_csp_value="script-src 'none'";
          element.name=new_csp_header;
          element.value=new_csp_value;
          headers.push(element); 
            }
      }
       
 return {responseHeaders: headers};
    
}

//Disables cross origin scripts by adding CSP headers
function CSP_crossoriginJS(details) {
        var headers = details.responseHeaders;
        var jLen=headers.length;
        var flag=false;
        for (var j = 0; j !== jLen; ++j) {
            var header = headers[j];
            var name = header.name.toLowerCase();
            

            if (name !== "content-security-policy" &&
                name !== "x-webkit-csp") {
                continue;
            }
            else
            {
              flag=true;
              //alert(header.value);
              var n = header.value.search("script-src");
              
              if(n<0)
              {
                header.value =header.value+ "script-src 'self'";
              }
            
              //header.value=header.value.replace("'unsafe-inline'","");
             // header.value=header.value.replace("'unsafe-eval'","");
              
            }
                       
            }
            
           
            if(!flag){
              var element = {};
              var new_csp_header="content-security-policy";
              var new_csp_value="script-src 'self'";
              element.name=new_csp_header;
              element.value=new_csp_value;
              headers.push(element);
              
            }
        return {responseHeaders: headers};
    
}

//Disables iframes by adding x-frame option headers
function add_xframe(details) {
        var headers = details.responseHeaders;
        var jLen=headers.length;
        var flag=false;
        for (var j = 0; j !== jLen; ++j) {
            var header = headers[j];
            var name = header.name.toLowerCase();
            

            if (name !== "x-frame-options") {
                continue;
            }
            else
            {
              flag=true;
              //alert(header.value);
            
              header.value ="DENY";
             
              
            }
                       
            }
            
           
            if(!flag){
              var element = {};
              var new_csp_header="x-frame-options";
              var new_csp_value="DENY";
              element.name=new_csp_header;
              element.value=new_csp_value;
              headers.push(element);
              
            }
        return {responseHeaders: headers};
    
}


//Set Set-Cookie resposne header to HttpOnly
function set_cookieHttpOnly(details) {
    var headers = details.responseHeaders;
    var jLen=headers.length;
    var flag=false;
    for (var j = 0; j !== jLen; ++j) {
      var header = headers[j];
      var name = header.name.toLowerCase();
        if (name !== "set-cookie") {
          continue;
            }
        else{
          flag=true;
          //alert(header.value);
          header.value =header.value+"; HttpOnly"; 
          //alert(header.value);
        }          
        }
  return {responseHeaders: headers};
    
}



//function to calculate match for sensitive URLs to protect against phishing
function match_sensitive(details,wl){
  url=strip_http(details);
  //alert("url"+url);
  var s=url.split("/");
  //alert("s[0]"+s[0]);
  //url = "*://"+s[0]+"/*";
  var sensitive=false;
  var wl_len=wl.length;
  var match=[];
  
   for (var i = 0; i < wl_len; i++) {
        var wl_url=wl[i];
        var str_len=wl_url.length;
        if(str_len>(s[0].length))
          {
            len=str_len;
          }
        else{
          len=(s[0].length)
          }
         var count=0;
    
        for (j=0;j<len;j++)
          {
            if (wl_url[j]===s[0][j])
              {
                count=count+1;
              }
      
          }
     match.push((count/len)*100);


  }
 
 for(var i = 0; i < wl_len; i++){
 
    if (match[i]>50 && match[i]!=100){
      //sensitive=true;
      //alert("Given domain" + s[0] +" matches your sensitive domain " + wl[i] + ",match%" + match[i])
      var r = confirm("Given domain " + s[0] +" matches your sensitive domain " + wl[i] + " ,match " + match[i] + "%. Do you want to continue?");
      sensitive=!r;
    }

 }

return  sensitive;

}


//returns true if domain in whitelist
function check_white_list(url,wl){
  url=strip_http(url);
  var s=url.split("/");
  url = "*://"+s[0]+"/*";
  
  if (url=="*://chrome-extension:/*"){
    return false;
  }

  
  //check whether whitelist is empty
   if (typeof wl !== 'undefined' && wl.length > 0) {
     
      
      var wl_len=wl.length;
      var flag_wl=false;
      for (var i = 0; i < wl_len; i++) {

        var wl_url=wl[i];
        var p= new RegExp(wl_url, 'i');
        flag_wl=p.test(s[0]);
               
          if(flag_wl)
          {
           
            return flag_wl;
          }
          }
   }
return flag_wl;
}


//function to monitor requests
function monitor_request(type,wl,bl){

  var strip_wl=strip_whitelist(wl);
 //check blacklist for crossdomain or crossdomain- 
 var wildcard_flag= check_wildchar(bl);
  //cancel requests to blacklisted URLs
 if (bl.length > 0) {
    chrome.webRequest.onBeforeRequest.addListener(
      function(details) { 
        var denyrequest=true;
        // check for whitelist
        var wl_flag=check_white_list(details.url,strip_wl);
        if(check_extn(details.url)){
          denyrequest=false;
        }
        else if(wl_flag === true)
        {
          denyrequest=false;
          alert("Permitted request type "+ type +" :  " + details.url);
        }
        else{
           alert("blocking request type "+ type +" :  " + details.url);
         }
    return {cancel: denyrequest}; },
  // filters
  {
    urls: bl,
    types: [type]
  },
  // extraInfoSpec
  ["blocking"]);

  if(type==="script"){
     chrome.webRequest.onHeadersReceived.addListener(CSP_filterJS, {
    urls: js_bl,
    types: ["main_frame", "sub_frame"]
    }, ["blocking", "responseHeaders"]);
  }

  if(type==="sub_frame"){
    chrome.webRequest.onHeadersReceived.addListener(add_xframe, {
     urls: iframe_bl,
     types: ["main_frame", "sub_frame"]}, 
     ["blocking", "responseHeaders"]);
  }
   

}
   
//cancel image requests to cross-origin domains
if(wildcard_flag)
{
  chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
            //check if given domain is cross-domain
            var flag= check_xdomain(details);
            //check whether this crossdomain is in whitelist
            var flag2=check_white_list(details.url,strip_wl);
          if(flag>-1 || flag2 === true)
            {
               alert("Permitted request type "+ type +" :  " + details.url);
            }
         else
            {
               alert("crossdomain request type "+ type +" :  " + details.url);        
              return {cancel: true};
            }



          //alert("script source:"+details.url);              
        },
        {urls: ["<all_urls>"], types: [type]},
        ["blocking", "requestHeaders"]);
   }


}

function monitor_responses(type,wl,bl){
  var strip_wl=strip_whitelist(wl);
  //check blacklist for crossdomain or crossdomain- 
 var wildcard_flag= check_wildchar(bl);
  //cancel requests to blacklisted URLs
 if (bl.length > 0) {
  chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
          for (var i = 0; i < details.responseHeaders.length; ++i) {
            if(details.responseHeaders[i].name.toLowerCase() == 'content-type') {
              var headervalue=(details.responseHeaders[i].value.toLowerCase());
              //alert(headervalue);
              var app= headervalue.search(type)
              if(app >-1){
              //if (details.responseHeaders[i].value.toLowerCase() == 'application/octect-stream'){

               alert("blocking  "+details.responseHeaders[i].value);
              //details.responseHeaders.splice(i, 1);
              return {cancel: true};
              break;
            }
          }
          }
          return {responseHeaders: details.responseHeaders};
        },
  // filters
  {
    urls: bl,
    
  },
  // extraInfoSpec
  ["blocking","responseHeaders"]);
}
   
//cancel responses to cross-origin domains
if(wildcard_flag)
{
  chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
          var flag= check_xdomain(details);
            //check whether this crossdomain is in whitelist
           var flag2=check_white_list(details.url,strip_wl);
          if(flag>-1 || flag2 === true)
            {
               alert("Permitted response type "+ type +" :  " + details.url);
            }
          else{
              for (var i = 0; i < details.responseHeaders.length; ++i) {
                  if(details.responseHeaders[i].name.toLowerCase() == 'content-type') {
                     var headervalue=(details.responseHeaders[i].value.toLowerCase());
                      //alert(headervalue);
                      var app= headervalue.search(type)
                        if(app >-1){
                        //if (details.responseHeaders[i].value.toLowerCase() == 'application/octect-stream'){
                        alert("blocking  "+details.responseHeaders[i].value);
                        //details.responseHeaders.splice(i, 1);
            return {cancel: true};
            break;
            }
          }
          }

          }
         
          return {responseHeaders: details.responseHeaders};
        },
      // filters
      {
      urls: ["<all_urls>"], },
      // extraInfoSpec
      ["blocking","responseHeaders"]);
  }
}


//function to modify request headers
function modify_request(header_value,wl,bl){

  var strip_wl=strip_whitelist(wl);
 //check blacklist for crossdomain or crossdomain- 
 var wildcard_flag= check_wildchar(bl);
 //cancel requests to blacklisted URLs
 if (bl.length > 0) {
    chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
      // check for whitelist
      var wl_flag=check_white_list(details.url,strip_wl);
      if(wl_flag === true){
          alert("Permitted request header  "+ header_value + " for "+ details.url);
        }
      else{
         for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === header_value) {
              alert("blocking header "+ header_value +" : "+ details.requestHeaders[i].value+ " for "+details.url );
              details.requestHeaders.splice(i, 1);
            
              break;
            }
          }
      }
      return {requestHeaders: details.requestHeaders};
    },
    // filters
    { urls: bl },
    // extraInfoSpec
    ["blocking", "requestHeaders"]);
  } 

  //modify headers requests to cross-origin domains
if(wildcard_flag)
{
  chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
          var flag= check_xdomain(details);
          //check whether this crossdomain is in whitelist
          var flag2=check_white_list(details.url,strip_wl);
          if(flag>-1 || flag2 === true)
            {
               alert("Permitted request header  "+ header_value + " for "+ details.url);
            }
          else{
              for (var i = 0; i < details.requestHeaders.length; ++i) {
                  if (details.requestHeaders[i].name === header_value) {
                      alert("blocking header "+ header_value +" : "+ details.requestHeaders[i].value+ " for "+details.url );
                      details.requestHeaders.splice(i, 1);
            
              break;
            }
          }
        }
          return {requestHeaders: details.requestHeaders};
      },
      // filters
      {
      urls: ["<all_urls>"], },
      // extraInfoSpec
      ["blocking","requestHeaders"]);
  }
}

//function to remove all cookies
function deletecookie(cookie) {
  var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
  chrome.cookies.remove({"url": url, "name": cookie.name});
};




//Monitors image requests when flag is set
if (imageflag) {
  monitor_request("image",image_wl,image_bl);

}

//Monitors script requests when flag is set
if (jsflag) {
   monitor_request("script",js_wl,js_bl);
}

//Monitors font requests when flag is set
if (fontflag) {
  monitor_request("font",font_wl,font_bl);
  
}

//Monitors object requests when flag is set
if (objectflag) {
  monitor_request("object",object_wl,object_bl);
}

//Monitors XMLHttpRequests when flag is set
if (XHRflag) {
  monitor_request("xmlhttprequest",XHR_wl,XHR_bl);

}

//Monitors stylesheets requests when flag is set
if (stylesheetflag) {
  monitor_request("stylesheet",stylesheet_wl,stylesheet_bl);

}

//Monitors media requests when flag is set
if (mediaflag) {
  monitor_request("media",media_wl,media_bl);

}

//Monitors iframe requests when flag is set
if (iframeflag) {
  monitor_request("sub_frame",iframe_wl,iframe_bl);

}

//create blacklist 
if(blockflag)
{
   var strip_wl=strip_whitelist(white_list);
  
  chrome.webRequest.onBeforeRequest.addListener(
        function(details) { 
        var denyrequest=true;
        if(check_extn(details.url)){
          denyrequest=false;
        }
        else{
           denyrequest=!(check_white_list(details.url, strip_wl));
        }
        return {cancel: denyrequest}; },
        {urls: blocked_bl},
        ["blocking"]);

}

//Monitors responses for application payload when flag is set
if (appflag) {
  monitor_responses("application",app_wl,app_bl); 

}

//Monitors responses for executable application payload when flag is set
if (exeflag) {
  monitor_responses("application/octet-stream",exe_wl,exe_bl); 

}

//blocking non https connections
if (httpflag) {
  var strip_wl=strip_whitelist(non_https_wl);
  chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
        var denyrequest=true;
        if(check_extn(details.url)){
          denyrequest=false;
        }
        else{
           denyrequest=!(check_white_list(details.url, strip_wl));
        }
        return {cancel: denyrequest};  },
        {urls: non_https_bl},
        ["blocking"]);
}

//modify header to remove user-agent value
if(UAflag){
  modify_request("User-Agent",UA_wl,UA_bl);
}

//modify header to remove referer value
if(refererflag){
  modify_request("referer",referer_wl,referer_bl);
}

//modify header to remove cookie values
if (cookiesflag) {
  modify_request("cookie",cookies_wl,cookies_bl);
}



//set HttpOnly Cookies for all domains given in whitelist
if(HttpOnlycookiesflag){
  //first it will delete all cookies
  chrome.cookies.getAll({},function (all_cookies) {
            var count = all_cookies.length;
            for (var i = 0; i < count; i++) {
                deletecookie(all_cookies[i]);
            }
});

  //all cookies will be set with HttpOnly
  chrome.webRequest.onHeadersReceived.addListener(set_cookieHttpOnly, {
    urls: HttpOnlycookies_wl,
    types: ["main_frame", "sub_frame"]
    }, ["blocking", "responseHeaders"]);
}

//prevent phishing attacks by URL matching
if (sensitiveflag) {
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) { 
      var denyrequest=true;
      var sensitivity=match_sensitive(details.url,sensitive_wl);
        if(!sensitivity){
          denyrequest=false;
        }
        else{
          //alert("Phishing possible. Blocking");
        }
    return {cancel: denyrequest}; },
    // filters
    {
    urls: ["<all_urls>"]
    },
    // extraInfoSpec
    ["blocking"]);  
}
