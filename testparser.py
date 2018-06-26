#import numpy as np
import collections
import csv
import sys,re

#define set of keywords/fields as per MySecPol specifications
Keywords=['image','javascript','access','XMLhttprequest','http','object','iframe','stylesheet','executable','downloads',
'user-agent','referer', 'maxtabs','font','media','Httponlycookies','auth-info','cookies','thirdpartycookies',
'autofill','safeBrowsingEnabled','passwordSavingEnabled','doNotTrackEnabled','webRTC', 'sensitive']

#define keywords for privacy settings
pr_settings=['thirdpartycookies','autofill','safeBrowsingEnabled','passwordSavingEnabled','doNotTrackEnabled','webRTC']

#initilase empty policy
Pol_list=[]

#deine structure rule to copy each rule from policy
rule = collections.namedtuple('rule', 'action field URL')

#define structure 'policy' for policy implemented by the browser
policy=collections.namedtuple('policy', 'fieldname flag wl bl')

#initlaise variables for each field as defined in MySecPol
#For each field, set flag as false, blacklist and whitelist to null
for i in Keywords:
	i=policy(i,False,[],[]) 
	Pol_list.append(i)


#function checks whether field is valid field or not
def check_field(field):
	for i in Keywords:
		if(field.lower()  == i.lower()):
			return True
	return False

'''
def get_field(field):
	for i in Keywords:
		if(field.lower()  == i.lower()):
			return i
'''

#function checks whether the rule for given field is already defined or not by checking the flag for that field
def chk_set_flag(field_name):
	for i in Pol_list:
		if(i.fieldname.lower() == field_name.lower()):
			if(i.flag==True):
				return False
			else:
				return True

#function sets the flag to true once the rule for given field is defined in the policy
def change_flag(field_name):
	for i in Pol_list:
		if (i.fieldname.lower() == field_name.lower()):
			temp=i
			Pol_list.remove(i)
			temp=temp._replace(flag=True)
			Pol_list.append(temp)

#function sets the flag for browser privacy setings as defined in the policy	
def set_pr_falg(field_name,flagval):
	for i in Pol_list:
		if (i.fieldname.lower() == field_name.lower()):
			temp=i
			Pol_list.remove(i)
			temp=temp._replace(flag=flagval)
			Pol_list.append(temp)

#function adds the domain to blacklist of given field
def append_bl(field_name,URL):
	for i in Pol_list:
		if i.fieldname.lower() == field_name.lower() :
			i.bl.append(URL)

#function adds the domain to whitelist of given field
def append_wl(field_name,URL):
	for i in Pol_list:
		if i.fieldname.lower() == field_name.lower() :
			i.wl.append(URL)


#function returns the value of the flag for the given field
def get_flag(field):
	for i in Pol_list:
		if(i.fieldname.lower()==field.lower()):
			return i.flag

#function returns blacklist for the given field
def get_bl(field):
	for i in Pol_list:
		if(i.fieldname.lower()==field.lower()):
			return i.bl

#function returns whitelist for the given field
def get_wl(field):
	for i in Pol_list:
		if(i.fieldname.lower()==field.lower()):
			return i.wl

#function checks whether the field exists in pr_settings list or not
def set_pr_setting(field):
	for i in pr_settings:
		if (field.lower()==i.lower()):
			return True
	return False

#remove duplicates
def remove_duplicates(l):
	final_list = []
	for item in l:
		if item not in final_list:
			final_list.append(item)
	return final_list
    
#check if domain exists in whitelist and blacklist of given field
def remove_common(wl,bl):
	wl_len=len(wl)
	bl_len=len(bl)
	if(wl_len>bl_len):
		max_len=wl_len
	else:
		max_len=bl_len
	common=[]
	for item1 in wl:
		for item2 in bl:
			if (item1 == item2):
				common.append(item1)
	return common

#function to check whether one rule is subset of other
def find_subset(mylist):
	striplist=[]
	templist=[]
	for item in mylist:
		try:
			temp=item.split("*://*")[1]
			striplist.append(temp)
		except:
			continue
	listlen=len(striplist)
	for i in range(0,listlen):
		for j in range(i+1,listlen):
			result=re.search(striplist[i],striplist[j])
			result2=re.search(striplist[j],striplist[i])
			if(result):
				templist.append("*://*"+striplist[j])
			if(result2):
				templist.append("*://*"+striplist[i])
	for ele in templist:
		try:
			mylist.remove(ele)
		except:
			continue
	return(mylist)

#function to resolve conflict between access field and other resources 
def conflict_access(mylist):
	for i in mylist:
		if(i.fieldname=="access"):
			whitelist=i.wl
			blacklist=i.bl
	for i in mylist:
		if(i.fieldname!="access"):
			common=remove_common(i.wl,blacklist)
			if(common !=[]):
				print("Policy ", i)
				print("Common in access and ",i.fieldname," WL :",common)
				for item in common:
					i.wl.remove(item)
	return mylist


#function to resolve conflicting rules
def resolve_conflicts(p_list):
	for i in p_list:
		if (('*' in i.bl) and (i.wl)):
			print("Error: ",i)
			i.wl.clear()
			print("Correction: ",i)
		if (('*' in i.wl) and (i.bl)):
			print("Error: ",i)
			i.wl.remove('*')
			print("Correction: ",i)	
		if (('crossdomain' in i.bl) and (i.wl)):
			print("Error: ",i)
			i.wl.clear()
			print("Correction: ",i)
	
	#removing duplicate entries in given list
	for i in p_list:
		temp=remove_duplicates(i.bl);
		temp2=find_subset(temp)
		i.bl.clear()
		for item in temp2:
			i.bl.append(item)
		temp3=remove_duplicates(i.wl);
		temp4=find_subset(temp3)
		i.wl.clear()
		for item in temp4:
			i.wl.append(item)

	#removing common entries in whitelist and blacklist for given field
	for i in p_list:
		common=remove_common(i.wl,i.bl);
		if(common !=[]):
			print("Policy ", i)
			print("Common in WL and BL ",common)
			for item in common:
				i.wl.remove(item)
	new_list=conflict_access(p_list)
	return new_list

#function to replace wild card * with <all_urls> (which is required by browser extension)
def remove_wildcard(p_list):
	for i in p_list:
		if i.fieldname != "http":
			if ('*' in i.bl):
				i.bl.remove('*')
				i.bl.clear()
				i.bl.append("<all_urls>")
			if ('*' in i.wl):
				i.wl.remove('*')
				i.wl.clear()
				i.wl.append("<all_urls>")
			if ('*-' in i.bl):
				i.bl.remove('*-')
				i.bl.clear()
				i.bl.append("<all_urls>")
			if ('*-' in i.wl):
				i.wl.remove('*-')
				i.wl.clear()
				i.wl.append("<all_urls>")
		if i.fieldname == "http":
			if ('*' in i.bl):
				i.bl.remove('*')
				i.bl.append("http://*/*")
			if ('*' in i.wl):
				i.wl.remove('*')
				i.wl.append("https://*/*")
			if ('*-' in i.bl):
				i.bl.remove('*-')
				i.bl.append("http://*/*")
			if ('*-' in i.wl):
				i.wl.remove('*-')
				i.wl.append("https://*/*")
	return p_list


#get filename from arguement
if len (sys.argv) != 2 :
    print ('Usage: python testparser.py policy_file' )
    sys.exit (1)

policy_file = sys.argv[1]

#Read rules defined in client policy file
try:
	data = open(policy_file, "r")
except IOError:
	print ("The file does not exist, Exit")
	sys.exit (1)

csv_dict = csv.DictReader(data, delimiter="\t", quotechar="\"")

for item in csv_dict:
	curr_rule=rule(item["action"], item["field"], item["URL"])
	if(check_field(curr_rule.field) ):
		field_name=curr_rule.field
		if((chk_set_flag(field_name))):
			change_flag(field_name)	
		if(curr_rule.action=="deny"):
			append_bl(field_name,item["URL"])
		if(curr_rule.action=="allow"):
			append_wl(field_name,item["URL"])
		
data.close()

#resolve conflicting rules
final_policy=resolve_conflicts(Pol_list)
#replace wild card * with <all_urls> (which is required by browser extension)
Pol_list=remove_wildcard(final_policy)

#writing policy to policy variable
policy_UA = "var UAflag="+ str(get_flag('user-agent')).lower()+ ";" + "\n" + "var UA_bl="+str(get_bl('user-agent'))+";"+ "\n" + "var UA_wl="+str(get_wl('user-agent'))+";"+ "\n"+ "\n"
policy_referer = "var refererflag="+ str(get_flag('referer')).lower()+ ";" + "\n" + "var referer_bl="+str(get_bl('referer'))+";"+ "\n" + "var referer_wl="+str(get_wl('referer'))+";"+ "\n"
policy_http = "var httpflag="+ str(get_flag('http')).lower()+ ";" + "\n" + "var non_https_bl="+str(get_bl('http'))+";"+ "\n" + "var non_https_wl="+str(get_wl('http'))+";"+ "\n"
policy_js= "var jsflag="+ str(get_flag('javascript')).lower()+ ";" + "\n" + "var js_bl="+str(get_bl('javascript'))+";"+ "\n" + "var js_wl="+str(get_wl('javascript'))+";"+ "\n"
policy_image = "var imageflag="+ str(get_flag('image')).lower()+ ";" + "\n" + "var image_bl="+str(get_bl('image'))+";"+ "\n" + "var image_wl="+str(get_wl('image'))+";"+ "\n"
policy_object = "var objectflag="+ str(get_flag('object')).lower()+ ";" + "\n" + "var object_bl="+str(get_bl('object'))+";"+ "\n" + "var object_wl="+str(get_wl('object'))+";"+ "\n"
policy_font = "var fontflag="+ str(get_flag('font')).lower()+ ";" + "\n" + "var font_bl="+str(get_bl('font'))+";"+ "\n" + "var font_wl="+str(get_wl('font'))+";"+ "\n"
policy_media = "var mediaflag="+ str(get_flag('media')).lower()+ ";" + "\n" + "var media_bl="+str(get_bl('media'))+";"+ "\n" + "var media_wl="+str(get_wl('media'))+";"+ "\n"
policy_stylesheet = "var stylesheetflag="+ str(get_flag('stylesheet')).lower()+ ";" + "\n" + "var stylesheet_bl="+str(get_bl('stylesheet'))+";"+ "\n" + "var stylesheet_wl="+str(get_wl('stylesheet'))+";"+ "\n"
policy_XMLhttprequest = "var XHRflag="+ str(get_flag('XMLhttprequest')).lower()+ ";" + "\n" + "var XHR_bl="+str(get_bl('XMLhttprequest'))+";"+ "\n" + "var XHR_wl="+str(get_wl('XMLhttprequest'))+";" +"\n"
policy_block_bl="var blockflag="+ str(get_flag('access')).lower()+ ";" + "\n" + "var blocked_bl="+str(get_bl('access'))+";"+ "\n" + "var white_list="+str(get_wl('access'))+";"+ "\n"
policy_exec="var exeflag="+ str(get_flag('executable')).lower()+ ";" + "\n" + "var exe_bl="+str(get_bl('executable'))+";"+ "\n" + "var exe_wl="+str(get_wl('executable'))+";"+ "\n"
policy_allapps="var appflag="+ str(get_flag('downloads')).lower()+ ";" + "\n" + "var app_bl="+str(get_bl('downloads'))+";"+ "\n" + "var app_wl="+str(get_wl('downloads'))+";"+"\n"
policy_webRTC="var webRTCflag="+ str(get_flag('webRTC')).lower()+ ";" + "\n" + "var webRTC_bl="+str(get_bl('webRTC'))+";"+ "\n"+ "var webRTC_wl="+str(get_wl('webRTC'))+";"+ "\n"
policy_3pcookies="var thirdcookiesflag="+ str(get_flag('thirdpartycookies')).lower()+ ";" + "\n" + "var thirdcookies_bl="+str(get_bl('thirdpartycookies'))+";"+ "\n"+ "var thirdcookies_wl="+str(get_wl('thirdpartycookies'))+";"+ "\n"
policy_autofill="var autofillflag="+ str(get_flag('autofill')).lower()+ ";" + "\n"  + "var autofill_bl="+str(get_bl('autofill'))+";"+ "\n"+ "var autofill_wl="+str(get_wl('autofill'))+";"+ "\n"
policy_safeBrowsingEnabled="var safeBrowsingEnabledflag="+ str(get_flag('safeBrowsingEnabled')).lower()+ ";" + "\n"  + "var safeBrowsingEnabled_bl="+str(get_bl('safeBrowsingEnabled'))+";"+ "\n"+ "var safeBrowsingEnabled_wl="+str(get_wl('safeBrowsingEnabled'))+";"+ "\n"
policy_passwordSavingEnabled="var passwordSavingEnabledflag="+ str(get_flag('passwordSavingEnabled')).lower()+ ";" + "\n" + "var passwordSavingEnabled_bl="+str(get_bl('passwordSavingEnabled'))+";"+ "\n"+ "var passwordSavingEnabled_wl="+str(get_wl('passwordSavingEnabled'))+";"+ "\n"
policy_doNotTrackEnabled="var doNotTrackEnabledflag="+ str(get_flag('doNotTrackEnabled')).lower()+ ";" + "\n" + "var doNotTrackEnabled_bl="+str(get_bl('doNotTrackEnabled'))+";"+ "\n"+ "var doNotTrackEnabled_wl="+str(get_wl('doNotTrackEnabled'))+";"+ "\n"
policy_maxtabs="var tabflag="+ str(get_flag('maxtabs')).lower()+ ";" + "\n" + "var maxtabs="+str(get_wl('maxtabs'))+";"+ "\n"
policy_iframe="var iframeflag="+ str(get_flag('iframe')).lower()+ ";" + "\n" + "var iframe_bl="+str(get_bl('iframe'))+";"+ "\n"+ "var iframe_wl="+str(get_wl('iframe'))+";"+ "\n"
policy_cookies="var cookiesflag="+ str(get_flag('cookies')).lower()+ ";" + "\n" + "var cookies_bl="+str(get_bl('cookies'))+";"+ "\n" + "var cookies_wl="+str(get_wl('cookies'))+";"+ "\n"
policy_sensitive="var sensitiveflag="+ str(get_flag('sensitive')).lower()+ ";" + "\n" + "var sensitive_bl="+str(get_bl('sensitive'))+";"+ "\n" + "var sensitive_wl="+str(get_wl('sensitive'))+";"+ "\n"
policy_HttpOnlycookies="var HttpOnlycookiesflag="+ str(get_flag('HttpOnlycookies')).lower()+ ";" + "\n" + "var HttpOnlycookies_bl="+str(get_bl('HttpOnlycookies'))+";"+ "\n" + "var HttpOnlycookies_wl="+str(get_wl('HttpOnlycookies'))+";"+ "\n"


print("***********************************************************")
print("*******************MySecPol********************************")
print("***********************************************************")
print(policy_UA)
print(policy_referer)
print(policy_http)
print(policy_js)
print(policy_image)
print(policy_object)
print(policy_font)
print(policy_stylesheet)
print(policy_media)
print(policy_XMLhttprequest)
print(policy_block_bl)
print(policy_exec)
print(policy_allapps)
print(policy_webRTC)
print(policy_3pcookies)
print(policy_autofill)
print(policy_safeBrowsingEnabled)
print(policy_doNotTrackEnabled)
print(policy_passwordSavingEnabled)
print(policy_maxtabs)
print(policy_iframe)
print(policy_cookies)
print(policy_sensitive)
print(policy_HttpOnlycookies)

#writing variable values as per policy into variable.js file
fname="test/variables.js"
	
with open(fname, 'w') as f:
	f.writelines(policy_UA)
	f.writelines("localStorage.setItem('UAbox', UAflag);"+ "\n")
	f.writelines("localStorage.setItem('UA_bl', JSON.stringify(UA_bl));"+ "\n")
	f.writelines(policy_referer)
	f.writelines("localStorage.setItem('refererbox', refererflag);"+ "\n")
	f.writelines("localStorage.setItem('referer_bl',JSON.stringify(referer_bl));"+ "\n")
	f.writelines(policy_http)
	f.writelines("localStorage.setItem('httpsbox', httpflag);"+ "\n")
	f.writelines("localStorage.setItem('non_https_bl', JSON.stringify(non_https_bl));"+ "\n")
	f.writelines(policy_js)
	f.writelines("localStorage.setItem('scriptbox', jsflag);"+ "\n")
	f.writelines("localStorage.setItem('js_bl', JSON.stringify(js_bl));"+ "\n")
	f.writelines(policy_image)
	f.writelines("localStorage.setItem('imagebox',imageflag);"+ "\n")
	f.writelines("localStorage.setItem('image_bl', JSON.stringify(image_bl));"+ "\n")
	f.writelines(policy_object)
	f.writelines("localStorage.setItem('objectbox',objectflag);"+ "\n")
	f.writelines("localStorage.setItem('object_bl', JSON.stringify(object_bl));"+ "\n")
	f.writelines(policy_font)
	f.writelines("localStorage.setItem('fontbox',fontflag);"+ "\n")
	f.writelines("localStorage.setItem('font_bl', JSON.stringify(font_bl));"+ "\n")
	f.writelines(policy_XMLhttprequest)
	f.writelines("localStorage.setItem('XHRbox',XHRflag);"+ "\n")
	f.writelines("localStorage.setItem('XHR_bl', JSON.stringify(XHR_bl));"+ "\n")
	f.writelines(policy_stylesheet)
	f.writelines("localStorage.setItem('stylesheetbox',stylesheetflag);"+ "\n")
	f.writelines("localStorage.setItem('stylesheet_bl', JSON.stringify(stylesheet_bl));"+ "\n")
	f.writelines(policy_media)
	f.writelines("localStorage.setItem('mediabox',mediaflag);"+ "\n")
	f.writelines("localStorage.setItem('media_bl', JSON.stringify(media_bl));"+ "\n")
	f.writelines(policy_block_bl)
	f.writelines("localStorage.setItem('blockURLbox', blockflag);"+ "\n")
	f.writelines("localStorage.setItem('blocked_bl', JSON.stringify(blocked_bl));"+ "\n")
	f.writelines("localStorage.setItem('white_list', JSON.stringify(white_list));"+ "\n")
	f.writelines(policy_exec)
	f.writelines("localStorage.setItem('exebox', exeflag);"+ "\n")
	f.writelines("localStorage.setItem('exe_bl', JSON.stringify(exe_bl));"+ "\n")
	f.writelines(policy_allapps)
	f.writelines("localStorage.setItem('appbox', appflag);"+ "\n")
	f.writelines("localStorage.setItem('app_bl', JSON.stringify(app_bl));"+ "\n")
	f.writelines(policy_webRTC)
	f.writelines("localStorage.setItem('webRTCbox', webRTCflag);"+ "\n")
	f.writelines("localStorage.setItem('webRTC_bl', JSON.stringify(webRTC_bl));"+ "\n")
	f.writelines("localStorage.setItem('webRTC_wl', JSON.stringify(webRTC_wl));"+ "\n")
	f.writelines(policy_3pcookies)
	f.writelines("localStorage.setItem('thirdcookies', thirdcookiesflag);"+ "\n")
	f.writelines("localStorage.setItem('thirdcookies_bl', JSON.stringify(thirdcookies_bl));"+ "\n")
	f.writelines("localStorage.setItem('thirdcookies_wl', JSON.stringify(thirdcookies_wl));"+ "\n")
	f.writelines(policy_autofill)
	f.writelines("localStorage.setItem('autofill', autofillflag);"+ "\n")
	f.writelines("localStorage.setItem('autofill_bl', JSON.stringify(autofill_bl));"+ "\n")
	f.writelines("localStorage.setItem('autofill_wl', JSON.stringify(autofill_wl));"+ "\n")
	f.writelines(policy_safeBrowsingEnabled)
	f.writelines("localStorage.setItem('safeBrowsingEnabled',safeBrowsingEnabledflag);"+ "\n")
	f.writelines("localStorage.setItem('safeBrowsingEnabled_bl', JSON.stringify(safeBrowsingEnabled_bl));"+ "\n")
	f.writelines("localStorage.setItem('safeBrowsingEnabled_wl', JSON.stringify(safeBrowsingEnabled_wl));"+ "\n")
	f.writelines(policy_passwordSavingEnabled)
	f.writelines("localStorage.setItem('passwordSavingEnabled', passwordSavingEnabledflag);"+ "\n")
	f.writelines("localStorage.setItem('passwordSavingEnabled_bl', JSON.stringify(passwordSavingEnabled_bl));"+ "\n")
	f.writelines("localStorage.setItem('passwordSavingEnabled_wl', JSON.stringify(passwordSavingEnabled_wl));"+ "\n")
	f.writelines(policy_doNotTrackEnabled)
	f.writelines("localStorage.setItem('doNotTrackEnabled', doNotTrackEnabledflag);"+ "\n")
	f.writelines("localStorage.setItem('doNotTrackEnabled_bl', JSON.stringify(doNotTrackEnabled_bl));"+ "\n")
	f.writelines("localStorage.setItem('doNotTrackEnabled_wl', JSON.stringify(doNotTrackEnabled_wl));"+ "\n")
	f.writelines(policy_maxtabs)
	f.writelines("localStorage.setItem('tabbox',tabflag);"+ "\n")
	f.writelines("localStorage.setItem('maxtabs', JSON.stringify(maxtabs));"+ "\n")
	f.writelines(policy_iframe)
	f.writelines("localStorage.setItem('iframebox', iframeflag);"+ "\n")
	f.writelines("localStorage.setItem('iframe_bl', JSON.stringify(iframe_bl));"+ "\n")
	f.writelines("localStorage.setItem('iframe_wl', JSON.stringify(iframe_wl));"+ "\n")
	f.writelines(policy_cookies)
	f.writelines("localStorage.setItem('cookiesbox', cookiesflag);"+ "\n")
	f.writelines("localStorage.setItem('cookies_bl', JSON.stringify(cookies_bl));"+ "\n")
	f.writelines("localStorage.setItem('cookies_wl', JSON.stringify(cookies_wl));"+ "\n")
	f.writelines(policy_sensitive)
	f.writelines("localStorage.setItem('sensitivebox', sensitiveflag);"+ "\n")
	f.writelines("localStorage.setItem('sensitive_bl', JSON.stringify(sensitive_bl));"+ "\n")
	f.writelines("localStorage.setItem('sensitive_wl', JSON.stringify(sensitive_wl));"+ "\n")
	f.writelines(policy_HttpOnlycookies)
	f.writelines("localStorage.setItem('HttpOnlycookiesbox', HttpOnlycookiesflag);"+ "\n")
	f.writelines("localStorage.setItem('HttpOnlycookies_bl', JSON.stringify(HttpOnlycookies_bl));"+ "\n")
	f.writelines("localStorage.setItem('HttpOnlycookies_wl', JSON.stringify(HttpOnlycookies_wl));"+ "\n")


#writing variable values as per policy into block.js file
read_file="sample_block.js"
write_file="test/block.js"
	
with open(read_file, 'r') as f1:
	read_contents=f1.read()


with open(write_file, 'w') as f:
	f.writelines('/*'+'\n'+"File: block.js" +"\n"+"Author: Amit Pathania"+"\n"+"*/"+"\n"+"\n")
	f.writelines("//Setting flag, white-list and black-list for fields"+"\n"+"\n")
	f.writelines(policy_UA)
	f.writelines(policy_referer)
	f.writelines(policy_http)
	f.writelines(policy_js)
	f.writelines(policy_image)
	f.writelines(policy_object)
	f.writelines(policy_font)
	f.writelines(policy_XMLhttprequest)
	f.writelines(policy_stylesheet)
	f.writelines(policy_media)
	f.writelines(policy_block_bl)
	f.writelines(policy_exec)
	f.writelines(policy_allapps)
	f.writelines(policy_webRTC)
	f.writelines(policy_3pcookies)
	f.writelines(policy_autofill)
	f.writelines(policy_safeBrowsingEnabled)
	f.writelines(policy_passwordSavingEnabled)
	f.writelines(policy_doNotTrackEnabled)
	f.writelines(policy_maxtabs)
	f.writelines(policy_iframe)
	f.writelines(policy_cookies)
	f.writelines(policy_sensitive)
	f.writelines(policy_HttpOnlycookies)
	f.writelines(read_contents)

#writing variable values as per policy into popup.js file
read_file="sample_popup.js"
write_file="test/popup.js"

with open(read_file, 'r') as f1:
	read_contents=f1.read()


with open(write_file, 'w') as f:
	f.writelines(policy_UA)
	f.writelines(policy_referer)
	f.writelines(policy_http)
	f.writelines(policy_js)
	f.writelines(policy_image)
	f.writelines(policy_object)
	f.writelines(policy_font)
	f.writelines(policy_XMLhttprequest)
	f.writelines(policy_stylesheet)
	f.writelines(policy_media)
	f.writelines(policy_block_bl)
	f.writelines(policy_exec)
	f.writelines(policy_allapps)
	f.writelines(policy_webRTC)
	f.writelines(policy_3pcookies)
	f.writelines(policy_autofill)
	f.writelines(policy_safeBrowsingEnabled)
	f.writelines(policy_passwordSavingEnabled)
	f.writelines(policy_doNotTrackEnabled)
	f.writelines(policy_maxtabs)
	f.writelines(policy_iframe)
	f.writelines(policy_cookies)
	f.writelines(policy_sensitive)
	f.writelines(policy_HttpOnlycookies)
	f.writelines(read_contents)


