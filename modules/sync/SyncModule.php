<?php

namespace GO\Sync;


class SyncModule extends \GO\Professional\Module{
	
	public static function submitSettings(&$settingsController, &$params, &$response, $user) {
		
		$settings = Model\Settings::model()->findForUser($user);
		
//		$settings->calendar_id=$params['calendar_id'];
		if(isset($params['account_id']))
			$settings->account_id=$params['account_id'];
		
		$settings->max_days_old=$params['max_days_old'];
		$settings->delete_old_events=isset($params['delete_old_events']) ? 1 : 0;

		$settings->save();
		
		
//		if(isset($params['sync_addressbooks'])){
//			$sync_addressbooks = json_decode($params['sync_addressbooks'], true);
//			
//			$settings->removeAllManyMany('addressbooks');
//			
//			$i = 0;
//			foreach($sync_addressbooks['data'] as $ab)
//			{
//				$settings->addManyMany('addressbooks', $ab['id'],array('default_addressbook'=>$ab['default_addressbook']));					
//			}
//		}
//		
//		if(isset($params['sync_tasklists'])){
//			$sync_tasklists = json_decode($params['sync_tasklists'], true);
//			
//			$settings->removeAllManyMany('tasklists');
//			
//			$i = 0;
//			foreach($sync_tasklists['data'] as $ab)
//			{
//				$settings->addManyMany('tasklists', $ab['id'],array('default_tasklist'=>$ab['default_tasklist']));					
//			}
//		}
//			
//		if(isset($params['sync_note_categories'])){
//			$sync_note_categories = json_decode($params['sync_note_categories'], true);
//			
//			$settings->removeAllManyMany('noteCategories');
//			
//			$i = 0;
//			foreach($sync_note_categories['data'] as $ab)
//			{
//				$settings->addManyMany('noteCategories', $ab['id'],array('default_category'=>$ab['default_category']));					
//			}
//		}

		
		return parent::submitSettings($settingsController, $params, $response, $user);
	}
	
	public static function loadSettings(&$settingsController, &$params, &$response, $user) {
		
		$settings = Model\Settings::model()->findForUser($user);

		$response['data']=array_merge($response['data'], $settings->getAttributes());
//		$response['data']['sync_url']=\GO::config()->full_url.'sync.php';
		
		$calendar = $settings->calendar;		
		if($calendar){
			$response['data']['calendar_id']=$calendar->id;
			$response['remoteComboTexts']['calendar_id']=$calendar->name;
		}
		
		$account = $settings->account;		
		if($account){
			$response['data']['account_id']=$account->id;
			$response['remoteComboTexts']['account_id']=$account->aliases(\GO\Base\Db\FindParams::newInstance()->single())->email;
		}
		
		$response = \GO\Calendar\Controller\EventController::reminderSecondsToForm($response);
		
		
		
		return parent::loadSettings($settingsController, $params, $response, $user);
	}
	
	public function autoInstall() {
		return true;
	}
	
}
