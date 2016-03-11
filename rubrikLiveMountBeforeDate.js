// vRO Action rubrikLiveMountBeforeDate from package com.rubrik.library.rest.package
//
// INPUT PARAMETERS
// ----------------
// NAME                - TYPE                - DESCRIPTION
// tokenBase 64        - string              - Rubrik authentication token
// restGetSnapshot     - REST:REST Operation - REST operation to GET /snapshot?vm={id}
// restJobTypeMount    - REST:REST Operation - REST operation to POST /job/type/mount
// vmId                - string              - Rubrik ID for VM
// vmhost              - VC:HostSystem       - vSphere host to live mount vm on
// beforeDate          - Date                - Date to live mount prior to
//
// RETURN
// -----------
// N/A                 - string              - Job ID of live mount

//Contruct REST call
//var rubrikVmId = vm.vimHost.instanceUuid + "-" + vm.id;
var restData = null;
var restParams = [vmId];
var restRequest = restGetSnapshots.createRequest(restParams, restData);
var token = ("Basic " + tokenBase64);
restRequest.contentType = "application\/json";
restRequest.setHeader("Accept", "application/json");
restRequest.setHeader("Authorization", token);

//Log REST Call Info
System.log("token = " + token);
System.log("REST Call = " + restRequest.fullUrl);

//Execute REST Call
try {
	var restResponse = restRequest.execute();
}
catch (ex) {
	System.error("REST call failed");
	throw "Stopping Execution";
}

//Evaluate REST Response
var statusCode = restResponse.statusCode;
if (statusCode == 200) {
	System.log("GET snapshots Succeeded");
}
else {
	System.log("Failed to GET snapshots");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Loop Through Snapshots Looking for the first one that we have before the provided date
var json = JSON.parse(restResponse.contentAsString);

//need to convert requested date to GMT which is what is stored with Rubrik snapshots
var gmtDate = new Date(beforeDate.valueOf() + beforeDate.getTimezoneOffset() * 60000);

for(var i = 0; i < json.length; i++) {
	var obj = json[i];

	//create a date object from the date string returned by Rubrik
	var rubrikDate = obj.date;
	var rubrikYear = rubrikDate[0] + rubrikDate[1] + rubrikDate[2] + rubrikDate[3];
	var rubrikMonth = rubrikDate[5] + (rubrikDate[6]-1);
	var rubrikDay = rubrikDate[8] + rubrikDate[9];
	var rubrikHour = rubrikDate[11] + rubrikDate[12];
	var rubrikMin = rubrikDate[14] + rubrikDate[15];
	var rubrikSec = rubrikDate[17] + rubrikDate[18];
	
	var rDate = new Date();
	rDate.setYear(rubrikYear);
	rDate.setMonth(rubrikMonth);
	rDate.setDate(rubrikDay);
	rDate.setHours(rubrikHour);
	rDate.setMinutes(rubrikMin);
	rDate.setSeconds(rubrikSec);
	
	//if date is before requested date then set this as the snapshot to restore
	if(rDate.getTime() <= gmtDate.getTime()) {
		var snapshotId = obj.id;
		System.log("***SNAPSHOT FOUND***");
		//System.log("VM Name = " + vm.name);
		System.log("Snapshot ID = " + snapshotId);
		System.log("Snapshot date = " + obj.date);
		break;
	}
}

//a snapshot was found so we will mount it
if(snapshotId) {

	//Contruct REST call
	var hostId = vmhost.vimHost.instanceUuid + "-" + vmhost.id;
	var restData = '{"snapshotId":"' + snapshotId + '","hostId":"' + hostId + '","disableNetwork":"true"}';
	var restParams = [];
	var restRequest = restJobTypeMount.createRequest(restParams, restData);
	var token = ("Basic " + tokenBase64);
	restRequest.contentType = "application\/json";
	restRequest.setHeader("Accept", "application/json");
	restRequest.setHeader("Authorization", token);
	
	//Log REST Call Info
	System.log("token = " + token);
	System.log("REST Call = " + restRequest.fullUrl);
	
	//Execute REST Call
	try {
		var restResponse = restRequest.execute();
	}
	catch (ex) {
		System.error("REST call failed");
		throw "Stopping Execution";
	}
	
	//Evaluate REST Response
	var statusCode = restResponse.statusCode;
	if (statusCode == 200) {
		System.log("POST job type mount Succeeded");
	}
	else {
		System.log("Failed to POST job type mount");
		System.error("Status Code = " + statusCode);
		throw "Stopping Execution";
	}
	
	//Bugfix - need to remove quotes around job ID
	jobId = restResponse.contentAsString.substring(1,restResponse.contentAsString.length - 1)
	
	//Log Response
	System.log("Job ID: " + jobId);
}
//no snapshots were found
else {
	System.error("No Snapshot Found Before Date Provided");
}

//return the job id for non-async jobs to query job status
return jobId;