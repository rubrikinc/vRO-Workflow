// vRO Action rubrikDeleteALLOnDemanSnapshotsByVM from package com.rubrik.library.rest.package
//
// NAME             - TYPE                - DESCRIPTION
// ----------------------------------------------------
// <INPUT PARAMETERS> 
// tokenBase64         - string              - Rubrik authentication token
// rubrikHost          - REST:REST Host      - Rubrik REST host
// vmId                - string              - Rubrik VM ID
// query_limit		   - number			     - Rubrik Query limit
// api_url			   - string			     - Rubrik API URL
//
// <RETURN VALUE>
// N/A                 - void                - N/A

//Construct REST call
var method = "GET";
var url = api_url + "vmware/vm/" + vmId + "/snapshot?limit=" + query_limit;
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
if (statusCode == 200) {
	System.log("REST Execution Successful");
}
else {
	System.log("ERROR Executing REST operation");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Delete all On Demand Snapshots
var json = (JSON.parse(response.contentAsString)).data;

System.log("Checking " + json.length + " Snapshots");

for(var i = 0; i < json.length; i++) {

	var obj = json[i];

	if(obj.isOnDemandSnapshot) {
		
		var snapId = obj.id
			
		System.log("Deleting On-Demand Snapshot " + snapId);
			
		//Construct REST call
		var method = "DELETE";
		var url = api_url + "vmware/vm/snapshot/" + snapId + "?location=all";
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
		if (statusCode == 204) {
			System.log("REST Execution Successful");
		}
		else {
			System.log("ERROR Executing REST operation");
			System.error("Status Code = " + statusCode);
			throw "Stopping Execution";
		}
	}
}
