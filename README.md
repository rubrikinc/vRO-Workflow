# Community vRO Workflows for Rubrik
This is a community project that provides example VMware vRealize Orchestrator Workflows for Rubrik by way of the published RESTful APIs.

#Usage Instructions
1. Import the release package into vRO (https://github.com/rubrikinc/vRO-Workflow/releases)
2. Update the vRO configuration "RubrikCredentials" with the Rubrik username and password
3. Run the REST workflow to add the Rubrik host as a REST host
4. Run the REST workflow to add REST operations for each REST operation contained in the example workflows you wish to use
5. Update the example Rubrik workflows with the REST operations created in step 4

