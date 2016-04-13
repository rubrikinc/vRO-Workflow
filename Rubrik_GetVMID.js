//set rest parameters
var content = null;
var token = ("Basic " + tokenBase64);
var request = RubrikHost.createRequest("GET", "/vm", content);
request.contentType = "application\/json";
request.setHeader("Accept", "application/json");
request.setHeader("Authorization", token);

//Log REST Call Info
System.log("token = " + tokenBase64);
System.log("REST Call = " + request.fullUrl);

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
	System.log("GET vm Succeeded");
}
else {
	System.log("Failed to GET vm");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

System.log("Response: " + response);
statusCode = response.statusCode;
statusCodeAttribute = statusCode;
System.log("Status code: " + statusCode);
contentLength = response.contentLength;
System.log("Content length is: " + contentLength);
headers = response.getAllHeaders();
contentAsString = response.contentAsString;
System.log("Content as string: " + contentAsString);

//Loop Through VMs returned from Rubrik
var json = JSON.parse(response.contentAsString);

for(var i = 0; i < json.length; i++) {
	var obj = json[i];
	//If we match both the VM friendly name and the VM moid we can be pretty sure we found the corresponding ID
	if(obj.name == vm.name && obj.moid == vm.id) {
		System.log("VM ID = " + obj.id);
		return obj.id;
	}
}

//VM Not Found
System.error("No Matching VM Found With the Name: " + vm.name + " and the moid: " + vm.id);
throw "Stopping Execution";
