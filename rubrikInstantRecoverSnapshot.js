// vRO Action rubrikInstantRecoverSnapshot from package com.rubrik.library.rest.package
//
// NAME             - TYPE                - DESCRIPTION
// ----------------------------------------------------
// <INPUT PARAMETERS> 
// rubrikHost       - REST:REST Host      - Rubrik REST host
// tokenBase64      - string              - Rubrik authentication token
// snapshotId       - string              - Rubrik snapshot ID
// esxiHostId       - string              - Rubrik ESXi host ID
// api_url			- string			  - Rubrik API URL
//
// <RETURN VALUE>
// N/A              - string              - Rubrik Job ID

//Construct REST call
var method = "POST";
var url = api_url + "vmware/vm/snapshot/" + snapshotId + "/instant_recover";
var content = '{"hostId":"' + esxiHostId + '"}';
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
if (statusCode == 202) {
	System.log("REST Execution Successful");
}
else {
	System.log("ERROR Executing REST operation");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

var json = JSON.parse(response.contentAsString);
System.log("Request ID: " + json.id);
return json.id;
