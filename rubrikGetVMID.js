// vRO Action rubrikGetSLAID from package com.rubrik.library.rest.package
//
// INPUT PARAMETERS
// ----------------
// NAME             - TYPE                - DESCRIPTION
// tokenBase 64     - string              - Rubrik authentication token
// restGetVM        - REST:REST Operation - REST operation to GET /vm
// vm               - VC:VirtualMachine   - VM to get Rubrik ID for
//
// RETURN
// -----------
// N/A              - string              - Rubrik VM ID

//Contruct REST call
var restData = null;
var restParams = [];
var restRequest = restGetVm.createRequest(restParams, restData);
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
	System.log("GET vm Succeeded");
}
else {
	System.log("Failed to GET vm");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Loop Through VMs returned from Rubrik
var json = JSON.parse(restResponse.contentAsString);

for(var i = 0; i < json.length; i++) {
	var obj = json[i];
	//If we match both the VM friendly name and the VM moid we can be pretty sure we found the corresponding ID
	if(obj.name == vm.name && obj.moid == vm.id) {
		System.log("VM ID = " + obj.id);
		return obj.id;
	}
}

//SLA ID Not Found
System.error("No Matching VM Found With the Name: " + vm.name + " and the moid: " + vm.id);
throw "Stopping Execution";