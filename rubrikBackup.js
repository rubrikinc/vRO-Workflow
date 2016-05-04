// vRO Action rubrikBackup from package com.rubrik.library.rest.package
//
// NAME             - TYPE                - DESCRIPTION
// ----------------------------------------------------
// <INPUT PARAMETERS> 
// tokenBase64      - string              - Rubrik authentication token
// rubrikHost       - REST:REST Host      - Rubrik REST host
// vmId             - string              - Rubrik ID for VM
//
// <RETURN VALUE>
// N/A              - string              - Job ID of Backup Job

//Construct REST call
var method = "POST";
var url = "job/type/backup";
var content = '{"vmId":"' + vmId + '"}';
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

//Log Response
var json = JSON.parse(response.contentAsString);
System.log("Job ID: " + json.description);

//Return Backup Job ID
return json.description