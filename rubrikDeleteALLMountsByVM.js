// vRO Action rubrikDeleteALLMountsByVM from package com.rubrik.library.rest.package
//
// INPUT PARAMETERS
// ----------------
// NAME                - TYPE                - DESCRIPTION
// tokenBase 64        - string              - Rubrik authentication token
// restGetMount        - REST:REST Operation - REST operation to GET /mount
// restJobTypeUnmount  - REST:REST Operation - REST operation to POST /job/type/unmount
// vm                  - VC:VirtualMachine   - VM to delete Rubrik live mounts
//
// RETURN
// -----------
// N/A                 - void                - N/A

//Contruct REST call
var restData = null;
var restParams = [];
var restRequest = restGetMount.createRequest(restParams, restData);
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
	System.log("GET mount Succeeded");
}
else {
	System.log("Failed to GET mount");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Loop Through Mounts Looking for Mounts that Match the VM Provided
var json = JSON.parse(restResponse.contentAsString);

for(var i = 0; i < json.length; i++) {
	var obj = json[i];

	//found mount for VM provided - delete it
	if(obj.snapshot.snapshotVmName == vm.name) {
		
		var mountId = obj.id
		System.log("vm name = " + obj.snapshot.snapshotVmName);
		System.log("Removing mount " + mountId);
		
		//Contruct REST call
		var restData = '{"mountId":"' + mountId + '","force":"false"}';
		var restParams = [];
		var restRequest = restJobTypeUnmount.createRequest(restParams, restData);
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
			System.log("POST job type unmount Succeeded");
		}
		else {
			System.log("Failed to POST job type unmount");
			System.error("Status Code = " + statusCode);
			throw "Stopping Execution";
		}
	}
}
