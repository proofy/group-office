<?php

/*
 * Copyright Intermesh BV
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 */

/**
 * Generated PDF document for project milestones
 *
 * @package GO.projects2.report
 * @copyright Copyright Intermesh
 * @version $Id: EmployeesReport.php 20801 2015-09-09 14:02:31Z wsmits $ 
 * @author Merijn Schering <mschering@intermesh.nl>
 */

namespace GO\Projects2\Report;
use GO;
use GO\Projects2\Model\Template;


class EmployeesReport extends AbstractReport {

	/**
	 *
	 * @var \GO\Base\Util\Pdf 
	 */
	private $_pdf;
	
	

	public function name() {
		return \GO::t("employeesReport","projects2");
	}
	
	public function supportsBatchReport() {
		return true;
	}
	
	public function supportsSelectedProject() {
		return true;
	}
	
	public function supportedProjectTypes() {
		return array(Template::PROJECT_TYPE_CONTAINER, Template::PROJECT_TYPE_PROJECT);
	}
	
	public function supportsDateRange() {
		return true;
	}

	public function fileExtension() {
		return 'pdf';
	}

	public function render($return = false) {
		$this->_pdf = new \GO\Base\Util\Pdf();
		$this->_pdf->title = $this->name();
		if (!empty($_REQUEST['startdate'])) {
			$this->_pdf->subtitle = $_REQUEST['startdate'];

			if (!empty($_REQUEST['enddate'])) {
				$this->_pdf->subtitle .=" - " . $_REQUEST['enddate'];
			}
		}
		
	
		


		$this->_pdf->AddPage();


		$this->_addTimeEntries();
		
		
		
		
		if($this->project){
			$findParams = GO\Base\Db\FindParams::newInstance();
			$findParams->getCriteria()->addCondition("path", $this->project->path.'/%','LIKE');
			$findParams->getCriteria()->addCondition("id", $this->project->id,'LIKE','t',false);
			
			$stmt = GO\Projects2\Model\Project::model()->find($findParams);
			
			if($stmt->rowCount()){
				
				$this->_pdf->Ln(10);
				
				$this->_pdf->h2(GO::t('timeEntriesPerProject', 'projects2'));
				
				foreach($stmt as $project){
					$this->_addTimeEntries($project);
				}
			}
		}else
		{
			$this->_addHolidays();
		}

		if ($return)
			return $this->_pdf->Output($this->filename.".pdf", 'I');
		else {
			\GO\Base\Util\Http::outputDownloadHeaders(new \GO\Base\Fs\File($this->filename.".pdf"));
			echo $this->_pdf->Output($this->filename.".pdf", 'I');
		}
	}

	private function _addTimeEntries($project=null) {

		\GO\Base\Model\User::model()->addRelation('timeEntries', array(
				'type' => \GO\Base\Db\ActiveRecord::HAS_MANY,
				'model' => 'GO\Projects2\Model\TimeEntry',
				'field' => 'user_id'));

		$fp = \GO\Base\Db\FindParams::newInstance()
						->ignoreAcl()
						->groupRelation('timeEntries', 'sum(duration) as minutes, sum(external_fee/60*duration) as external_fee, sum(internal_fee/60*duration) as internal_fee,sum(travel_distance) as travel_distance, sum(travel_distance*travel_costs) as travel_costs')
						->group('id');
		
		if(isset($this->startDate))
			$fp->getCriteria()->addCondition('date', $this->startDate,'>=','timeEntries');
		
		if(isset($this->endDate))
			$fp->getCriteria()->addCondition('date', $this->endDate,'<','timeEntries');
		
		
		
		if(!isset($project)){
			//list totals for all projects in this report
			
			//query all subprojects of given path
			if($this->project){	
				$fp->getCriteria()->addRawCondition('timeEntries.project_id', "(SELECT id FROM pr2_projects WHERE path LIKE :path OR project_id = :project_id)",'IN');
				$fp->getCriteria()->addBindParameter(':path', $this->project->path.'/%');	
				$fp->getCriteria()->addBindParameter(':project_id', $this->project->id);	

				$title = sprintf(GO::t('timeEntriesTotals','projects2'), $this->project->path);
			}  else {
				$title = sprintf(GO::t('timeEntriesTotals','projects2'), GO::t('allProjects','projects2'));
			}
			$titleFn='h2';
		}else
		{
			$titleFn='h3';
			//create table for single project
			$title = sprintf(GO::t('timeEntriesForProject','projects2'), $project->path);
			
			$fp->getCriteria()->addCondition('project_id', $project->id,'=', "timeEntries");
		}

		$stmt = \GO\Base\Model\User::model()->find($fp);


		$html = $this->_pdf->getStyle().
						'<table border="0" cellpadding="3">';
		$html .= '<thead>' .
						$this->_pdf->tableHeaders(array(
								new \GO\Base\Util\PdfTableColumn(array('width' => 350, 'text' => \GO::t('employee','projects2'), 'class'=>'head')),
								new \GO\Base\Util\PdfTableColumn(array('width' => 80, 'text' => \GO::t('strHours'), 'class'=>'head', 'align' => 'right')),
								new \GO\Base\Util\PdfTableColumn(array('width' => 80, 'text' => \GO::t('externalFee', 'projects2'), 'class'=>'head', 'align' => 'right')),
								new \GO\Base\Util\PdfTableColumn(array('width'=>80, 'text'=>\GO::t('travelDistance','projects2'),'class'=>'head','align'=>'right')),
								new \GO\Base\Util\PdfTableColumn(array('width'=>80, 'text'=>\GO::t('travel_costs','projects2'),'class'=>'head','align'=>'right'))
						)) .
						'</thead><tbody>';

		if (!$stmt->rowCount()) {

//			$html .= '<tr>' .
//							'<td colspan="5">' . GO::t('strNoItems') . '</td>' .
//							'</tr>';
			
			//print nothing
			return;

		} else {
			
			$this->_pdf->$titleFn($title);
			
			$total = 0;
			$totalCost = 0;
			
			$totalTravelDistance=0;
			$totalTravelCosts=0;
			foreach ($stmt as $user) {

				$html .= $this->_pdf->tableRow(array(
						new \GO\Base\Util\PdfTableColumn(array('text' => $user->name)),
						new \GO\Base\Util\PdfTableColumn(array('text' => \GO\Base\Util\Date::minutesToTimeString($user->minutes))),
						
						new \GO\Base\Util\PdfTableColumn(array('text' => \GO\Base\Util\Number::localize($user->external_fee))),
						new \GO\Base\Util\PdfTableColumn(array('text'=>\GO\Base\Util\Number::localize($user->travel_distance))),
						new \GO\Base\Util\PdfTableColumn(array('text'=>  \GO\Base\Util\Number::localize($user->travel_costs)))
								));

				$totalCost += $user->external_fee;
				$total += $user->minutes;
				$totalTravelDistance +=$user->travel_distance;
				$totalTravelCosts +=$user->travel_costs;
			}

			$html .= $this->_pdf->tableRow(array(
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','colspan' => 1, 'text' => \GO::t('total') . ':')),
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','text' => \GO\Base\Util\Date::minutesToTimeString($total))),
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','text' => \GO\Base\Util\Number::localize($totalCost))),
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','text' => \GO\Base\Util\Number::localize($totalTravelDistance))),
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','text' => \GO\Base\Util\Number::localize($totalTravelCosts)))
							));
		}
		
		$html .= '</tbody></table>';
		
		$this->_pdf->writeHTML($html,true,false,false,true);
			
		$this->_pdf->Ln(10);
	}
	
	
	private function _addHolidays(){
		if(!\GO::modules()->leavedays)
			return;

		\GO\Base\Model\User::model()->addRelation('holidays', array(
				'type' => \GO\Base\Db\ActiveRecord::HAS_MANY,
				'model' => 'GO\Leavedays\Model\Leaveday',
				'field' => 'user_id'));

		$fp = \GO\Base\Db\FindParams::newInstance()
						->ignoreAcl()
						->groupRelation('holidays', 'sum(n_hours) as hours')
						->group('id');
		
		if(isset($this->startDate))
			$fp->getCriteria()->addCondition('first_date', $this->startDate,'>=','holidays');
		
		if(isset($this->endDate))
			$fp->getCriteria()->addCondition('first_date', $this->endDate,'<','holidays');

		$stmt = \GO\Base\Model\User::model()->find($fp);

		$this->_pdf->h2(\GO::t('leavedays','leavedays'));

		$html = $this->_pdf->getStyle().
						'<table border="0" cellpadding="1">';
		$html .= '<thead>' .
						$this->_pdf->tableHeaders(array(
								new \GO\Base\Util\PdfTableColumn(array('width' => 590, 'text' => \GO::t('employee','projects2'), 'class'=>'head')),
								new \GO\Base\Util\PdfTableColumn(array('width' => 80, 'text' => \GO::t('strHours'), 'class'=>'head', 'align' => 'right')),								
						)) .	
						'</thead><tbody>';

		if (!$stmt->rowCount()) {
			$html .= '<tr>' .
							'<td colspan="2">' . \GO::t('strNoItems') . '</td>' .
							'</tr>';
		} else {
			$total = 0;
			foreach ($stmt as $user) {

				$html .= $this->_pdf->tableRow(array(
						new \GO\Base\Util\PdfTableColumn(array('text' => $user->name)),
						new \GO\Base\Util\PdfTableColumn(array('text' => \GO\Base\Util\Date::minutesToTimeString($user->hours*60))),
								));


				$total += $user->hours*60;
			}

			$html .= $this->_pdf->tableRow(array(
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','colspan' => 1, 'text' => \GO::t('total') . ':')),
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','text' => \GO\Base\Util\Date::minutesToTimeString($total)))
					
							));
		}
		
		$html .= '</tbody></table>';
//		exit($html);
		$this->_pdf->writeHTML($html,true,false,false,true);
			
		$this->_pdf->Ln(10);
	}
	
	
//	private function _addMileage(){
//		
//		
//		\GO\Base\Model\User::model()->addRelation('mileage', array(
//				'type' => \GO\Base\Db\ActiveRecord::HAS_MANY,
//				'model' => 'GO\Projects2\Model\MileageRegistration',
//				'field' => 'user_id'));
//
//		$fp = \GO\Base\Db\FindParams::newInstance()
//						->ignoreAcl()
//						->groupRelation('mileage', 'sum(distance) as distance')
//						->group('id');
//		
//		if(isset($this->startDate))
//			$fp->getCriteria()->addCondition('date', $this->startDate,'>=','mileage');
//		
//		if(isset($this->endDate))
//			$fp->getCriteria()->addCondition('date', $this->endDate,'<','mileage');
//
//		$stmt = \GO\Base\Model\User::model()->find($fp);
//
//		$this->_pdf->h2(\GO::t('mileageRegistration','projects2'));
//
//		$html = '<table border="1" cellpadding="2">';
//		$html .= '<thead>' .
//						$this->_pdf->tableHeaders(array(
//								new \GO\Base\Util\PdfTableColumn(array('width' => 590, 'text' => \GO::t('employee','projects2'), 'class'=>'head')),
//								new \GO\Base\Util\PdfTableColumn(array('width' => 80, 'text' => \GO::t('distance', 'projects2'), 'class'=>'head', 'align' => 'right')),								
//						)) .	
//						'</thead><tbody>';
//
//		if (!$stmt->rowCount()) {
//			$html .= '<tr>' .
//							'<td colspan="2">' . \GO::t('strNoItems') . '</td>' .
//							'</tr>';
//		} else {
//			$total = 0;
//			foreach ($stmt as $user) {
//
//				$html .= $this->_pdf->tableRow(array(
//						new \GO\Base\Util\PdfTableColumn(array('text' => $user->name)),
//						new \GO\Base\Util\PdfTableColumn(array('text' => $user->distance)),
//								));
//
//
//				$total += $user->distance;
//			}
//
//			$html .= $this->_pdf->tableRow(array(
//					new \GO\Base\Util\PdfTableColumn(array('colspan' => 1, 'text' => \GO::t('total') . ':')),
//					new \GO\Base\Util\PdfTableColumn(array('text' => $total))
//					
//							));
//		}
//		
//		$html .= '</tbody></table>';
////		exit($html);
//		$this->_pdf->writeHTML($html);
//	}

}
