<?php


$l['name']='Tikety';
$l['description']='Modul, který umožňuje vytvářet tikety v rámci podpory';
$l['type']='Typ';
$l['types']='Typy';
$l['tickets']='Tikety';
$l['ticket_status']='Stav tiketu';
$l['ticket_statuses']='Stavy tiketu';
$l['template']='Šablona';
$l['templates']='Šablony';
$l['item']='Položka';
$l['items']='Položky';
$l['language']='Jazyk';
$l['languages']='Jazyky';
$l['sent']= 'Odeslané';
$l['accepted']='Přijaté';
$l['lost']='Ztracené';
$l['none']='Žádné';
$l['default']='Výchozí';
$l['nobody']='Nikdo';
$l["nobody"]='Nikdo';
$l["ticketGroups"]= 'Skupiny tiketů';
$l["ticketGroup"]= 'Skupina tiketu';
$l["noAclId"]= 'Existující model byl úspěšně zpracován na serveru, ale s neplatným acl_id. Prosím kontaktujte svého {product_name} administrátora a sdělte mu co se přesně stalo před touto chybou.';
$l['no_email_template']='Není definována žádná e-mailová šablona!';
$l['invald_email']='Neplatná e-mailová adresa';
$l['sendout']='Odeslat komentář kontaktu';
$l['issendout']='Kontakt byl informován';
$l['priority']='Priorita';
$l['priority_level'][0]='Nízká';
$l['priority_level'][1]='Normální';
$l['priority_level'][2]='Vysoká';
$l['status_open']='Otevřené';
$l['status_closed']='Dokončené';
$l['ticket_claim_error']='Tiket je požadován od ';
$l['ticket_assigned_by']='Přidělen';
$l['ticket_updated_by']='Upraven';
$l['ticket_action']['responded_by']='Odpovědný';
$l['subject']='Předmět';
$l['question_issue']='Otázka / Záležitost';
$l['send']='Odeslat';
$l['new_message']='Nová zpráva';
$l['status_change']='Stav změněn na';
$l['attachments']='Přílohy';
$l['mtime']='Upraven v';
$l['ctime']='Vytvořen v';
$l['data']='Data';
$l['page']='Stránka';
$l['view_ticket']='Zobrazit tiket';
$l['new_ticket']='Nový tiket';
$l['deleted_user']='Vymazaný uživatel';
$l['template_default_name']='Výchozí odpověď';
$l['template_default_content']='Milý pane/Milá paní
Dostali jsme od Vás požadavek na vytvoření nového tiketu.
Děkujeme za Váš požadavek,
{MESSAGE}
Prosím neodpovídejte na tento email. Pro odpověď následujte tuto stránku:
{LINK}
s pozdravem,
{NAME}.';
$l['template_created_by_client_name']='Výchozí tiket vytvořen od klienta';
$l["ticket_created_for_agent"]='Tiket vytvořen pro agenta';
$l["ticket_claim_notification"]='Tiket označující upozornění';

$l['template_created_by_client_content']='Milý pane/Milá paní
Obdrželi jsem Váš dotaz a tiket byl vytvořen.
Budeme reagovat co nejdříve to bude možné.
Níže můžete vidět Váš dotaz:
---------------------------------------------------------------------------
{MESSAGE}
---------------------------------------------------------------------------
Prosím neodpovídejte na tento email. Pro odpověď následujte tuto stránku:
{LINK}
s pozdravem,
{NAME}.';
$l['template_created_for_client_name']='Výchozí tiket vytvořen pro klienta';
$l['template_created_for_client_content']='Milý(á) pane/paní
Vytvořili jsem pro Vás nový tiket.
Budeme reagovat co nejdříve to bude možné.
Níže můžete vidět Váš dotaz:
---------------------------------------------------------------------------
{MESSAGE}
---------------------------------------------------------------------------
Prosím neodpovídejte na tento email. Pro odpověď následujte tuto stránku:
{LINK}
s pozdravem,
{NAME}.';
$l['template_for_agent_name']='Výchozí zpráva pro agenta';
$l['template_for_agent_content']='Číslo: {NUMBER}
Předmět: {SUBJECT}
Vytvořeno: {CREATEDBY}
Společnost: {COMPANY}

URL: {LINK}

{MESSAGE}';

$l['template_for_agent_claim_name']='Výchozí zpráva pro "claim" agenta';
$l['template_for_agent_claim_content']="{AGENT} dostal Váš tiket a nyní na něm pracuje. Budeme Vás informovat o průběhu.";


$l['example_type1']='IT';
$l['example_type2']='Prodej';
$l['example_status1']='Probíhající';
$l['example_status2']='Nevyřešené';
$l['all_types']='Všechny typy';
$l['viewticketTitle']='Zákazníci | Podrobnosti tiketu';
$l['createticketTitle']='Zákazníci | Nový tiket';
$l['customer_message']='Toto je náš systém podpory.;
Prosím vyplňte Vaše kontaktní informace a popis Vašeho problému.';
$l['response_message']='Děkujeme, že jste nás kontaktovali.
Obdrželi jsme Váš dotaz a byl vytvořen tiket pro Vás. Budeme reagovat co nejdříve.;
Pro budoucí využití, Vašemu dotazu byl vytvořen tiket s následujícím číslem {TICKET_NUMBER}.';
$l['period']='Doba';
$l['invoiceCreated']='Vytvořené faktury';
$l['invoicesCreated']='%s faktur(a/y) vytvořeno';
$l['number']='Číslo';
$l['newTicketSubject']='Nový tiket v typu %s vytvořil(a) %s';
$l['bill_item_template']="{date} #{number} tarif: {rate_name}\n{subject}";
$l['no_read_access']="Klient nemá oprávnění pro čtení tohoto typu";
$l['incomplete_delete']='Nemáte oprávnění pro smazání všech vybranách tiketů';
$l['strAutomaticClosed'] = 'Tento tiket byl automaticky uzavřen, protože zákazník neodpověděl během {expire_days} dne(dnů).';
$l['january'] = 'Led';
$l['february'] = 'Úno';
$l['march'] = 'Bře';
$l['april'] = 'Dub';
$l['may'] = 'Kvě';
$l['june'] = 'Čer';
$l['july'] = 'Čvc';
$l['august'] = 'Srp';
$l['september'] = 'Zář';
$l['october'] = 'Říj';
$l['november'] = 'Lis';
$l['december'] = 'Pro';
$l["ticket"]='Tiket';
$l['ticket']='Tiket';
$l["tickets"]='Tikety';
$l["type"]="Typ";
$l["types"]="Typy";
$l["status"]="Stav";
$l["statuses"]="Stavy";
$l["ticketId"]="ID tiketu";
$l["createTicket"]='Vytvořit tiket';
$l["editTicket"]='Upravit tiket';
$l["reopen"]='Znovu otevřít';
$l["reopenTooltip"]='Znovu otevřít tiket';
$l["claim"]='Přiřadit Vám';
$l["unclaim"]='Zrušit přiřazení';
$l["claimTooltip"]='Přiřadit tento tiket';
$l["unclaimTooltip"]='Zrušit přiřazení tiketu';
$l["closeTicket"]='Uzavřít tiket';
$l["ticketDetails"]='Přehled tiketu';
$l["agent"]='Odpovědný';
$l["contact"]='Kontakt';
$l["unknownContact"]='<neznámý>';
$l["company"]='(společnost)';
$l["message"]='Zpráva';
$l["messages"]='Zprávy';
$l["editMessage"]='Upravit zprávu';
$l["newMessage"]='Nová zpráva';
$l["statusChange"]='* Stav změněn na';
$l["is_note"]='Poznámka';
$l["attachments"]='Přílohy';
$l["changeTicketStatus"]='Změnit tiket ze stavu';
$l["notified"]="Informován";
$l["notifyContact"]="Informovat zákazníka";
$l["notifyContactCheck"]="Vždy informovat zákazníka";
$l["template"]="Šablona";
$l["templates"]="Šablony";
$l["emailTemplates"]="E-mailová šablona";
$l["select_template"]="Použít e-mailovou šablonu";
$l["priority"]='Priorita';
$l["priority_low"]='Nízká';
$l["priority_normal"]='Normalní';
$l["priority_high"]='Vysoká';
$l["status_open"]='Otevřené';
$l["options"]='Nastavení';
$l["default_type"]='Výchozí typ';
$l["default_template"]='Výchozí šablona';
$l["auto_reply"]='Automatická odpověď';
$l["ticket_created_for_client"]='Tiket vytvořen pro klienta';
$l["markAsRead"]='Označit jako přečtené';
$l["markAsUnread"]='Označit jako nepřečtené';
$l["url"]='URL adresa';
$l["logo"]='Logo';
$l["customer_message_label"]='Zákaznická zpráva z externí stránky';
$l["response_message_label"]='Tiket uložený z externí stránky';
$l["show_external"]='Zobrazit externí adresu';
$l["show_from_others"]='Zobrazit tikety ostatních s tímto typem běžným uživatelům';
$l["showMineOnly"]='Zobrazit pouze mé tikety';
$l["addTicket"]='Vytvořit tiket';
$l["attachFiles"]='Připojit soubor';
$l["rates"]='Tarify';
$l["rate"]='Tarif';
$l["amount"]='Částka';
$l["rateHours"]='Tarif / Hodiny';
$l["rateTotals"]='Sazba činí';
$l["bill"]='Účet';
$l["toStatus"]='na stav';
$l["fromStatus"]='Ze stavu';
$l["noRate"]='Žádný tarif';
$l["notifyAgents"]='Upozornit uživatele e-mailem, pokud je založen nový tiket.';
$l["notifyAdmin"]="Odeslat e-mail také uživatelům ze skupiny 'Administrátoři'";
$l["youHaveNewTickets"]='Máte {new} nový tiket(y)';
$l["messageTemplate"]='Šablona zprávy';
$l["sendMessage"]='Odeslat zprávu';
$l["saveAsNote"]='Uložit jako poznámku';
$l["ticketDeleted"]='Tiket již delší dobu neexistuje';
$l["changeTicketsWithoutHoursToo"]='Změnit stav tiketu bez zamluvených hodin';
$l["expireDays"]= 'Počet dnů, během kterých musí zákazník odpovědět. Pokud se tak nestane, tiket bude automaticky uzavřen. Nastavte  0 pro vypnutí této funkce.';

$l['total'] = 'Celkem';
$l['amount'] = 'Částka';
$l['run_time'] = 'Doba';
$l['invalid_company_id'] = 'Chyba: nesprávné company id pro načtení firemních cen. Prosím kontaktujte svého {product_name} administrátora a sdělte mu co se přesně stalo před touto chybou.';
$l['rateSaveErrorOnName'] = 'Problém při ukládání tarifu ';
$l['reportToAdmin'] = 'Prosím kontaktujte svého {product_name} administrátora a sdělte mu co se přesně stalo před touto chybou.';

$l['groupBy'] = 'Jeden účet pro vše';
$l['company'] = 'Společnost';
$l['customerAccount'] = 'Zákaznický účet';

$l['invoiceErrorStatus']='Chybový stav';
$l['invoiceMissingCompany']="Tiket nemá společnost pro fakturaci";
$l['nothingToInvoice']="Stav byl změněn v důsledku fakturace, ale žádné hodiny nebyly zaúčtovány";

$l['useAlternativeUrl']='Použít alternativní URL';
$l['ticketEmail_on_new']='E-mail pro nové';

$l['modifiedTicketSubject']='Tiket s typem %s byl změněn v %s';
$l['emailToAgent']="Odeslat zprávu agentovi pokud zákazník odpoví";

$l["ticketTicket_number"] = "Číslo tiketu";
$l["ticketTicket_verifier"] = "Ověření tiketu";
$l["ticketPriority"] = "Priorita";
$l["ticketStatus_id"] = "Stav";
$l["ticketType_id"] = "Typ";
$l["ticketUser_id"] = "Uživatel";
$l["ticketAgent_id"] = "Agent";
$l["ticketContact_id"] = "Kontakt";
$l["ticketCompany"] = "Společnost";
$l["ticketCompany_id"] = "Společnost (ID)";
$l["ticketFirst_name"] = "Křestní jméno";
$l["ticketMiddle_name"] = "Prostřední jméno";
$l["ticketLast_name"] = "Příjmení";
$l["ticketEmail"] = "E-mail";
$l["ticketPhone"] = "Telefon";
$l["ticketSubject"] = "Předmět";
$l["ticketCtime"] = "Vytvořeno v";
$l["ticketMtime"] = "Změněno v";
$l["ticketFiles_folder_id"] = "Složka";
$l["ticketUnseen"] = "Nepřečtený";
$l["ticketGroup_id"] = "Skupina";
$l["ticketOrder_id"] = "Objednávka";

$l["invalid_agent"] = "Zvolený agent nemůže být zodpovědný za tiket tohoto typu";
$l['neverCloseStatus']="Nikdy nezavírat tikety s tímto stavem";

$l['customSender'] = "Použít alternativního odesílatele v e-mailech pro zákazníka";
$l['customSenderName'] = "Jméno alternativního odesílatele";
$l['customSenderEmail'] = "E-mail alternativního odesílatele";

$l['read']='Přečtené';

$l['assignedTo']='Přiřazeno';

$l['cronReminderLabel'] = 'Připomínky pro nezodpovězené tikety';
$l['cronReminderDescription'] = 'Naplánovaná úloha přidá nezodpovězené tikety do připomínek.';

$l['disableReminderAssigned'] = 'Zakázat připomínky při přiřazení agenta';
$l['disableReminderUnanswered'] = 'Zakázat připomínky pro nezodpovězené tikety';

$l['enableExternalPage'] = 'Povolit externí stránku pro tikety';
$l['ExternalPage'] = 'externí stránka pro tikety';
$l['enableAnonymousTickets'] = 'Povolit vytvoření tiketů pro neznámé uživatele';
$l['customTicketPageCss'] = 'Vlastní CSS pro externí stránku pro tikety';
$l['customTicketPageCssText'] = 'V poli níže můžete přidat css řádky pro použití na externí stránka pro tikety. <br /> Stránka má třídu: external-ticket-page <br /> Například:<br /> .external-ticket-page input { border:1px solid #000;}';
$l['installExternalSite'] = 'Modul "stránky" a/nebo "výchozí stránka" nejsou nainstalovány, chcete je nyní nainstalovat?';
$l['goToExternalPage'] = 'Zobrazit externí stránku pro tikety';

$l['importMailbox']="E-mailová schránka pro nové tikety";

$l['typeGroup'] = "Typ skupiny";
$l['manageGroups'] = "Správa skupin";
$l['general'] = "Obecné";

$l['deletePermissionError']='Tiket mohou smazat pouze uživatelé, kteří mají oprávnění "Správa" pro modul "Tikety"';

$l['importCaution']='<b>Pozor!</b> Vybraná IMAP schránka bude automaticky importovat zprávy do tiketů. Všechny zprávy ze schránky budou automaticky SMAZÁNY po importu. Musí být vybrán lokální poštovní účet.';
$l['deleteTypeWithTicketsError']="Nemůže být smazán typ, který obsahuje tikety";
$l['noSubject']='Žádný předmět';

$l['csvWithRates']='CSV se sazbami';

$l['solved']='Vyřešeno';
$l['solvedTickets']='Uzavřené tikety dle uživatele';
$l['averageSolvingTime']='Průměrná doba tiketu';
$l['averageResponseTime']='Průměrná doba odpovědi';

$l['ccNotificationsTo'] = 'Kopie (CC) upozornění na';

$l['currentTickets'] = 'Aktuální počet tiketů';
$l['unassigned'] = 'Nepřiřazené';
$l['nCurrentTickets'] = 'Počet aktuálních tiketů';
$l['closedTicketsInMonth'] = 'Uzavřené tikety v tomto měsíci';
$l['byType'] = 'Tikety dle typů';

$l["changeTicketType"]='Změnit typ tiketu';
$l["typeChange"] = '* typ byl změněn na';

$l['leaveTypeBlankByDefault'] = 'Po vytvoření tiketu, automaticky nevybírat výchozí typ';