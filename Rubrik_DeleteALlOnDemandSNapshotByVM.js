//Contruct REST call
var content = null;
var request = RubrikHost.createRequest("GET", "/snapshot?vm=" + vmId, content);
var token = ("Basic " + tokenBase64);
request.contentType = "application\/json";
request.setHeader("Accept", "application/json");
request.setHeader("Authorization", token);

//Log REST Call Info
System.log("token = " + token);
System.log("REST Call = " + request.fullUrl);

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
	System.log("GET snapshots Succeeded");
}
else {
	System.log("Failed to GET snapshots");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}
//Loop Through Snapshots Looking for On-Demand Snapshots
System.log("Searching for On-Demand Snapshots")
var json = JSON.parse(response.contentAsString);

for(var i = 0; i < json.length; i++) {
	var obj = json[i];
	
	if(obj.isOnDemandSnapshot) {
		
		//Build REST call
		System.log("Found On-Demand Snapshot - Removing")
		var snapId = obj.id;
		var DELcontent = null;
		var DELrequest = RubrikHost.createRequest("DELETE", "/snapshot/" + snapId , DELcontent);
		var token = ("Basic " + tokenBase64);
		DELrequest.contentType = "application\/json";
		DELrequest.setHeader("Accept", "application/json");
		DELrequest.setHeader("Authorization", token);
		
		//Log REST Call Info
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
			System.log("DELETE snapshot Succeeded");
		}
		else {
			System.log("Failed to DELETE snapshot");
			System.error("Status Code = " + statusCode);
			throw "Stopping Execution";
		}
	}
}
