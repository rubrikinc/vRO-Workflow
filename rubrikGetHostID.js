// vRO Action rubrikGetHostID from package com.rubrik.library.rest.package
//
// NAME             - TYPE                - DESCRIPTION
// ----------------------------------------------------
// <INPUT PARAMETERS> 
// tokenBase64      - string              - Rubrik authentication token
// rubrikHost       - REST:REST Host      - Rubrik REST host
// vmHost           - VC:HostSystem       - ESXi Host
//
// <RETURN VALUE>
// N/A              - string              - ESXi Host ID

//Construct REST call
var method = "GET";
var url = "vmware/host";
var content = null;
var request = rubrikHost.createRequest(method, url, content);
var token = ("Basic " + tokenBase64);
request.contentType = "application\/json";
request.setHeader("Accept", "application/json");
request.setHeader("Authorization", token);

//Log REST Call Info
System.log("token = " + token);
System.log("REST URL = " + request.fullUrl);
System.log("REST Content = " + content);

//Execute REST Call
try {
	var response = request.execute();
}
catch (ex) {
	System.error("REST call failed");
	throw "Stopping Execution";
}

//Evaluate REST Response
var statusCode = response.statusCode;
if (statusCode == 200) {
	System.log("REST Execution Successful");
}
else {
	System.log("ERROR Executing REST operation");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Loop Through Hosts to Find Corresponding ID
var json = JSON.parse(response.contentAsString);

for(var i = 0; i < json.length; i++) {
	var obj = json[i];
	if(obj.name == vmHost.name) {
		System.log("ESXi Host ID = " + obj.id);
		return obj.id;
	}
}

//ESXi Host Not Found
System.error("No Matching ESXi Host Found With the Name: " + vmHost.name);
throw "Stopping Execution";
