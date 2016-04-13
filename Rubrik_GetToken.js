//set username password as a string to pass in the REST Request
var content = '{"userId":"' + userId + '","password":"' + password + '"}';
//Create Request
var request = RubrikHost.createRequest("POST", "/login", content);
request.contentType = "application\/json";
request.setHeader("Accept", "application/json");

//Log Request Details
System.log("Request URL: " + request.fullUrl);
System.log("Request: " + request)


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

if (statusCode == 200) {
	System.log("Login Successful");
}
else {
	System.log("Failed to Login");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Return Authentication Token
var json = JSON.parse(response.contentAsString);
var token = json.token + ":";
System.log("Token = " + token);
return token;
