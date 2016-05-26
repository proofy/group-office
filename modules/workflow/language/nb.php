<?php
$l['name']='Workflow';
$l['description']='Lage prosesser for arbeidsflyt. Handlinger må godkjennes av brukere for hvert trinn i prosessen.';
$l['workflow']="Workflow";
$l['filter']="Filter";
$l['showCompleted']="Vis fullførte";
$l['showRequiredOnly']="Vis kun de jeg må godkjenne";
$l['properties']="Egenskaper";
$l['processes']="Prosesser";
$l['steps']="Trinn";
$l['step']="Trinn";
$l['process']="Prosess";
$l['progress']="Framdrift";
$l['hoursleft']="Timer igjen";
$l['timeRemaining']="Gjenv. tid";

$l['approvalrequiredby']="Krever godkjennelse av en av";
$l['approvalrequiredbyall']="Krever godkjennelse av alle";
$l['timerunning']="Brukt tid";

$l['noHistory'] = 'Ingen tilgjengelig historikk';
$l['by']="av";
$l['at']="den";

$l['complete']="Fullført";

$l['approved']="Godkjent";
$l['declined']="Avvist";

$l['trigger']="Utløser";
$l["approvers"] = "Godkjennere";
$l["authorizedGroups"] = "Autoriserte grupper";
$l["authorizedUsers"] = "Autoriserte brukere";

// Language for model: \GO\Workflow\Model\Approver
$l["approverStep_id"] = "Trinn";
$l["approverUser_id"] = "Godkjenner";
$l["approverUser_name"] = "Brukere";

// Language for model: \GO\Workflow\Model\ApproverGroup
$l["approvergroupStep_id"] = "Trinn";
$l["approvergroupGroup_id"] = "Godkjennergruppe";
$l["approvergroupGroup_name"] = "Grupper";

// Language for model: \GO\Workflow\Model\Model
$l["modelId"] = "ID";
$l["modelModel_id"] = "Modell";
$l["modelModel_type_id"] = "Modelltype";
$l["modelProcess_id"] = "Prosess";
$l["modelStep_id"] = "Trinn";
$l["modelCtime"] = "Opprettet";
$l["modelDue_time"] = "Frist";
$l["modelShift_due_time"] = "Forskyv frist (timer)";

// Language for model: \GO\Workflow\Model\Process
$l["processId"] = "ID";
$l["processUser_id"] = "Bruker";
$l["processName"] = "Navn";
$l["processAcl_id"] = "Acl";

$l["processUser_name"] = "Eier";


// Language for model: \GO\Workflow\Model\Step
$l["stepId"] = "ID";
$l["stepProcess_id"] = "Prosess";
$l["stepSort_order"] = "Rekkefølge";
$l["stepName"] = "Navn";
$l["stepDescription"] = "Beskrivelse";
$l["stepDue_in"] = "Frist (timer)";
$l["stepEmail_alert"] = "E-postvarsling";
$l["stepPopup_alert"] = "Sprettoppvarsling";
$l["stepAll_must_approve"] = "Krever godkjennelse av alle";

// Language for model: \GO\Workflow\Model\StepHistory
$l["stephistoryId"] = "ID";
$l["stephistoryProcess_model_id"] = "Modell";
$l["stephistoryStep_id"] = "Trinn";
$l["stephistoryUser_id"] = "Bruker";
$l["stephistoryComment"] = "Kommentar";
$l["stephistoryCtime"] = "Opprettet";
$l["stephistoryStatus"] = "Status";

// Language for model: \GO\Workflow\Model\Trigger
$l["triggerModel_type_id"] = "Type";
$l["triggerModel_attribute"] = "Atributt";
$l["triggerModel_attribute_value"] = "Verdi";
$l["triggerProcess_id"] = "Prosess";


// Email that will be send to the approvers
$l["emailSubject"] = "Nye %s trenger din godkjennelse!"; // %s is the model name
$l["emailBody"] = "En ny %s trenger din godkjennelse.<br />
									 Du kan klikke<a href='%s'>her</a> for å se %s.<br /><br />
									 Klikk på en av lenkene nedenfor:<br /><br />
									 <a href='%s'>Godkjenn</a> | <a href='%s'>Avvis</a>";

$l['reminderSubject'] = "Forespørsel om godkjennelse!";

$l['visualTemplateTitle'] = "Workflow prosessen “{process_name}” i “{model_type}:{model_name}”";
$l['visualTemplateStartDate'] = "Startet den {start_time}";
$l['visualTemplateStepTitle'] = "{name} : {description}";
$l['visualTemplateStepApprovalStart'] = "Trenger godkjenning av ";
$l['visualTemplateOne'] = "en ";
$l['visualTemplateAll'] = "alle ";
$l['visualTemplateStepApprovalEnd'] = "av følgende brukere: {approvers}";
$l['visualTemplateStepDueAt'] = "<br>Frist: {due_at}";

$l['folderWorkflowText'] = "Angi en workflow som skal brukes for alle nye filer som lastes opp i denne mappen.";

$l['startedBy']= "Startet av";

$l['showOwnCreated'] = "Vis kun de jeg har opprettet";
$l['approve']= "Godkjenne";
$l['decline']= "Avvise";
$l['filesOnly']= 'Gjelder kun for filer';
$l['copyToFolder']= 'Kopier til denne mappen';
$l['keepOriginalCopy']= 'Kopiere i stedet for å flytte';
$l['actionType']= 'Handlingstype';
$l['workflowHistory']= 'Arbeidsflythistorikk';
$l['stepDeleted']= "Dette trinnet er slettet";
$l['modelTypeNotSupported']= 'I denne workflowen støttes ikke modelltypen "%m" av trinnet "%wm".';