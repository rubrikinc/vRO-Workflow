//Contruct REST call
//set rest parameters
var content = null;
var token = ("Basic " + tokenBase64);
var request = RubrikHost.createRequest("GET", "/job/instance/" + jobId, content);
request.contentType = "application\/json";
request.setHeader("Accept", "application/json");
request.setHeader("Authorization", token);

//Log Request Details
System.log("Request URL: " + request.fullUrl);
System.log("Get Job token = " + token);

var jobStatus = "UNKNOWN"

while (jobStatus != "SUCCEEDED" && jobStatus != "FAILED") {

	//Sleep for 5 seconds
	System.sleep(5000);

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
		System.log("GET job Successful");
	}
	else {
		System.log("Failed to GET job");
		System.error("Status Code = " + statusCode);
		throw "Stopping Execution";
	}
	
	//update status variable
	var json = JSON.parse(response.contentAsString);
	var jobStatus = json.status

	//log response
	System.log("Job Status: " + jobStatus);
	
}

//Return Final Status
return jobStatus;