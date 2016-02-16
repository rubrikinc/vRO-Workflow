// vRO Action rubrikWaitForJobResult from package com.rubrik.library.rest.package
//
// INPUT PARAMETERS
// ----------------
// NAME             - TYPE                - DESCRIPTION
// tokenBase 64     - string              - Rubrik authentication token
// restGetJob       - REST:REST Operation - REST operation to GET /job/{id}
// jobId            - string              - Rubrik job ID
//
// RETURN
// -----------
// N/A              - string              - Final result of job (SUCCESS/FAILURE)

//Contruct REST call
var restData = null
var restParams = [jobId];
var restRequest = restGetJob.createRequest(restParams, restData);
var token = ("Basic " + tokenBase64);
restRequest.contentType = "application\/json";
restRequest.setHeader("Accept", "application/json");
restRequest.setHeader("Authorization", token);

//Log REST Call Info
System.log("token = " + token);
System.log("REST Call = " + restRequest.fullUrl);

var jobStatus = "UNKNOWN"

while (jobStatus != "SUCCEEDED" && jobStatus != "FAILED") {

	//Sleep for 5 seconds
	System.sleep(5000);

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
		System.log("GET job Successful");
	}
	else {
		System.log("Failed to GET job");
		System.error("Status Code = " + statusCode);
		throw "Stopping Execution";
	}
	
	//update status variable
	var json = JSON.parse(restResponse.contentAsString);
	var jobStatus = json.status

	//log response
	System.log("Job Status: " + jobStatus);
	
}

//Return Final Status
return jobStatus;
