//Contruct REST call
//set rest parameters
var content = '{"vmId":"' + vmId + '"}';
var token = ("Basic " + tokenBase64);
var request = RubrikHost.createRequest("POST", "/job/type/backup", content);
request.contentType = "application\/json";
request.setHeader("Accept", "application/json");
request.setHeader("Authorization", token);

//Log REST Call Info
System.log("token = " + token);
System.log("REST Call = " + request.fullUrl);


//Log Request Details
System.log("Request URL: " + request.fullUrl);
System.log("token = " + token);


//Execute REST Call
try {
	var response = request.execute();
}
catch (ex) {
	System.error(ex);
	throw "Stopping Execution";
}

//prepare output parameters
System.log("Response: " + response);
statusCode = response.statusCode;
statusCodeAttribute = statusCode;
System.log("Status code: " + statusCode);
contentLength = response.contentLength;
System.log("Content length is: " + contentLength);
headers = response.getAllHeaders();
contentAsString = response.contentAsString;
System.log("Content as string: " + contentAsString);

//Evaluate REST Response
var statusCode = response.statusCode;
if (statusCode == 200) {
	System.log("POST Successful");
}
else {
	System.log("Failed to POST job");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Log Response
var json = JSON.parse(response.contentAsString);
System.log("Job ID: " + json.description);

//Return Backup Job ID
return json.description