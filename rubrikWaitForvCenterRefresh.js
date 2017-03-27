// vRO Action rubrikWaitForJobResult from package com.rubrik.library.rest.package
//
// NAME             - TYPE                - DESCRIPTION
// ----------------------------------------------------
// <INPUT PARAMETERS> 
// tokenBase64      - string              - Rubrik authentication token
// rubrikHost       - REST:REST Host      - Rubrik REST host
// jobId            - string              - Rubrik job ID
//
// <RETURN VALUE>
// N/A              - string              - Final result of job (SUCCESS/FAILURE)

//Construct REST call
var method = "GET";
var url = api_url + "vmware/vcenter/request/" + jobId;
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

var jobStatus = "UNKNOWN"

while (jobStatus != "SUCCEEDED" && jobStatus != "FAILED") {

	//Sleep for 5 seconds
	System.sleep(5000);

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
	
	//update status variable
	var json = JSON.parse(response.contentAsString);
	var jobStatus = json.status

	//log response
	System.log("Job Status: " + jobStatus);
	
}

//Return Final Status
return jobStatus;