// vRO Action rubrikDeleteALLSnapshotsByVM from package com.rubrik.library.rest.package
//
// NAME             - TYPE                - DESCRIPTION
// ----------------------------------------------------
// <INPUT PARAMETERS> 
// tokenBase64         - string              - Rubrik authentication token
// rubrikHost          - REST:REST Host      - Rubrik REST host
// vmId                - string              - Rubrik ID for VM
//
// <RETURN VALUE>
// N/A                 - void                - N/A

//Construct REST call
var method = "GET";
var url = "snapshot?vm=" + vmId;
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

//Loop Through Snapshots Looking for On-Demand Snapshots
var json = JSON.parse(response.contentAsString);

System.log("Deleting " + json.length + " Snapshots");

for(var i = 0; i < json.length; i++) {
	var obj = json[i];
		
	//Construct REST call
	var snapId = obj.id;
	var method = "DELETE";
	var url = "snapshot/" + snapId;
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
	
	System.log("Deleted Snapshot " + i + " of " + json.length);
}