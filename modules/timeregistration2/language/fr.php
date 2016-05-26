<?php


$l["timeregistrationMode"]='Mode enregistrement de temps';
$l["gridMode"]='Une grille regroupant tous les projets pour une entrée par projet par jour. Saisir des données est simple.';
$l["multipleMode"]='Enregistrements de temps multiples par projet par jour.';
$l["roundMinutes"]='Temps arrondi tous les';
$l["noRound"]= 'Pas d\'arrondi';
$l["minutes"]= 'minutes';
$l["showTimeregistrationFees"]='Afficher les flux dans l\'écran trackeur de temps';
$l["roundUp"]='Toujours arrondir';
$l["standardTask"]='Activité';
$l["standardTasks"]='Activités';
$l["none"]='Aucun';
$l["addStandardTask"]='Ajouter une tâche standard';
$l["delStandardTask"]='Supprimer une tâche standard';
$l["newStandardTask"]='Nouvelle tâche standard';
$l["code"]='Code';
$l["units"]='Unités';

$l["startTimer"]= 'Démarrer le chrono';
$l["stopTimer"]= 'Arréter le chrono';
$l["timerRunningSince"]= 'Le chrono tourne depuis';
$l["clickAtTimerBtn"]="Cliquez sur le bouton chrono pour l\'arréter";
$l["copyLastWeek"]='Copier les heures de la semaine dernière';
$l["copyLastWeekConfirm"]='Copier les heures enregistrées de la semaine dernière sur cette semaine ?';
$l['name']='Enregistreur de temps';
$l['description']='Gestion des enregistrements de temps pour les projets.';
$l['approvalRequiredSubject']='Approbation nécessaire';
$l['approvalRequiredBody']='%s a fait un enregistrement de temps. Il peut être approuvé %s';
$l['registeredHours']='Heures enregistrées en semaine de';
$l['date']='Date';
$l['hours']='Heures';
$l['approved'] = 'Approuvé';
$l['registeredBy'] = 'Enregistré par';
$l['manager'] = 'Manager';
$l['weekNotClosed'] = 'La semaine n\'est pas encore fermée.';
$l['weekClosed'] = 'Toutes les entrées de temps dans la semaine en cours sont fermées';
$l['weekAlreadyClosed'] = 'La semaine en cours est déjà fermée';
$l['monthClosed'] = "Toutes les entrées de temps dans le mois en cours sont fermées";
$l['monthAlreadyClosed'] = 'Le mois en cours est déjà fermé';

$l['printPage']='Page %s de %s';
$l['noDoubleCopy'] = 'Quelques heures n\'ont pas été copiées parce qu\'elles existaient déjà dans la semaine sélectionnée.';
$l['ErrorMultiGridMode'] = 'Vous ne pouvez pas ajouter un rendez-vous multiple dans l\'enregistreur de temps si le mode "Grille" est sélectionné !';

//Below are new since 4.1 TODO: see what can be removed above)
$l['timeEntries']="Entrées de temps";
$l['amountOfHours']="Heures travaillées hebdomadaires";
$l['workingHours']="Heures travaillées";
$l['startTime']= "Heure de départ";

$l['addEntry']="Ajouter une heure";
$l['endTime']="Heure de fin";
$l['notifications']='Notifications';
$l['endDate'] = "Date de fin";

$l["openWeek"]='Ouvrir une semaine';
$l["closeWeek"]='Fermer une semaine';
$l["openMonth"]='Ouvrir un mois';
$l["closeMonth"]='Fermer un mois';
$l['approve'] = 'Approuver';
$l['disapprove'] = "Désapprouver";
$l['aprovedAllClosed'] = "Toutes les entrées de temps fermées dans ce laps de temps ont été approuvées";

$l['since'] = "Depuis";
$l['employees'] = "Employés";
$l['employee'] = "Employé";
$l['hoursAbsence'] = 'Absence';
$l['hoursTotal'] = 'Total d\'heures';
$l['hoursWorked'] = 'Travaillé';
$l['hoursLeft'] = 'Vacances';
$l['holidaysTaken'] = 'Vacances prises';
$l['totalWorkdays'] = "Total jours travaillés";
$l['duration'] = "Durée";
$l['remainingWorktime'] = "Heures de travail restant";
$l['earnedLeaveTime'] = "Temps de congés acquis";

$l['absence'] = 'Absence';
$l['leaveTime'] = 'Congé';
//below is in mean language and should be removed someday
$l['days'] = 'Jours';
$l['day'] ='Jour';
$l['hour'] = "Heure";
$l['hours'] = "Heures";
$l['minutes'] = "Minutes";

$l['notifications'] = "Notifications";
$l['notification'] = "Notification";
// Notification messages
$l['noteMonthClosed'] = 'L\'utilisateur "%s" a terminé son quota de temps pour le mois %s'; //username, monthname
$l['noteMonthUnfinished'] = 'L\'utilisateur "%s" n\'a PAS terminé son quota de temps pour le mois %s'; //username, monthname
$l['noteNonWorkingEntry'] = 'L\'utilisateur "%s" a travaillé en dehors des heures des bureau le %s'; //username, date
$l['noteDailyLimit'] = 'L\utilisateur "%s" a travaillé plus de %d heures (%s heures au total)'; //username, hour limit, consequenthours
$l['noteWeeklyOvertime'] = 'L\'utilisateur "%s" a plus de %d%% heures supplémentaires hebdomadaires (%s heures au total)'; //username, percentage, total hours
$l['noteAbsenseEntry'] = 'L\'utilisateur %s a réservé une entrée de temps de type %s le %s'; //username, typeofabsense, date
$l['noteHourLimit'] = 'L\'utilisateur %s a travaillé %d heures consécutives sans prendre de pause le %s'; //username, hours, date
$l['noteWeekClosed'] = 'L\'utilisateur "%s" a terminé son quota de %s'; //username, weekname
$l['noteWeekUnfinished'] = 'L\'utilisateur "%s" n\'a PAS terminé son quota de %s'; //username, weekname


//Notification options dialog
$l['daysToFinishMonth']='Temps pour finir un mois';
$l['dailyHourLimit']='Limite de temps de travail quotidien';
$l['weeklyOvertime']='Limite de temps de travail hebdomadaire';
$l['maxHoursTillBreak']='Heures travaillées maximum avant une pause';
$l['minBreaktime']='Temps minimum de pause';

$l['nonBusinessDays'] = "Jours chomés"; //Holiday days
$l['nonBusinessDay'] = "Jour chomé";
$l['percentage'] = "Pourcentage";
$l['repeatYearly'] = "Répéter annuellement";
$l['from']="A partir de";
$l['till']="Jusqu'à";
$l['notificationOptions'] = "Options de notification";
$l['showAll'] = "Tout montrer";

$l['hoursBillable'] = "Les heures sont facturables";

$l['weekIsClosed'] = 'Cette semaine est fermée';

$l['weekTotal'] = 'Total d\'heures enregistrées (Hebdomadaire)';
$l['monthTotal'] = 'Total d\'heures enregistrées (Mensuel)';