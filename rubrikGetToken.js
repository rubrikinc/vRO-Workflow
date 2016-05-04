// vRO Action rubrikGetToken from package com.rubrik.library.rest.package
//
// NAME             - TYPE                - DESCRIPTION
// ----------------------------------------------------
// <INPUT PARAMETERS> 
// rubrikHost       - REST:REST Host      - Rubrik REST host
// userId           - string              - username
// password         - SecureString        - password
//
// <RETURN VALUE>
// N/A              - string              - Rubrik authentication token

//Construct REST call
var method = "POST";
var url = "login";
var content = '{"userId":"' + userId + '","password":"' + password + '"}';
var request = rubrikHost.createRequest(method, url, content);
request.contentType = "application\/json";
request.setHeader("Accept", "application/json");

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

//Return Authentication Token
var json = JSON.parse(response.contentAsString);
var token = json.token + ":";
System.log("Token = " + token);
return token;