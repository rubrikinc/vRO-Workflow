// vRO Action rubrikDeleteALLMountsByVM from package com.rubrik.library.rest.package
//
// NAME             - TYPE                - DESCRIPTION
// ----------------------------------------------------
// <INPUT PARAMETERS> 
// tokenBase64         - string              - Rubrik authentication token
// rubrikHost          - REST:REST Host      - Rubrik REST host
// vmId                - string              - Rubrik VM ID
//
// <RETURN VALUE>
// N/A                 - void                - N/A

//Construct REST call
var method = "GET";
var url = "mount/vm/" + vmId;
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
	System.error(ex);
	throw "Stopping Execution";
}

///Evaluate REST Response
var statusCode = response.statusCode;
if (statusCode == 200) {
	System.log("REST Execution Successful");
}
else {
	System.log("ERROR Executing REST operation");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Delete all Mounts Returned
var json = JSON.parse(response.contentAsString);

for(var i = 0; i < json.length; i++) {
	var obj = json[i];
	var mountId = obj.id
		
	System.log("Removing mount " + mountId);
		
	//Construct REST call
	var method = "POST";
	var url = "job/type/unmount";
	var content = '{"mountId":"' + mountId + '","force":"false"}';
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
		System.error(ex);
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
}