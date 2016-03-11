// vRO Action rubrikDeleteALLOnDemandSnapshotsByVM from package com.rubrik.library.rest.package
//
// INPUT PARAMETERS
// ----------------
// NAME                - TYPE                - DESCRIPTION
// tokenBase 64        - string              - Rubrik authentication token
// restGetSnapshot     - REST:REST Operation - REST operation to GET /snapshot?vm={id}
// restDeleteSnapshot  - REST:REST Operation - REST operation to DELETE /snapshot/{id}
// vmId                - string              - Rubrik ID for VM
//
// RETURN
// -----------
// N/A                 - void                - N/A

//Contruct REST call
//var rubrikVmId = vm.vimHost.instanceUuid + "-" + vm.id;
var restData = null;
var restParams = [vmId];
var restRequest = restGetSnapshot.createRequest(restParams, restData);
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

//Loop Through Snapshots Looking for On-Demand Snapshots
var json = JSON.parse(restResponse.contentAsString);

for(var i = 0; i < json.length; i++) {
	var obj = json[i];
	
	if(obj.isOnDemandSnapshot) {
		
		//Build REST call
		var snapId = obj.id;
		var restData = null;
		var restParams = [snapId];
		var restRequest = restDeleteSnapshot.createRequest(restParams, restData);
		var token = ("Basic " + tokenBase64);
		restRequest.contentType = "application\/json";
		restRequest.setHeader("Accept", "application/json");
		restRequest.setHeader("Authorization", token);
		
		//Log REST Call Info
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
			System.log("DELETE snapshot Succeeded");
		}
		else {
			System.log("Failed to DELETE snapshot");
			System.error("Status Code = " + statusCode);
			throw "Stopping Execution";
		}
	}
}
