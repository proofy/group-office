<?php
$l['name']='Workflow';
$l['description']='Workflow Prozesse erstellen. Aktionen müssen für jeden Schritt des Prozesses von den jeweils berechtigten Benutzern genehmigt werden.';
$l['workflow']="Workflow";
$l['filter']="Filter";
$l['showCompleted']="Zeige beendete";
$l['showRequiredOnly']="Zeige nur meine Genehigungen";
$l['properties']="Eigenschaften";
$l['processes']="Prozesse";
$l['steps']="Schritte";
$l['step']="Sschritt";
$l['process']="Prozess";
$l['progress']="Fortschritt";
$l['hoursleft']="Stunden übrig";
$l['timeRemaining']="Verbliebene Laufzeit";

$l['approvalrequiredby']="Genehmigung notwendig durch einen von";
$l['approvalrequiredbyall']="Genehigung durch alle notwendig";
$l['timerunning']="Zeit läuft seit";

$l['noHistory'] = 'Kein Verlauf verfügbar';
$l['by']="von";
$l['at']="durch";

$l['complete']="Fertig";

$l['approved']="Genehmigt";
$l['declined']="Abgelehnt";

$l['trigger']="Trigger";
$l["approvers"] = "Genehmiger";
$l["authorizedGroups"] = "Berechtigte Gruppen";
$l["authorizedUsers"] = "Berechtigte Benutzer";

// Language for model: GO_Workflow_Model_Approver
$l["approverStep_id"] = "Schritt";
$l["approverUser_id"] = "Genehmiger";
$l["approverUser_name"] = "Benutzer";

// Language for model: GO_Workflow_Model_ApproverGroup
$l["approvergroupStep_id"] = "Schritt";
$l["approvergroupGroup_id"] = "Genehmiger Gruppe";
$l["approvergroupGroup_name"] = "Gruppen";

// Language for model: GO_Workflow_Model_Model
$l["modelId"] = "ID";
$l["modelModel_id"] = "Modell";
$l["modelModel_type_id"] = "Modelltyp";
$l["modelProcess_id"] = "Prozess";
$l["modelStep_id"] = "Schritt";
$l["modelCtime"] = "Erstellt am";
$l["modelDue_time"] = "Fällig bis";
$l["modelShift_due_time"] = "Fälligkeit verschieben (Stunden)";

// Language for model: GO_Workflow_Model_Process
$l["processId"] = "ID";
$l["processUser_id"] = "Benutzer";
$l["processName"] = "Name";
$l["processAcl_id"] = "Acl";

$l["processUser_name"] = "Besitzer";


// Language for model: GO_Workflow_Model_Step
$l["stepId"] = "ID";
$l["stepProcess_id"] = "Prozess";
$l["stepSort_order"] = "Sortierung";
$l["stepName"] = "Name";
$l["stepDescription"] = "Beschreibung";
$l["stepDue_in"] = "fällig in in (Stunden)";
$l["stepEmail_alert"] = "eMail Alarm";
$l["stepPopup_alert"] = "Popup Alarm";
$l["stepAll_must_approve"] = "Genehmigung durch alle benötigt";

// Language for model: GO_Workflow_Model_StepHistory
$l["stephistoryId"] = "ID";
$l["stephistoryProcess_model_id"] = "Modell";
$l["stephistoryStep_id"] = "Schritt";
$l["stephistoryUser_id"] = "Benutzer";
$l["stephistoryComment"] = "Kommentar";
$l["stephistoryCtime"] = "Erstellt am";
$l["stephistoryStatus"] = "Status";

// Language for model: GO_Workflow_Model_Trigger
$l["triggerModel_type_id"] = "Typ";
$l["triggerModel_attribute"] = "Attribute";
$l["triggerModel_attribute_value"] = "Wert";
$l["triggerProcess_id"] = "Prozess";


// Email that will be send to the approvers
$l["emailSubject"] = "Neues Modell %s benötigt Ihre genehmigung!"; // %s is the model name
$l["disapproveSubject"] = "Abgelehnt: %s"; // %s is the model name
$l["emailBody"] = "Neues Modell %s benötigt Ihre genehmigung.<br />
				     Bitte <a href='%s'>klicken</a> Sie hier um %s anzuzeigen.<br/><br/>
				     Klicken Sie auf einen der Links unten:<br/><br/>
				     <a href='%s'>Genehmigt</a> | <a href='%s'>Abgelehnt</a>";
$l["disapprovedBody"] = "%s hat %s in verändert %s. Es wurde kürzlich von %s abgelehnt.";

$l['reminderSubject'] = "Genehmigungsanfrage!";
$l['reminderDisapproved'] = "%s abgelehnt durch %s.";

$l['visualTemplateTitle'] = "Workflowprozess “{process_name}” auf “{model_type}:{model_name}”";
$l['visualTemplateStartDate'] = "Gstartet am {start_time}";
$l['visualTemplateStepTitle'] = "{name} : {description}";
$l['visualTemplateStepApprovalStart'] = "Benötigt Genehmigung durch ";
$l['visualTemplateOne'] = "einen ";
$l['visualTemplateAll'] = "alle ";
$l['visualTemplateStepApprovalEnd'] = "dieser Benutzer: {approvers}";
$l['visualTemplateStepDueAt'] = "<br>Fällig am: {due_at}";

$l['folderWorkflowText'] = "Wählen Sie einen Workflowprozess, der mit jeder neuen Datei in diesem Ordner verknüpft wird.";

$l['startedBy']= "Gestartet durch";

$l['showOwnCreated'] = "Zeige nur meine";

$l['approve']= "Genehmigen";
$l['decline']= "Ablehnen";

$l['modelTypeNotSupported'] = 'In diesem Workflow, wird der Modeltyp "%m" nicht unterstützt durch die Aktion "%wm".';
$l['filesOnly'] = 'Gilt nur für Dateien';
$l['copyToFolder'] = 'In diesen Ordner kopieren';
$l['keepOriginalCopy'] = 'Kopieren anstatt verschieben';

$l['actionType'] = 'Aktiontyp';

$l['workflowHistory'] = 'Workflow-Verlauf';
$l['stepDeleted']= "Schritt ist gelöscht";

