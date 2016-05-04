// vRO Action rubrikGetVMID from package com.rubrik.library.rest.package
//
// NAME             - TYPE                - DESCRIPTION
// ----------------------------------------------------
// <INPUT PARAMETERS> 
// tokenBase64      - string              - Rubrik authentication token
// rubrikHost       - REST:REST Host      - Rubrik REST host
// vm               - VC:VirtualMachine   - VM to get Rubrik ID for
//
// <RETURN VALUE>
// N/A              - string              - Rubrik VM ID

//Construct REST call
var method = "GET";
var url = "vm";
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

//Loop Through VMs returned from Rubrik
var json = JSON.parse(response.contentAsString);

for(var i = 0; i < json.length; i++) {
	var obj = json[i];
	//If we match both the VM friendly name and the VM moid we can be pretty sure we found the corresponding ID
	if(obj.name == vm.name && obj.moid == vm.id) {
		System.log("VM ID = " + obj.id);
		return obj.id;
	}
}

//VM ID Not Found
System.error("No Matching VM Found With the Name: " + vm.name + " and the moid: " + vm.id);
throw "Stopping Execution";