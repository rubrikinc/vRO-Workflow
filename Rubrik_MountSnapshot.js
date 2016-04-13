	//Construct REST call
	var content = '{"snapshotId":"' + snapshotId + '","hostId":"' + ESXiHostID + '","disableNetwork":"true"}';
	var token = ("Basic " + tokenBase64);
	var request = RubrikHost.createRequest("POST", "/job/type/mount" ,content);
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
		System.log("POST job type mount Succeeded");
	}
	else {
		System.log("Failed to POST job type mount");
		System.error("Status Code = " + statusCode);
		throw "Stopping Execution";
	}
	
	//Bugfix - need to remove quotes around job ID
	jobId = response.contentAsString.substring(1,response.contentAsString.length - 1)
	
	//Log Response
	System.log("Job ID: " + jobId);



//return the job id for non-async jobs to query job status
return jobId;

