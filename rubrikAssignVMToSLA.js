// vRO Action rubrikAssignVMToSLA from package com.rubrik.library.rest.package
//
// INPUT PARAMETERS
// ----------------
// NAME             - TYPE                - DESCRIPTION
// tokenBase 64     - string              - Rubrik authentication token
// restPatchVM      - REST:REST Operation - REST operation for PATCH /vm/{id}
// vm               - VC:VirtualMachine   - VM to assign to SLA Domain
// slaID            - string              - SLA Domain ID
//
// RETURN
// -----------
// N/A              - void                - N/A

//Contruct REST call
var rubrikVmId = vm.vimHost.instanceUuid + "-" + vm.id;
var restData = '{"slaDomainId":"' + slaID + '"}';
var restParams = [rubrikVmId];
var restRequest = restPatchVM.createRequest(restParams, restData);
var token = ("Basic " + tokenBase64);
restRequest.contentType = "application\/json";
restRequest.setHeader("Accept", "application/json");
restRequest.setHeader("Authorization", token);

//Log REST Call Info
System.log("token = " + token);
System.log("REST Call = " + restRequest.fullUrl);
System.log("REST Data = " + restData);

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
	System.log("PATCH Successful");
}
else {
	System.log("Failed to PATCH VM");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//log response
System.log("Response: " + restResponse.contentAsString);
