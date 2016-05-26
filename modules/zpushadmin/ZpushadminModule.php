<?php


namespace GO\Zpushadmin;


class ZpushadminModule extends \GO\Professional\Module {

	public function install() {

		$settings = new Model\Settings();
		$settings->zpushadmin_can_connect = true;
		$settings->save();

		return parent::install();
	}
	
	public function depends() {
		return array('sync');
	}

	public static function zpushAdminFileExists($folder=false) {
		
		if(!$folder)
			$folder = self::getModuleFolder();
		
		return file_exists(\GO::config()->root_path.'modules/'.$folder.'/lib/utils/zpushadmin.php');
	}

	public static function checkZPushVersion($versionToCompare){
		\GO::debug("Compare active z-push version with: ".$versionToCompare);
		
		if(!defined('ZPUSH_VERSION')){
			$moduleFolder = self::getModuleFolder();

			$versionFile = \GO::config()->root_path.'modules/'.$moduleFolder.'/version.php';
			if(!file_exists($versionFile))
				throw new \Exception ('Z-Push admin could not find Z-Push, is it installed?');
		
			include_once($versionFile);
		}

		$shortversion = false;
		if(defined('ZPUSH_VERSION')){
			\GO::debug("Found z-push version :".ZPUSH_VERSION);
			
			$shortversion = substr(ZPUSH_VERSION, 0, 3);
			\GO::debug("Short z-push version :".$shortversion);
		}
		
		if($versionToCompare === $shortversion){
			\GO::debug("Comparison OK: ".$versionToCompare." - ".$shortversion);
			return true;
		}else{
			\GO::debug("Comparison WRONG: ".$versionToCompare." - ".$shortversion);
			return false;
		}
	}
	
	public static function getModuleFolder(){
		$folders = array('z-push','z-push22','z-push21','z-push2');
		$folder = false;
		foreach($folders as $f){
			if(is_dir(\GO::config()->root_path.'modules/'.$f)){
				$folder = $f;
				break;
			}
		}
		return $folder;
	}
	
	public static function includeZpushFiles() {

		$moduleFolder = self::getModuleFolder();
		
		\GO::debug("Using z-push folder: ".$moduleFolder);
		
		if (self::zpushAdminFileExists($moduleFolder)) {
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/utils/zpushadmin.php');

			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/core/zpushdefs.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/core/zpush.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/core/stateobject.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/core/syncparameters.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/core/bodypreference.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/core/contentparameters.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/core/synccollections.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/core/zlog.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/core/statemanager.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/core/streamer.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/core/asdevice.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/core/interprocessdata.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/core/loopdetection.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/exceptions/exceptions.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/utils/utils.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/utils/zpushadmin.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/request/request.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/request/requestprocessor.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/interface/ibackend.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/interface/ichanges.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/interface/iexportchanges.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/interface/iimportchanges.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/interface/isearchprovider.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/interface/istatemachine.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncobject.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncbasebody.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncbaseattachment.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncmailflags.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncrecurrence.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncappointment.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncappointmentexception.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncattachment.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncattendee.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncmeetingrequestrecurrence.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncmeetingrequest.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncmail.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncnote.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/synccontact.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncfolder.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncprovisioning.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/synctaskrecurrence.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/synctask.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncoofmessage.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncoof.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncuserinformation.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncdeviceinformation.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncdevicepassword.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/lib/syncobjects/syncitemoperationsattachment.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/config.php');
			include_once(\GO::config()->root_path.'modules/'.$moduleFolder.'/version.php');
			
			set_include_path(get_include_path() . PATH_SEPARATOR . BASE_PATH);
			\ZPush::CheckConfig();
		}
	}

}