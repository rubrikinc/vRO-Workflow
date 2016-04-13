//prepare request
//Do not edit 
//set rest parameters
var content = '{"vCenterId":"' + vCenterId + '"}';
var token = ("Basic " + tokenBase64);
var request = RubrikHost.createRequest("POST", "/internal/job/type/refresh", content);
request.contentType = "application\/json";
request.setHeader("Accept", "application/json");
request.setHeader("Authorization", token);

//Log Request Details
System.log("Request URL: " + request.fullUrl);
System.log("token = " + token);

var response = request.execute();
//prepare output parameters
System.log("Response: " + response);
statusCode = response.statusCode;
statusCodeAttribute = statusCode;
System.log("Status code: " + statusCode);
contentLength = response.contentLength;
headers = response.getAllHeaders();
contentAsString = response.contentAsString;
System.log("Content as string: " + contentAsString);
return(contentAsString);

