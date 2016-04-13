//Contruct REST call
var content = null;
var token = ("Basic " + tokenBase64);
var request = RubrikHost.createRequest("GET", "/mount/vm/" + vmId, content);
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
	System.error("REST call failed");
	throw "Stopping Execution";
}

//Evaluate REST Response
var statusCode = response.statusCode;
if (statusCode == 200) {
	System.log("GET mount Succeeded");
}
else {
	System.log("Failed to GET mount");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Loop Through Mounts Looking for Mounts that Match the VM Provided
var json = JSON.parse(response.contentAsString);

for(var i = 0; i < json.length; i++) {
	var obj = json[i];

	//found mount for VM provided - delete it
	if(obj.snapshot.snapshotVmName == vm.name) {
		
		var mountId = obj.id
		System.log("vm name = " + obj.snapshot.snapshotVmName);
		System.log("Removing mount " + mountId);

		//Contruct 2nd REST call to perform unmount
		var restData = '{"mountId":"' + mountId + '","force":"false"}';
		var DELrequest = RubrikHost.createRequest("POST", "/job/type/unmount", restData);
		var token = ("Basic " + tokenBase64);
		DELrequest.contentType = "application\/json";
		DELrequest.setHeader("Accept", "application/json");
		DELrequest.setHeader("Authorization", token);
		
		//Log REST Call Info
		System.log("token = " + token);
		System.log("REST Call = " + DELrequest.fullUrl);
		
		//Execute REST Call
		try {
			var DELresponse = DELrequest.execute();
		}
		catch (ex) {
			System.error("REST call failed");
			throw "Stopping Execution";
		}
		
		//Evaluate REST Response
		var statusCode = DELresponse.statusCode;
		if (statusCode == 200) {
			System.log("POST job type unmount Succeeded");
		}
		else {
			System.log("Failed to POST job type unmount");
			System.error("Status Code = " + statusCode);
			throw "Stopping Execution";
		}
	}
}
