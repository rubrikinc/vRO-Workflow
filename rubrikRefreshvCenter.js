// vRO Action rubrikRefreshvCenter from package com.rubrik.library.rest.package
//
// NAME             - TYPE                - DESCRIPTION
// ----------------------------------------------------
// <INPUT PARAMETERS> 
// tokenBase64      - string              - Rubrik authentication token
// rubrikHost       - REST:REST Host      - Rubrik REST host
// vCenterId        - string              - Rubrik vCenter ID
// api_url			- string			  - Rubrik API URL
//
// <RETURN VALUE>
// N/A              - string              - Job ID of Refresh Job

//Construct REST call
var method = "POST";
var url = api_url + "vmware/vcenter/" + vCenterId + "/refresh";
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

//Log Response

//Bugfix - need to remove quotes around job ID
//jobId = response.contentAsString.substring(1,response.contentAsString.length - 1)
jobId = JSON.parse(response.contentAsString).id
System.log("Job ID: " + jobId);

//Return Job ID
return jobId;
