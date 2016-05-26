<?php
namespace GO\Addressbook\Export;

use GO\Base\Model\AbstractExport;

class CurrentGridContact extends AbstractExport {
	
	/**
	 * This is a grid export that needs the key for the statement that is saved in the session
	 * 
	 * @var StringHelper 
	 */
	public $queryKey = 'contact';
	
	/**
	 * Which views are supported by this export
	 *  
	 * @return array
	 */
	public function getSupportedViews(){
		return array(
				AbstractExport::VIEW_CSV,
				AbstractExport::VIEW_PDF,
				AbstractExport::VIEW_XLS,
				AbstractExport::VIEW_HTML
		);
	}
	
	public function formatColumns(\GO\Base\Data\ColumnModel $columnModel) {
		
		$sortAlias = \GO::user()->sort_name=="first_name" ? array('first_name','last_name') : array('last_name','first_name');
		
		$columnModel->formatColumn('name','$model->getName(\GO::user()->sort_name)', array(),$sortAlias, \GO::t('strName'));
		$columnModel->formatColumn('company_name','$model->company_name', array(),'', \GO::t('company','addressbook'));
		$columnModel->formatColumn('ab_name','$model->ab_name', array(),'', \GO::t('addressbook','addressbook'));
		$columnModel->formatColumn('age', '$model->age', array(), 'birthday');
		$columnModel->formatColumn('action_date', '$model->getActionDate()', array(), 'action_date');
		
		$columnModel->formatColumn('cf', '$model->id.":".$model->name');//special field used by custom fields. They need an id an value in one.)
		return parent::formatColumns($columnModel);
	}
	
}