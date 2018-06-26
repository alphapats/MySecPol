var webRTCflag=localStorage.getItem('webRTCbox');
var webRTC_bl=JSON.parse(localStorage.getItem('webRTC_bl'));
var webRTC_wl=JSON.parse(localStorage.getItem('webRTC_wl'));
var thirdcookiesflag=localStorage.getItem('thirdcookies');
var thirdcookies_bl=JSON.parse(localStorage.getItem('thirdcookies_bl'));
var thirdcookies_wl=JSON.parse(localStorage.getItem('thirdcookies_wl'));
var autofillflag=localStorage.getItem('autofill');
var autofill_bl=JSON.parse(localStorage.getItem('autofill_bl'));
var autofill_wl=JSON.parse(localStorage.getItem('autofill_wl'));
var safebrowsingflag= localStorage.getItem('safeBrowsingEnabled');
var safeBrowsingEnabled_bl=JSON.parse(localStorage.getItem('safeBrowsingEnabled_bl'));
var safeBrowsingEnabled_wl=JSON.parse(localStorage.getItem('safeBrowsingEnabled_wl'));
var passwordSavingEnabledflag=localStorage.getItem('passwordSavingEnabled');
var passwordSavingEnabled_bl=JSON.parse(localStorage.getItem('passwordSavingEnabled_bl'));
var passwordSavingEnabled_wl=JSON.parse(localStorage.getItem('passwordSavingEnabled_wl'));
var doNotTrackEnabledflag=localStorage.getItem('doNotTrackEnabled');
var doNotTrackEnabled_bl=JSON.parse(localStorage.getItem('doNotTrackEnabled_bl'));
var doNotTrackEnabled_wl=JSON.parse(localStorage.getItem('doNotTrackEnabled_wl'));

if(autofillflag=="true"){
chrome.privacy.services.autofillEnabled.get({}, function(details) {
        if (details.levelOfControl === 'controllable_by_this_extension') {
          if(autofill_wl==="<all_urls>"){
          chrome.privacy.services.autofillEnabled.set({ value: true }, function() {
            if (chrome.runtime.lastError === undefined)
              console.log("Hooray, it worked! for autofillflag =true");
            else
              console.log("Sadness!", chrome.runtime.lastError);
          });
        }
        else{
          chrome.privacy.services.autofillEnabled.set({ value: false }, function() {
            if (chrome.runtime.lastError === undefined)
              console.log("Hooray, it worked! for autofillflag =false");
            else
              console.log("Sadness!", chrome.runtime.lastError);
          });

        }

        }
      });
}

if(thirdcookiesflag=="true"){
chrome.privacy.websites.thirdPartyCookiesAllowed.get({}, function(details) {
        if (details.levelOfControl === 'controllable_by_this_extension') {
          if(thirdcookies_wl==="<all_urls>"){
            chrome.privacy.websites.thirdPartyCookiesAllowed.set({ value: true}, function() {
            if (chrome.runtime.lastError === undefined)
              console.log("Hooray, it worked! for thirdPartyCookiesAllowed");
            else
              console.log("Sadness!", chrome.runtime.lastError);
          });

          }
          else{
            chrome.privacy.websites.thirdPartyCookiesAllowed.set({ value: false }, function() {
            if (chrome.runtime.lastError === undefined)
              console.log("Hooray, it worked! for cookieflag =false");
            else
              console.log("Sadness!", chrome.runtime.lastError);
          });

          }
          
        }
      });
}


if(webRTCflag=="true"){

if(webRTC_bl=="<all_urls>"){
/* Configure WebRTC leak prevention default setting */
chrome.storage.local.get(null, function(items){
      if(items.rtcIPHandling != 'default_public_interface_only'){
      try{
        chrome.storage.local.set({
          rtcIPHandling: 'default_public_interface_only'
        }, function(){
          chrome.privacy.network.webRTCIPHandlingPolicy.set({
            value: 'default_public_interface_only'
          });
        })
      }
      catch(e){
        console.log("Error: " + e.message);
      }
  }
})
}
else
{
  chrome.storage.local.set({
          rtcIPHandling: "default"
        }, function(){
          chrome.privacy.network.webRTCIPHandlingPolicy.set({
            value: "default"
          });
        })

}
}

if(safebrowsingflag=="true"){
chrome.privacy.services.safeBrowsingEnabled.get({}, function(details) {
        if (details.levelOfControl === 'controllable_by_this_extension') {
          if(safeBrowsingEnabled_wl=="<all_urls>"){
            chrome.privacy.services.safeBrowsingEnabled.set({ value: true}, function() {
            if (chrome.runtime.lastError === undefined)
              console.log("Hooray, it worked! for safeBrowsingEnabled");
            else
              console.log("Sadness!", chrome.runtime.lastError);
          });

          }
          else{
            chrome.privacy.services.safeBrowsingEnabled.set({ value: false }, function() {
            if (chrome.runtime.lastError === undefined)
              console.log("Hooray, it worked! for safebrowsingflag =false");
            else
              console.log("Sadness!", chrome.runtime.lastError);
          });

          }
          
        }
      });
}

if(passwordSavingEnabledflag=="true"){
chrome.privacy.services.passwordSavingEnabled.get({}, function(details) {
        if (details.levelOfControl === 'controllable_by_this_extension') {
          if(passwordSavingEnabled_wl=="<all_urls>"){
            chrome.privacy.services.passwordSavingEnabled.set({ value: true}, function() {
            if (chrome.runtime.lastError === undefined)
              console.log("Hooray, it worked! for passwordsavingenabled ");
            else
              console.log("Sadness!", chrome.runtime.lastError);
          });

          }
          else{
            chrome.privacy.services.passwordSavingEnabled.set({ value: false }, function() {
            if (chrome.runtime.lastError === undefined)
              console.log("Hooray, it worked! for passwordsavingflag =false");
            else
              console.log("Sadness!", chrome.runtime.lastError);
          });

          }
          
        }
      });
}


if(doNotTrackEnabledflag=="true"){
chrome.privacy.websites.doNotTrackEnabled.get({}, function(details) {
        if (details.levelOfControl === 'controllable_by_this_extension') {
          if(doNotTrackEnabled_wl=="<all_urls>"){
            chrome.privacy.websites.doNotTrackEnabled.set({ value: true}, function() {
            if (chrome.runtime.lastError === undefined)
              console.log("Hooray, it worked! for doNotTrackEnabled");
            else
              console.log("Sadness!", chrome.runtime.lastError);
          });

          }
          else{
            chrome.privacy.websites.doNotTrackEnabled.set({ value: false}, function() {
            if (chrome.runtime.lastError === undefined)
              console.log("Hooray, it worked! for DNTflag =false");
            else
              console.log("Sadness!", chrome.runtime.lastError);
          });

          }
          
        }
      });
}