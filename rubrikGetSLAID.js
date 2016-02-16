// vRO Action rubrikGetSLAID from package com.rubrik.library.rest.package
//
// INPUT PARAMETERS
// ----------------
// NAME             - TYPE                - DESCRIPTION
// tokenBase 64     - string              - Rubrik authentication token
// restGetSLADomain - REST:REST Operation - REST operation to GET /slaDomain
// slaDomainName    - string              - SLA Domain Name
//
// RETURN
// -----------
// N/A              - string              - SLA Domain ID

//Contruct REST call
var restData = null;
var restParams = [];
var restRequest = restGetSLADomain.createRequest(restParams, restData);
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
	System.log("GET slaDomain Succeeded");
}
else {
	System.log("Failed to GET slaDomain");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Loop Through SLA Domains to Find Corresponding ID
var json = JSON.parse(restResponse.contentAsString);

for(var i = 0; i < json.length; i++) {
	var obj = json[i];
	if(obj.name == slaDomainName) {
		System.log("SLA DOMAIN ID = " + obj.id);
		return obj.id;
	}
}

//SLA ID Not Found
System.error("No Matching SLA Domain Found With the Name: " + slaDomainName);
throw "Stopping Execution";
