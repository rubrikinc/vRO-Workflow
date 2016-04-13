//set rest parameters
var content = null;
var token = ("Basic " + tokenBase64);
var request = RubrikHost.createRequest("GET", "/slaDomain", content);
request.contentType = "application\/json";
request.setHeader("Accept", "application/json");
request.setHeader("Authorization", token);

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

if (statusCode == 200) {
	System.log("GET slaDomain Succeeded");
}
else {
	System.log("Failed to GET slaDomain");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Loop Through SLA Domains to Find Corresponding ID
var json = JSON.parse(response.contentAsString);

for(var i = 0; i < json.length; i++) {
	var obj = json[i];
	if(obj.name == slaDomainName) {
		System.log("SLA DOMAIN ID = " + obj.id);
		return obj.id;
	}
}