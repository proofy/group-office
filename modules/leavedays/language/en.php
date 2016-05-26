<?php
$l['name']='Holidays';
$l['description']='Module for holiday management of personnel.';

$l['id'] = 'ID';
$l['leaveday'] = 'Holiday';
$l['leavedays'] = 'Holidays';
$l['firstDate'] = 'First date';
$l['lastDate'] = 'Last date';
$l['hours'] = 'Hours';
$l['strDescription'] = 'Description';
$l['employee'] = 'Employee';
$l['comments'] = 'Comments';
$l['leaveHours'] = 'Leave hours';

$l['couldNotGetLdModel'] = 'Could not retrieve leave day model with ID #%s.';

$l['workingWeek'] = 'Working week';
$l['weekMo'] = 'Monday';
$l['weekTu'] = 'Tuesday';
$l['weekWe'] = 'Wednesday';
$l['weekTh'] = 'Thursday';
$l['weekFr'] = 'Friday';
$l['weekSa'] = 'Saturday';
$l['weekSu'] = 'Sunday';

$l['year'] = 'Year';
$l['leaveHourCredits'] = 'Holiday hour credits';

$l['yearCredit'] = 'Year credit';
$l['yearCredits'] = 'Year credits';

$l['couldNotSaveWW'] = 'Could not save working week info.';
$l['noUser'] = 'Could not find user with ID #%s.';
$l['mustBeSameYear'] = 'The first date and last date must be in the same year.';
$l['couldNotSaveYC'] = 'Could not save year credit record of year %s.';

$l['workingHours'] = 'Working hours';
$l['years'] = 'Years';
$l['currentYearCredit'] = 'Yearly credit';
$l['builtUpCredit'] = 'Built up';
$l['creditsUsed'] = 'Used';
$l['leftover'] = 'Leftover';
$l['currentMonthCredit'] = 'Available now';
$l['leftoverAndCurrentCredit'] = 'Sum';
$l['currentCreditsUsed'] = 'Hours used current year';
$l['wholeYearCredit'] = 'Available year';
$l['thisYearCredit'] = 'Available this year';
$l['thisMonthCredit'] = 'Available this month';

$l['hoursSummary'] = 'Leave hours summary';

$l['noYearCreditInfo'] = 'No year credit info found for year %s and user ID #%s.';

$l['pastLeftover'] = 'Past leftover hours';
$l['mustBeCurrentYear'] = 'The holiday entry must be completely in the year %y.';
$l['createYearCredit'] = 'Create year credit';
$l['ycAlreadyExists'] = 'Year credit record already exists for that employee in the selected year.';
$l['noYearCredit'] = 'There is no information available about your holiday credit in %s.';

$l['copyLastYearsCredits'] = 'Copy last year\'s credits';
$l['copyLastYearsCreditsRUSure'] = 'This will copy all the credits from %y1 to %y2, overwriting credits of %y2. Continue?';

$l['overlappingLeaveDays'] = 'Another holiday entry overlaps with the current one. Current holiday entry not saved.';

$l['editWorkingWeek'] = 'Edit working week';

$l['manager']='Manager';

$l['approved']='Approved';

$l['newHolidayEntrySubject']='New holiday entry';
$l['newHolidayEntryBody']='{user} made a new holiday entry starting at {first_date}. Please review and approve it.';
$l['newHolidayEntryBodyNegativeCredit']='Important: the entry\'s month now has a negative holiday credit of {n_credits}.';

$l['approvedHolidayEntrySubject']='Holiday entry approved';
$l['approvedHolidayEntryBody']='{manager} approved your holiday entry starting at {first_date}.';

$l['disapprovedHolidayEntrySubject']='Holiday entry disapproved';
$l['disapprovedHolidayEntryBody']='{manager} disapproved your holiday entry starting at {first_date}.';

$l['addHoliday']='Add holiday';

$l['nationalHoliday'] = 'National holiday hours';
$l['hoursNationalHolidays'] = 'Hours nat. holidays';
$l['usedNatHolidayHours'] = 'Used nat. holiday hours';

$l['csvFileName'] = 'Holiday bookings on national holidays in %s.csv';
$l['csvEmployee'] = 'Employee';
$l['csvHolidayDesc'] = 'Holiday description';
$l['csvHolidayStart'] = 'First vacation day';
$l['csvHolidayEnd'] = 'Last vacation day';
$l['csvBookedHours'] = 'Booked hours in holiday';
$l['csvNatHoliday'] = 'Nation holiday';
$l['csvNatHolidayDate'] = 'National holiday date';

$l['availableHours'] = 'Available holiday hours';
$l['january'] = 'Jan';
$l['february'] = 'Feb';
$l['march'] = 'Mar';
$l['april'] = 'Apr';
$l['may'] = 'May';
$l['june'] = 'Jun';
$l['july'] = 'Jul';
$l['august'] = 'Aug';
$l['september'] = 'Sep';
$l['october'] = 'Oct';
$l['november'] = 'Nov';
$l['december'] = 'Dec';

$l['errorApprove'] = "You may not approve your own leave days";

$l['hrs'] = 'h';
$l['from'] = 'From';
$l['monthView'] = 'Month View';
$l['noHolidaysTaken'] = 'There are no holidays taken this month';
$l['monthReport'] = 'Month report';
$l['month'] = 'Month';
$l['reload'] = 'Reload';
$l['noHours'] = 'Please enter a number of hours';

$l['credittypes'] = 'Credit types';
$l['type'] = 'Type';
$l['credit_doesnt_expired'] = 'Remaining credit may automatically taken to next year';
$l['holiday_request'] = 'Holiday request';
$l['year_summary'] = 'Year summary';

$l['total'] = 'total';
$l['used'] = 'used';
$l['credit'] = 'credit';

$l['errCreditAlreadyGiven'] = 'Yearcredit is already given for this user in this year.';
$l['errCreditTypeAlreadyInUse'] = 'Error credit type already in use!';

$l['starttimeForCalendar'] = 'Start time for calendar';


$l['removeYearCreditNotPossibleIfLeavedayIsSet'] = 'Can\'t remove year credit with bookings. Please remove bookings first.';