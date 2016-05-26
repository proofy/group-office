<?php
$l['name']='Workflow';
$l['description']='Maak workflow processen. Acties kunnen in stappen worden goedgekeurd door gebruikers voordat ze afgerond zijn.';
$l['workflow']="Workflow";
$l['filter']="Filter";
$l['showCompleted']="Toon compleet";
$l['showRequiredOnly']="Toon alleen mijn benodigde goedkeuringen";
$l['properties']="Opties";
$l['processes']="Processen";
$l['steps']="Stappen";
$l['step']="Stap";
$l['process']="Proces";
$l['progress']="Voortgang";
$l['hoursleft']="Uren over";
$l['timeRemaining']="Tijd over";

$l['approvalrequiredby']="Goedkeuring nodig van een van deze gebruikers";
$l['approvalrequiredbyall']="Goedkeuring nodig van al deze gebruikers";
$l['timerunning']="Looptijd";

$l['noHistory'] = 'Geen geschiedenis gevonden';
$l['by']="door";
$l['at']="om";

$l['complete']="Compleet";

$l['approved']="Goedgekeurd";
$l['declined']="Afgekeurd";

$l['trigger']="Trigger";
$l["approvers"] = "Goedkeurders";
$l["authorizedGroups"] = "Geauthoriseerde groepen";
$l["authorizedUsers"] = "Geauthoriseerde gebruikers";

// Language for model: \GO\Workflow\Model\Approver
$l["approverStep_id"] = "Stap";
$l["approverUser_id"] = "Goedkeurder";
$l["approverUser_name"] = "Gebruiker";

// Language for model: \GO\Workflow\Model\ApproverGroup
$l["approvergroupStep_id"] = "Stap";
$l["approvergroupGroup_id"] = "Goedkeur groep";
$l["approvergroupGroup_name"] = "Groepen";

// Language for model: \GO\Workflow\Model\Model
$l["modelId"] = "ID";
$l["modelModel_id"] = "Model";
$l["modelModel_type_id"] = "Model type";
$l["modelProcess_id"] = "Proces";
$l["modelStep_id"] = "Stap";
$l["modelCtime"] = "Gemaakt op";
$l["modelDue_time"] = "Looptijd tot";
$l["modelShift_due_time"] = "Verschuif looptijd(uren)";

// Language for model: \GO\Workflow\Model\Process
$l["processId"] = "ID";
$l["processUser_id"] = "Gebruiker";
$l["processName"] = "Naam";
$l["processAcl_id"] = "Acl";

$l["processUser_name"] = "Eigenaar";


// Language for model: \GO\Workflow\Model\Step
$l["stepId"] = "ID";
$l["stepProcess_id"] = "Proces";
$l["stepSort_order"] = "Volgorde";
$l["stepName"] = "Naam";
$l["stepDescription"] = "Beschrijving";
$l["stepDue_in"] = "Verloopt in (uren)";
$l["stepEmail_alert"] = "Email zenden";
$l["stepPopup_alert"] = "Popup tonen";
$l["stepAll_must_approve"] = "Goedkeuring nodig door iedere gebruiker";

// Language for model: \GO\Workflow\Model\StepHistory
$l["stephistoryId"] = "ID";
$l["stephistoryProcess_model_id"] = "Model";
$l["stephistoryStep_id"] = "Stap";
$l["stephistoryUser_id"] = "Gebruiker";
$l["stephistoryComment"] = "Commentaar";
$l["stephistoryCtime"] = "Gemaakt op";
$l["stephistoryStatus"] = "Status";

// Language for model: \GO\Workflow\Model\Trigger
$l["triggerModel_type_id"] = "Type";
$l["triggerModel_attribute"] = "Attribuut";
$l["triggerModel_attribute_value"] = "Waarde";
$l["triggerProcess_id"] = "Proces";


// Email that will be send to the approvers
$l["emailSubject"] = "Nieuwe %s heeft uw goedkeuring nodig!"; // %s is the model name
$l["disapproveSubject"] = "Afgekeurd: %s"; // %s is the model name
$l["emailBody"] = "Een nieuwe %s heeft uw goedkeuring nodig.<br />
									 Klik <a href='%s'>hier</a> om de %s weer te geven.<br /><br />
									 Of klik op een van de onderstaande links om het meteen goed of af te keuren:<br /><br />
									 <a href='%s'>Goedkeuren</a> | <a href='%s'>Afkeuren</a>";
$l["disapprovedBody"] = "%s heeft %s in %s geplaatst. Deze is recentelijk afgekeurd door %s.";

$l['reminderSubject'] = "Uw goedkeuring is nodig!";
$l['reminderDisapproved'] = '%s is afgekeurd door %s.';

$l['visualTemplateTitle'] = "Workflow proces “{process_name}” voor “{model_type}:{model_name}”";
$l['visualTemplateStartDate'] = "Gestart op {start_time}";
$l['visualTemplateStepTitle'] = "{name} : {description}";
$l['visualTemplateStepApprovalStart'] = "Goedkeuring is nodig door ";
$l['visualTemplateOne'] = "een van ";
$l['visualTemplateAll'] = "al deze ";
$l['visualTemplateStepApprovalEnd'] = "gebruikers: {approvers}";
$l['visualTemplateStepDueAt'] = "<br>Verloopt op: {due_at}";

$l['folderWorkflowText'] = "Selecteer een workflow process dat op alle nieuwe bestanden die in deze map gezet worden moet worden toegepast.";

$l['startedBy']= "Gestart door";
$l['showOwnCreated'] = "Toon alleen gestart door mij";

$l['approve']= "Goedkeuren";
$l['decline']= "Afkeuren";

$l['modelTypeNotSupported'] = 'In deze workflow wordt modeltype "%m" niet ondersteund door workflow handeling "%wm".';
$l['filesOnly'] = 'Alleen van toepassing op bestanden';
$l['copyToFolder'] = 'Kopieer naar deze map';
$l['keepOriginalCopy'] = 'Kopiëren i.p.v. verplaatsen';

$l['actionType'] = 'Type handeling';
$l['stepDeleted']= "Stap is verwijderd";
