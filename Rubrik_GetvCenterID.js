//prepare request
//Do not edit 
//set rest parameters
var content = null;
var token = ("Basic " + tokenBase64);
var request = RubrikHost.createRequest("GET", "/vcenter", content);
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

System.log("Response: " + response);
statusCode = response.statusCode;
statusCodeAttribute = statusCode;
System.log("Status code: " + statusCode);
contentLength = response.contentLength;
headers = response.getAllHeaders();
contentAsString = response.contentAsString;
System.log("Content as string: " + contentAsString);

//Loop Through VMs returned from Rubrik
var json = JSON.parse(contentAsString);
System.log("Begin Parsing")
for(var i = 0; i < json.length; i++) {
	var obj = json[i];
	//If we match the vCenter, return the ID
	if(obj.ip == vCenter) {
		vCenterId = obj.id;
		System.log("vCenter ID = " + vCenterId);
		return(vCenterId);
	}
}
