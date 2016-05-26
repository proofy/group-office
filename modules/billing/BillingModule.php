<?php


namespace GO\Billing;


class BillingModule extends \GO\Professional\Module {
	
	private static $_defaultLangId;

	public function author() {
		return 'Merijn Schering';
	}

	public function authorEmail() {
		return 'mschering@intermesh.nl';
	}
	
	public function package() {
		return "Billing";
	}

	/**
	 * 
	 * When a user is created, updated or logs in this function will be called.
	 * The function can check if the default calendar, addressbook, notebook etc.
	 * is created for this user.
	 * 
	 */
	public static function firstRun() {
		
	}

	public function install() {

		parent::install();
		
		$lang = new Model\Language();
		$lang->id=1;
		$lang->name=\GO::t('default','billing');
		$lang->language=\GO::config()->language;
		$lang->save();
		
		
		$quoteBook = new Model\Book();
		$quoteBook->name=\GO::t('quotes','billing');
		$quoteBook->order_id_prefix="Q%y";
		$quoteBook->call_after_days=3;
		$quoteBook->createStatuses=array('sent','accepted','lost','in_process');
		$quoteBook->save();
		
		$orderBook = new Model\Book();
		$orderBook->name=\GO::t('orders','billing');
		$orderBook->order_id_prefix="O%y";
		$quoteBook->createStatuses=array('in_process','delivered','sent','billed');
		$orderBook->save();
		
		$invoiceBook = new Model\Book();
		$invoiceBook->name=\GO::t('invoices','billing');
		$invoiceBook->order_id_prefix="I%y";
		$invoiceBook->save();

		return true;
	}
	
	public function autoInstall() {
		return true;
	}

	
	public static function getDefaultLangId(){
		if(!isset(self::$_defaultLangId)){
			$lang = Model\Language::model()->findSingleByAttribute('language',\GO::language()->getLanguage());
			self::$_defaultLangId = $lang ? $lang->id : 1;
		}
		return self::$_defaultLangId;
	}
}