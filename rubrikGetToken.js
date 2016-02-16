// vRO Action rubrikGetToken from package com.rubrik.library.rest.package
//
// INPUT PARAMETERS
// ----------------
// NAME             - TYPE                - DESCRIPTION
// restPostLogin    - REST:REST Operation - REST operation for POST /login
// userId           - string              - username
// password         - SecureString        - password
//
// RETURN
// -----------
// N/A              - string              - Rubrik authentication token

//Contruct REST call
var restData = '{"userId":"' + userId + '","password":"' + password + '"}';
var restParams = [];
var restRequest = restPostLogin.createRequest(restParams, restData);
restRequest.contentType = "application\/json";
restRequest.setHeader("Accept", "application/json");

//Log REST URL
System.log("REST Call = " + restRequest.fullUrl);

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
	System.log("Login Successful");
}
else {
	System.log("Failed to Login");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Return Authentication Token
var json = JSON.parse(restResponse.contentAsString);
var token = json.token + ":";
System.log("Token = " + token);
return token;
