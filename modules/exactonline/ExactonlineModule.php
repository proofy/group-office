<?php

namespace GO\Exactonline;

use GO;
use GO\Base\Module;
use GO\Exactonline\Model\ProjectTemplateExtension;
use GO\Projects2\Controller\ProjectController;
use GO\Projects2\Controller\TemplateController;


class ExactonlineModule extends Module {
	
	public static function initListeners() {
		if(GO::modules()->isInstalled('projects2')){
			$templateController = new TemplateController();
			$templateController->addListener('submit', "GO\Exactonline\ExactonlineModule", "afterProjectTemplateSubmit");
			$templateController->addListener('load', "GO\Exactonline\ExactonlineModule", "afterProjectTemplateLoad");
			$projectController = new ProjectController();
			$projectController->addListener('displayformatincome', "GO\Exactonline\ExactonlineModule", "projectDisplayFormatIncome");
		}
	}
			
	public function package() {
		return self::PACKAGE_CUSTOM;
	}
	
	public function depends() {
		return array('billing','projects2');
	}
	
	public static function afterProjectTemplateSubmit(TemplateController $templateController, &$response, &$templateModel, &$params, $modifiedAttributes) {
		
		$projectTemplateExactModel = ProjectTemplateExtension::model()->findByPk($templateModel->id);
		if (!$projectTemplateExactModel) {
			$projectTemplateExactModel = new ProjectTemplateExtension();
			$projectTemplateExactModel->template_id = $templateModel->id;
		}
		
		$projectTemplateExactModel->division_number = $params['exactonline_division_number'];
		$projectTemplateExactModel->save();
		
	}
	
	public static function afterProjectTemplateLoad(TemplateController $templateController, &$response, &$templateModel, &$params) {
		
		$projectTemplateExactModel = ProjectTemplateExtension::model()->findByPk($templateModel->id);
		if ($projectTemplateExactModel)
			$response['data']['exactonline_division_number'] = $projectTemplateExactModel->division_number;
		
	}
	
	public static function projectDisplayFormatIncome(\GO\Projects2\Model\Project $projectModel, &$incomeAttributes) {
		
		$incomeAttributes['invoice_number'] = '<a href="javascript:GO.exactonline.downloadSalesInvoice(\''.$projectModel->id.'\',\''.$incomeAttributes['invoice_number'].'\')">'.$incomeAttributes['invoice_number'].'</a>';
		
	}
	
}