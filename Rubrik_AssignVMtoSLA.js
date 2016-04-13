//Contruct REST call
var content = '{"slaDomainId":"' + slaDomainId + '"}';
var request = RubrikHost.createRequest("PATCH", "vm/" + vmId , content);
var token = ("Basic " + tokenBase64);
request.contentType = "application\/json";
request.setHeader("Accept", "application/json");
request.setHeader("Authorization", token);

//Log REST Call Info
System.log("token = " + token);
System.log("REST Call = " + request.fullUrl);
System.log("REST Data = " + request);

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
	System.log("PATCH Successful");
}
else {
	System.log("Failed to PATCH VM");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//log response
System.log("Response: " + response.contentAsString);
