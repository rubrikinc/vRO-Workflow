//set rest parameters
var content = null;
var token = ("Basic " + tokenBase64);
var request = RubrikHost.createRequest("GET", "/snapshot?vm=" + vmId, content);
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
	System.log("GET snapshots Succeeded");
}
else {
	System.log("Failed to GET snapshots");
	System.error("Status Code = " + statusCode);
	throw "Stopping Execution";
}

//Loop Through Snapshots Looking for the first one that we have before the provided date
var json = JSON.parse(response.contentAsString);

//need to convert requested date to GMT which is what is stored with Rubrik snapshots
var gmtDate = new Date(beforeDate.valueOf() + beforeDate.getTimezoneOffset() * 60000);

for(var i = 0; i < json.length; i++) {
	var obj = json[i];

	//create a date object from the date string returned by Rubrik
	var rubrikDate = obj.date;
	var rubrikYear = rubrikDate[0] + rubrikDate[1] + rubrikDate[2] + rubrikDate[3];
	var rubrikMonth = rubrikDate[5] + (rubrikDate[6]-1);
	var rubrikDay = rubrikDate[8] + rubrikDate[9];
	var rubrikHour = rubrikDate[11] + rubrikDate[12];
	var rubrikMin = rubrikDate[14] + rubrikDate[15];
	var rubrikSec = rubrikDate[17] + rubrikDate[18];
	
	var rDate = new Date();
	rDate.setYear(rubrikYear);
	rDate.setMonth(rubrikMonth);
	rDate.setDate(rubrikDay);
	rDate.setHours(rubrikHour);
	rDate.setMinutes(rubrikMin);
	rDate.setSeconds(rubrikSec);
	
	//if date is before requested date then set this as the snapshot to restore
	if(rDate.getTime() <= gmtDate.getTime()) {
		var snapshotId = obj.id;
		System.log("***SNAPSHOT FOUND***");
		//System.log("VM Name = " + vm.name);
		System.log("Snapshot ID = " + snapshotId);
		System.log("Snapshot date = " + obj.date);
		return(snapshotId);
	}
}
