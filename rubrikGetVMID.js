// vRO Action rubrikGetVMID from package com.rubrik.library.rest.package
//
// NAME             - TYPE                - DESCRIPTION
// ----------------------------------------------------
// <INPUT PARAMETERS> 
// tokenBase64      - string              - Rubrik authentication token
// rubrikHost       - REST:REST Host      - Rubrik REST host
// vm               - VC:VirtualMachine   - VM to get Rubrik ID for
// query_limit		- string			  - Rubrik Query limit
// api_url			- string			  - Rubrik API URL
//
// <RETURN VALUE>
// N/A              - string              - Rubrik VM ID

//Construct REST call
var method = "GET";
var url = api_url + "vmware/vm?limit=" + query_limit;
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
var json = (JSON.parse(response.contentAsString)).data;

for(var i = 0; i < json.length; i++) {
	var obj = json[i];
	System.log(obj.name);
	//If we match the VM friendly name return the corresponding ID
	if(obj.name == vm.name) {
		System.log("VM ID = " + obj.id);
		return obj.id;
	}
}

//VM ID Not Found
System.error("No Matching VM Found With the Name: " + vm.name);
throw "Stopping Execution";
