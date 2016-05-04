// vRO Action rubrikGetSnapshotID from package com.rubrik.library.rest.package
//
// NAME             - TYPE                - DESCRIPTION
// ----------------------------------------------------
// <INPUT PARAMETERS> 
// tokenBase64      - string              - Rubrik authentication token
// rubrikHost       - REST:REST Host      - Rubrik REST host
// vmId             - string              - Rubrik VM ID
// beforeDate	    - Date                - Date to get snapshot before
//
// <RETURN VALUE>
// N/A              - string              - Snapshot ID

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

//Loop Through Snapshots Looking for the first one that we have before the provided date
var json = JSON.parse(response.contentAsString);

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
		System.log("Snapshot ID = " + snapshotId);
		System.log("Snapshot date = " + obj.date);
		return(snapshotId);
	}
}


//Snapshot Not Found
System.error("No Snapshot Found Before Date Provided");
throw "Stopping Execution";
