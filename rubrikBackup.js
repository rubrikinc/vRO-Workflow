// vRO Action rubrikBackup from package com.rubrik.library.rest.package
//
// INPUT PARAMETERS
// ----------------
// NAME             - TYPE                - DESCRIPTION
// tokenBase 64     - string              - Rubrik authentication token
// restPostJob      - REST:REST Operation - REST operation for POST /job/type/backup
// vmId             - string              - Rubrik ID for VM
//
// RETURN
// -----------
// N/A              - string              - Job ID of Backup Job

//Contruct REST call
//var rubrikVmId = vm.vimHost.instanceUuid + "-" + vm.id;
var restData = '{"vmId":"' + vmId + '"}';
var restParams = [];
var restRequest = restPostJob.createRequest(restParams, restData);
var token = ("Basic " + tokenBase64);
restRequest.contentType = "application\/json";
restRequest.setHeader("Accept", "application/json");
restRequest.setHeader("Authorization", token);

//Log REST Call Info
System.log("token = " + token);
System.log("REST Call = " + restRequest.fullUrl);
System.log("REST Data = " + restData);

//Execute REST Call
try {
	var restResponse = restRequest.execute();
}
catch (ex) {
	System.error(ex);
	throw "Stopping Execution";
}

//Evaluate REST Response
var statusCode = restResponse.statusCode;
if (statusCode == 200) {
	System.log("POST Successful");
}
else {
	System.log("Failed to POST job");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Log Response
var json = JSON.parse(restResponse.contentAsString);
System.log("Job ID: " + json.description);

//Return Backup Job ID
return json.description