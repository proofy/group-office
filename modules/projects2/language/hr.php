<?php

$l['name']='Projekti V2';
$l['description']='Vođenje projekta sa evidencijom vremena.';

$l['projects']='Projekti';

$l['project']='Projekt';
$l['status']='Status';
$l['statuses']='Statusi';
$l['type']='Tip';
$l['types']='Tipovi';

$l['ongoing']='U tijeku';
$l['complete']='Završeno';

$l['imported_events']='Uvezeno %s događaja.';
$l['ignored_events']='Ignorirano %s događaja zbog toga što je indentična rezervacija već bila pristuna.';

$l['days']='Dana';
$l['units']='Jedinice';
$l['units_budget']='Rezervirano jedinica';
$l['units_diff']='Preostalo jedinica';
$l['ext_fee_value']='Vanjske pristojbe';
$l['int_fee_value']='Unutarnje pristojbe';
$l['profit']='Zarada';
$l['fee']='Pristojba';

$l['type_not_empty']='Postoje projekti sa ovim tipom. Ne možete obrisati tip koji projekti koriste.';

$l['from_project']='Iz projekta';
$l['overall_totals']='Ukupni iznosi';
$l['project_totals']='Projektirani iznosi';
$l['template']='Predložak';

$l['template']='Predložak';
$l['templates']='Predlošci';

$l['total_budget']='Ukupni budžet';
$l['total_diff']='Ukupno preostalo';

$l['period']='Period';
$l['week_closed']='Zatvoreno';
$l['week_open']='Otvoreno';

$l['start_timer']='Pokreni brojač vremena za ovaj projekt';
$l['stop_timer']='Zaustavi brojač vremena za ovaj projekt';

$l['projectExists']='Projekt sa ovim imenom već postoji';
$l['template_event']='Predlošak jednog događaja';
$l['template_events']='Predložak više događaja';
$l['expense']='Trošak';
$l['expenses']='Troškovi';
$l['report_template']='Prijavi predložak';
$l['report_templates']='Prijavi predloške';
$l['report_page']='Prijavi stranicu';
$l['report_pages']='Prijavi stranice';

$l['custom_report']='Prilagođeni izvještaj';
$l['custom_reports']='Prilagođeni izvještaji';

$l['scheduled_invoice']='Faktura je uspješno pripremljena. Promjenite status fakture kao bi je poslali.';
$l['scheduled_invoices']='%s faktura je uspješno pripremljeno u modulu za naplaćivanje. Možete koristiti skriptu za serijsko slanje u modulu za naplaćivanje kako bi ih sve poslali.';

$l['nothing_to_invoice']='Niti jedna faktura nije kreirana zato što nije pronađena evidencija vremena ili troška u danom periodu.';

$l['noProjectManager']='Nije pronađen voditelj projekta za %s';
$l['reportAttached']='U PDF privitku naći će te izvještaj %s';
$l['allReportsSent']='Svi izvještaji su poslani';

$l['fee_per_unit']='Pristojba po jedinici';

$l['bill_item_template'] = '{project_name}: {registering_user_name} je radio {units} sati na {description} u {days} dana'."\n\n".'Ukupno: {total_price}. (Možete koristiti posebna polja od korisnika u ovom predlošku sa {col_x})';
$l['payout_item_template'] = '{project_name}: {description} od {responsible_user_name} je radio {units} sati u {days} dana'."\n\n".'Ukupno: {total_price}. (Možete koristiti posebna polja od voditelja u ovom predlošku sa {col_x})';

$l['path']='Putanja';

$l['summary_bill_item_template'] = "{project_name} {description} od {registering_user_name}\r\n".
"Jedinica:{units}\r\nDana:{days}\r\n";
$l['summary_payout_item_template'] = "{project_name} {description} od {responsible_user_name}\r\n".
"Jedinica: {units}, Dana: {days}\r\n";

$l['userFees']='Zadane pristojbe';
$l['project'] = 'Projekt';
$l['projects'] = 'Projekti';
$l['noProjects'] = 'Nema projekata za prikazati';
$l['projectInfo'] = 'Informacije o projektu';
$l['activeProjects'] = 'Aktivni projekti';
$l['units'] = 'Jedinice';
$l['responsible'] = 'Odgovoran';
$l['fee'] = 'Pristojba';
$l['valueMinutes'] = 'Vrijednost po minutama';
$l['internalFee'] = 'Unutarnje pristojbe';
$l['externalFee'] = 'Vanjske pristojbe';
$l['unitValue'] = 'Vijednost jedinice';
$l['noFees'] = 'Pristoje još nisu definirane';
$l['noHours'] = 'Nema sati za prikazati';
$l['timeTracking'] = 'Praćenje vremena';
$l['projectAdministration'] = 'Administracija projekta';
$l['specialFees'] = 'Specijalne pristojbe';
$l['milestone'] = 'Prekretnica';
$l['milestones'] = 'Prekretnice';
$l['noMilestones'] = 'Prekretnice nisu definirane za ovaj projekt';
$l['due'] = 'Dospjeva';
$l['completionTime'] = 'Vrijeme završetka';
$l['archiveProject'] = 'Završi ovaj projekt. Završeni projekti su uklonjeni iz padajućeg izbornika kada rezervirate sate.';
$l['bookPermission'] = 'Dozvole rezervacije';
$l['informationAbout'] = 'Informacija o';
$l['assignedTo'] = 'Dodjeljeno';
$l['noData'] = 'Nema podataka za prikazati';
$l['reportDetails'] = 'Detalji o izvještaju';
$l['datefieldsInfo'] = 'Ako ostavite polja datuma prazna dobit ćete statistiku za sva vremena. Možete duplo kliknuti na red kako bi vidjeli ili izvezli detalje u listu.';
$l['groupHoursBy'] = 'Grupiraj sate po';
$l['reports'] = 'Izvještaji';
$l['maxProjectsReached']='Maksimalan broj projekata je dosegnut. Kontaktirajte svojeg pružatelja usluge kako bi aktivirali neograničeno korištenje modula za projekte.';
$l['summary']='Kratki pregled';
$l['timeTracking']='Praćenje vremena';
/* table: pr2_statuses */
$l['status']="Status";
$l['statuses']="Statusi";
/* table: pr2_types */
$l['type']="Tip dozvole";
$l['types']="Tipovi dozvola";

$l['customer']='Kupac';
$l['filter']='Filter';

$l['dueAt']='Dospjeva';
$l['unitsBudget']='Budžetirane jedinice';
$l['profit']='Zarada';
$l['unitsLeft']='Jedinica ostalo';

$l['nextMonth']='Slijedeći mjesec';
$l['previousMonth']='Prošli mjesec';
$l['importEvents']='Uvezi sastanke';

$l['specifyFee']='Odredi pristojbu na svakoj rezervaciji';

$l['subprojects']='Podstavke';
$l['subproject']='Podstavka';

$l['unitsBooked']='Jedinica rezervirano';
$l['budgetReached']='Budžet jedinica je dosegnut!';
$l['projectEnded']='Ovaj projekt je već trebao biti završen!';

/* table: pr2_templates */
$l['template']="Predložak projekta";
$l['templates']="Predlošci projekta";

$l['confirmBookedHours']='Rezervirali ste {HOURS} sati. Da li ste sigurni da želite zatvoriti ovaj tjedan?';
$l['successBookedHours']='{HOURS} sati je rezervirano';
$l['openWeek']='Otvori tjedan';
$l['closeWeek']='Zatvori tjedan';
$l['weekOverview']='Tjedni pogled';
$l['totalBudget']='Ukupni budžet';
$l['totalDiff']='Ukupno preostalo';
$l['printMonths']='Ispiši mjesece';
$l['printUsers']='Ispiši korisnike';
$l['manageWeeks']='Upravljaj tjednima';
$l['timerRunning']='Tjedan ne može biti zatvoren. Brojač vremena je uključen za ovaj tjedan';
$l['goToWeek']='Idi na tjedan';
$l['goTo']='Idi na';
$l['selectWeek']='Odaberi tjedan';
$l['contact']='Kontakt';
$l['timer']='Brojač vremena';
$l['total']='<b>Ukupno</b>';
$l['tree']='Drvo projekata';
/* table: pr2_templates_events */
$l['templateEvent']="Radnja";
$l['templateEvents']="Radnje";
$l['timeOffset']="Počmi nakon (dana)";
$l['duration']="Trajanje (sati)";
$l['reminder']="Podsjetnik";

$l['projectManager']='Voditelj';

$l['startTime']='Datum početka';

$l['showMineOnly']='Prikaži samo moje projekte';


/* table: pr2_expenses */
$l['expense']="Trošak";
$l['expenses']="Troškovi";
$l['amount']="Iznos";
$l['income']="Prihod";
/* table: pr2_report_templates */
$l['reportTemplate']="Predložak izvještaja";
$l['reportTemplates']="Predlošci izvještaja";
$l['fields']="Polja";

/* table: pr2_report_pages */
$l['reportPage']="Stranica";
$l['reportPages']="Stranice";
$l['title']="NAslov";
$l['subtitle']="Podnaslov";
$l['content']="Sadržaj";


/* table: pr2_custom_reports */
$l['customReport']="Izvještaj";
$l['customReports']="Izvještaji";
$l['startTime']="Datum početka";
$l['endTime']="Datum završetka";

$l['selectTemplate']='Izaberi predložak';

$l['bill']='Račun';

$l['expenseTypes']='Tipovi troška';

$l['invoiceTogether']='Napravi fakturu za projekt i podprojekte zajedno';
$l['invoiceSeparately']='Napravi odvojenu fakturu za svaki podprojekt';

$l['billAlreadyBilled']='Također naplati sate i troškove koji su već bili naplaćeni';

$l['overrideDefaultFees']="Koristi druge pristojbe";
$l['incomeTypes']='Tipovi prihoda';
$l['fields']='Polja';

$l['emailProjectManagers']='Pošalji sa e-mailom voditeljima projekata';
$l['confirmEmailProjectManagers']='Da li ste sigurni da želite poslati svaki pojedini izvještaj skupno voditelju projekta?';


$l['batchReportSingle']='Napravi izvještaj za ovaj projekt';
$l['batchReportSubprojects']='Napravi izvještaj za svaki podprojekat';
$l['batchReportQuery']='Napravi izvještaj za svaki podprojekt koji odgovara upitu';

$l['query']='Upit';

$l['parentProject']='Roditeljski projekt';
$l['standardProjectFields']='Standardna polja projekta';

$l['header']='Zaglavlje';
$l['footer']='Podnožje';

$l['backgroundImage']='Pozadinska slika';
$l['customProjectFields']='Prilagođena polja projekta';
$l['customReportFields']='Prilagođena polja izvještaja';

$l['batchReports']='Skupni izvještaji';

$l['recipient']='Primatelj';
$l['payoutTimeregistrationUsers']='Isplati korisnike evidencije vremena';

$l['remindForTimeregistration']='Podsjeti za evidenciju vremena';
$l['remindForApproval']='Podsjeti za odobrenje';
$l['selectPeriod']='Odaberi period';
$l['tooltipSpecialFees']='Ako želite ovdje možete definirati neke dodatne pristojbe koje korisnici posebno mogu odabrati';
$l['tooltipDefaultFees']='Definirajte zadane pristojbe ovih korisnika';

$l['createNewPermissionsType']='Napravi novi tip dozvole';

$l['associations']='Udruživanja';
$l['useOwn']='Koristi svoj';
$l['noAssociation']='Bez udrživanja';
$l['useParentProject']='Koristi udruživanje roditeljskih projekata';

$l['hoursAlreadyApproved']='Sati su već odobreni i ne mogu se uređivati.';
$l['avoidPageBreaks'] ="Izbjegavaj prijelome stranica u izvještajima";

$l['itemTemplate'] = "Predložak stavki fakture (detaljni)";
$l['totalsReport'] = 'Izvještaj o ukupnim iznosima';

$l['defaultPermissionType']='Zadani tip dozvole';

$l['defaultStatus']='Zadani status';

$l['defaultStatus']='Zadani status';

$l['invoiceId'] = 'Broj fakture';


$l['availableCustomFields']='Dostupna posebna polja';
$l['customTabs']='Posebne kartice';
$l['enabledFields']='Omogućena polja';
$l['associatedCalendar']='Pridruženi kalendar';
$l['budgetAndFees']='Budžet i pristojbe';
$l['statusAndDate']='Status i datum';
$l['payoutInvoiceId'] = 'Broj fakture isplate';

$l['margins'] = 'Margine';
$l['top'] = 'Vrh';
$l['left'] = 'Lijevo';
$l['right'] = 'Desno';
$l['bottom'] = 'Dno';

$l['image']='Slika';
$l['height']='Visina';
$l['width']='Širina';
$l['projectCalendars']='Kalendari projekta';

$l['summarizedItems'] = 'Prikaži kratki pregled po projektu na prvoj stranici i detalje naknadno';
$l['createSingleOrderDoc'] = 'Napravi jedan dokument';
$l['orderDocFor'] = 'Dokument za';
$l['summaryItemTemplate'] = "Predložak stavki fakture (zbrojeno)";
$l['visible']='Prikaži';
$l['settings']='Postavke';
$l['followNumberFormat']='Format brojeva u slijedu';
$l['enableFollowNumber']='Omogući automatske brojeve u slijedu';
