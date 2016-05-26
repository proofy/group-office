<?php

namespace GO\Tickets;


class TicketsModule extends \GO\Professional\Module{
	
	public function appCenter(){
		return true;
	}
	
	public function install() {
		parent::install();
		$template = new Model\Template();
		$template->name = \GO::t('template_default_name','tickets');
		$template->content = \GO::t('template_default_content','tickets');
		$template->autoreply=0;
		$template->default_template=1;
		$template->ticket_created_for_client=0;
		$template->save();
		
		$template = new Model\Template();
		$template->name = \GO::t('template_created_by_client_name','tickets');
		$template->content = \GO::t('template_created_by_client_content','tickets');
		$template->autoreply=1;
		$template->default_template=0;
		$template->ticket_created_for_client=0;
		$template->save();
		
		$template = new Model\Template();
		$template->name = \GO::t('template_created_for_client_name','tickets');
		$template->content = \GO::t('template_created_for_client_content','tickets');
		$template->autoreply=0;
		$template->default_template=0;
		$template->ticket_created_for_client=1;
		$template->save();
		
		
		$type = new Model\Type();
		$type->publish_on_site=true;
		$type->name=\GO::t('example_type1','tickets');
		$type->save();
		
		$type->acl->addGroup(\GO::config()->group_everyone, \GO\Base\Model\Acl::WRITE_PERMISSION);
		
		$type = new Model\Type();
		$type->name=\GO::t('example_type2','tickets');
		$type->save();
		
		$type->acl->addGroup(\GO::config()->group_everyone, \GO\Base\Model\Acl::WRITE_PERMISSION);
		
		$status = new Model\Status();
		$status->name = \GO::t('example_status1','tickets');
		$status->save();
		
		$status = new Model\Status();
		$status->name = \GO::t('example_status2','tickets');
		$status->save();
		
		$settings = new Model\Settings();
		$settings->id=1;
		$settings->save();
		
		
		$cron = new \GO\Base\Cron\CronJob();
		
		$cron->name = 'Close inactive tickets';
		$cron->active = true;
		$cron->runonce = false;
		$cron->minutes = '0';
		$cron->hours = '2';
		$cron->monthdays = '*';
		$cron->months = '*';
		$cron->weekdays = '*';
		$cron->job = 'GO\Tickets\Cron\CloseInactive';

		$cron->save();
		
		
		$cron = new \GO\Base\Cron\CronJob();
		
		$cron->name = 'Ticket reminders';
		$cron->active = true;
		$cron->runonce = false;
		$cron->minutes = '*/5';
		$cron->hours = '*';
		$cron->monthdays = '*';
		$cron->months = '*';
		$cron->weekdays = '*';
		$cron->job = 'GO\Tickets\Cron\Reminder';

		$cron->save();
		
		$cron = new \GO\Base\Cron\CronJob();
		
		$cron->name = 'Import tickets from IMAP';
		$cron->active = true;
		$cron->runonce = false;
		$cron->minutes = '0,5,10,15,20,25,30,35,40,45,50,55';
		$cron->hours = '*';
		$cron->monthdays = '*';
		$cron->months = '*';
		$cron->weekdays = '*';
		$cron->job = 'GO\Tickets\Cron\ImportImap';

		$cron->save();
	}
	
	public function autoInstall() {
		return true;
	}
}