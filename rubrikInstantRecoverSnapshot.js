// vRO Action rubrikInstantRecoverSnapshot from package com.rubrik.library.rest.package
//
// NAME             - TYPE                - DESCRIPTION
// ----------------------------------------------------
// <INPUT PARAMETERS> 
// rubrikHost       - REST:REST Host      - Rubrik REST host
// tokenBase64      - string              - Rubrik authentication token
// snapshotId       - string              - Rubrik snapshot ID
// esxiHostId       - string              - Rubrik ESXi host ID
//
// <RETURN VALUE>
// N/A              - string              - Rubrik Job ID

//Construct REST call
var method = "POST";
var url = "job/type/instant_recover";
var content = '{"snapshotId":"' + snapshotId + '","hostId":"' + esxiHostId + '"}';
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

//Bugfix - need to remove quotes around job ID
jobId = response.contentAsString.substring(1,response.contentAsString.length - 1)

System.log("Job ID: " + jobId);
return jobId;
