<?php
$l['name']='Procédures - Workflow';
$l['description']='Crée des procédures de validation. Définition des étapes qui doivent être validées par les utilisateurs.';
$l['workflow']="Procédure";
$l['filter']="Filtrer";
$l['showCompleted']="Afficher les validations complétées";
$l['showRequiredOnly']="Afficher mes validation en attente seulement";
$l['properties']="Propriétés";
$l['processes']="Process";
$l['steps']="Étapes";
$l['step']="Étape";
$l['process']="Process";
$l['progress']="Progression";
$l['hoursleft']="Heures restantes";
$l['timeRemaining']="Temps restant";

$l['approvalrequiredby']="Validation requise par un parmi";
$l['approvalrequiredbyall']="Validation requise par tous";
$l['timerunning']="Temps écoulé";

$l['noHistory'] = 'Pas d\'historique disponible';
$l['by']="par";
$l['at']="a";

$l['complete']="Complet";

$l['approved']="Validé";
$l['declined']="Rejeté";

$l['trigger']="Trigger";
$l["approvers"] = "Validateurs";
$l["authorizedGroups"] = "Groupes autorisés";
$l["authorizedUsers"] = "Utilisateurs autorisés";

// Language for model: \GO\Workflow\Model\Approver
$l["approverStep_id"] = "Étape";
$l["approverUser_id"] = "Validateur";
$l["approverUser_name"] = "Utilisateurs";

// Language for model: \GO\Workflow\Model\ApproverGroup
$l["approvergroupStep_id"] = "Étape";
$l["approvergroupGroup_id"] = "Groupe de validateur";
$l["approvergroupGroup_name"] = "Groupes";

// Language for model: \GO\Workflow\Model\Model
$l["modelId"] = "ID";
$l["modelModel_id"] = "Modèle";
$l["modelModel_type_id"] = "Type de modèle";
$l["modelProcess_id"] = "Process";
$l["modelStep_id"] = "Étape";
$l["modelCtime"] = "Crée le";
$l["modelDue_time"] = "Date limite";
$l["modelShift_due_time"] = "Décaler la date limite (heures)";

// Language for model: \GO\Workflow\Model\Process
$l["processId"] = "ID";
$l["processUser_id"] = "Utilisateur";
$l["processName"] = "Nom";
$l["processAcl_id"] = "Acl";

$l["processUser_name"] = "Propriétaire";


// Language for model: \GO\Workflow\Model\Step
$l["stepId"] = "ID";
$l["stepProcess_id"] = "Process";
$l["stepSort_order"] = "Ordre de tri";
$l["stepName"] = "Nom";
$l["stepDescription"] = "Description";
$l["stepDue_in"] = "Date limite dans (heures)";
$l["stepEmail_alert"] = "Alerte email";
$l["stepPopup_alert"] = "Alerte popup";
$l["stepAll_must_approve"] = "Validation requise par tous";

// Language for model: \GO\Workflow\Model\StepHistory
$l["stephistoryId"] = "ID";
$l["stephistoryProcess_model_id"] = "Modèle";
$l["stephistoryStep_id"] = "Étape";
$l["stephistoryUser_id"] = "Utilisateur";
$l["stephistoryComment"] = "Commentaire";
$l["stephistoryCtime"] = "Crée le";
$l["stephistoryStatus"] = "Statut";

// Language for model: \GO\Workflow\Model\Trigger
$l["triggerModel_type_id"] = "Type";
$l["triggerModel_attribute"] = "Attribut";
$l["triggerModel_attribute_value"] = "Valeur";
$l["triggerProcess_id"] = "Process";


// Email that will be send to the approvers
$l["emailSubject"] = "Nouveau %s nécessite votre validation !"; // %s is the model name
$l["disapproveSubject"] = "Désapprouvé : %s"; // %s is the model name
$l["emailBody"] = "Un nouveau %s nécessite votre validation.<br />
									 Veuillez <a href='%s'>cliquer</a> ici pour voir le %s.<br /><br />
									 Cliquez sur un des liens ci-dessous :<br /><br />
									 <a href='%s'>Valider</a> | <a href='%s'>Rejeter</a>";
$l["disapprovedBody"] = "%s a déposé %s dans %s. Il a été récemment désapprouvé par %s.";
									 
$l['reminderSubject'] = "Demande de validation !";
$l['reminderDisapproved'] = "%s désapprouvé par %s.";

$l['visualTemplateTitle'] = "Procédure '{process_name}' sur '{model_type} : {model_name}'";
$l['visualTemplateStartDate'] = "Commencé le {start_time}";
$l['visualTemplateStepTitle'] = "{name} : {description}";
$l['visualTemplateStepApprovalStart'] = "Requiert une validation par";
$l['visualTemplateOne'] = "un de";
$l['visualTemplateAll'] = "tous ";
$l['visualTemplateStepApprovalEnd'] = "de ces utiisateurs : {approvers}";
$l['visualTemplateStepDueAt'] = "<br>Date limite le : {due_at}";

$l['folderWorkflowText'] = "Sélectionnez une procédure qui va être attachée à chaque nouveau fichier que vous créérez dans ce répertoire.";

$l['startedBy']= "Commencé par";

$l['showOwnCreated'] = "Uniquement créés par moi";

$l['approve']= "Valider";
$l['decline']= "Rejeter";

$l['modelTypeNotSupported'] = 'Dans ce workflow, le type de modèle "%m" n\'est pas supporté par l\'étape d\'action "%wm".';
$l['filesOnly'] = 'Appliqué uniquement aux fichiers';
$l['copyToFolder'] = 'Copier dans ce répertoire';
$l['keepOriginalCopy'] = 'Copier plutôt que déplacer';

$l['actionType'] = 'Type d\'action';

$l['workflowHistory'] = 'Historique de Workflow';
$l['stepDeleted']= "L\'étape est supprimée";
