<?php
$l['name']='Workflow';
$l['description']='Create workflow processes. Actions must be approved by users for several steps in the process.';
$l['workflow']="Workflow";
$l['filter']="Filter";
$l['showCompleted']="Show completed";
$l['showRequiredOnly']="Show my required approvals only";
$l['properties']="Properties";
$l['processes']="Processes";
$l['steps']="Steps";
$l['step']="Step";
$l['process']="Process";
$l['progress']="Progress";
$l['hoursleft']="Hours left";
$l['timeRemaining']="Time remained";

$l['approvalrequiredby']="Approval required by one of";
$l['approvalrequiredbyall']="Approval required by all";
$l['timerunning']="Time running";

$l['noHistory'] = 'No history available';
$l['by']="by";
$l['at']="at";

$l['complete']="Complete";

$l['approved']="Approved";
$l['declined']="Declined";

$l['trigger']="Trigger";
$l["approvers"] = "Approvers";
$l["authorizedGroups"] = "Authorized groups";
$l["authorizedUsers"] = "Authorized users";

// Language for model: \GO\Workflow\Model\Approver
$l["approverStep_id"] = "Step";
$l["approverUser_id"] = "Approver";
$l["approverUser_name"] = "Users";

// Language for model: \GO\Workflow\Model\ApproverGroup
$l["approvergroupStep_id"] = "Step";
$l["approvergroupGroup_id"] = "Approver group";
$l["approvergroupGroup_name"] = "Groups";

// Language for model: \GO\Workflow\Model\Model
$l["modelId"] = "ID";
$l["modelModel_id"] = "Model";
$l["modelModel_type_id"] = "Model type";
$l["modelProcess_id"] = "Process";
$l["modelStep_id"] = "Step";
$l["modelCtime"] = "Created at";
$l["modelDue_time"] = "Due untill";
$l["modelShift_due_time"] = "Shift due time (hours)";

// Language for model: \GO\Workflow\Model\Process
$l["processId"] = "ID";
$l["processUser_id"] = "User";
$l["processName"] = "Name";
$l["processAcl_id"] = "Acl";

$l["processUser_name"] = "Owner";


// Language for model: \GO\Workflow\Model\Step
$l["stepId"] = "ID";
$l["stepProcess_id"] = "Process";
$l["stepSort_order"] = "Sort order";
$l["stepName"] = "Name";
$l["stepDescription"] = "Description";
$l["stepDue_in"] = "Due in (hours)";
$l["stepEmail_alert"] = "Email alert";
$l["stepPopup_alert"] = "Popup alert";
$l["stepAll_must_approve"] = "Approve needed by all";

// Language for model: \GO\Workflow\Model\StepHistory
$l["stephistoryId"] = "ID";
$l["stephistoryProcess_model_id"] = "Model";
$l["stephistoryStep_id"] = "Step";
$l["stephistoryUser_id"] = "User";
$l["stephistoryComment"] = "Comment";
$l["stephistoryCtime"] = "Created at";
$l["stephistoryStatus"] = "Status";

// Language for model: \GO\Workflow\Model\Trigger
$l["triggerModel_type_id"] = "Type";
$l["triggerModel_attribute"] = "Attribute";
$l["triggerModel_attribute_value"] = "Value";
$l["triggerProcess_id"] = "Process";


// Email that will be send to the approvers
$l["emailSubject"] = "New %s needs your approval!"; // %s is the model name
$l["disapproveSubject"] = "Disapproved: %s"; // %s is the model name
$l["emailBody"] = "A new %s needs your approval.<br />
									 Please <a href='%s'>click</a> here to view the %s.<br /><br />
									 Click on one of the links below:<br /><br />
									 <a href='%s'>Approve</a> | <a href='%s'>Decline</a>";
$l["disapprovedBody"] = "%s has put %s into %s. It has recently been disapproved by %s.";

$l['reminderSubject'] = "Approval request!";
$l['reminderDisapproved'] = "%s disapproved by %s.";

$l['visualTemplateTitle'] = "Workflow process “{process_name}” on “{model_type}:{model_name}”";
$l['visualTemplateStartDate'] = "Started at {start_time}";
$l['visualTemplateStepTitle'] = "{name} : {description}";
$l['visualTemplateStepApprovalStart'] = "Needs approval by ";
$l['visualTemplateOne'] = "one ";
$l['visualTemplateAll'] = "all ";
$l['visualTemplateStepApprovalEnd'] = "of these users: {approvers}";
$l['visualTemplateStepDueAt'] = "<br>Due at: {due_at}";

$l['folderWorkflowText'] = "Select a workflow process that will be attached to each new file that you upload in this folder.";

$l['startedBy']= "Started by";

$l['showOwnCreated'] = "Show created by me only";

$l['approve']= "Approve";
$l['decline']= "Decline";

$l['modelTypeNotSupported'] = 'In this workflow, model type "%m" is not supported by workflow step action "%wm".';
$l['filesOnly'] = 'Applies only to files';
$l['copyToFolder'] = 'Copy to this folder';
$l['keepOriginalCopy'] = 'Copy instead of move';

$l['actionType'] = 'Action type';

$l['workflowHistory'] = 'Workflow history';
$l['stepDeleted']= "Step is deleted";

