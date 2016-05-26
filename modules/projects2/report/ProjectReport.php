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
 * @version $Id: ProjectReport.php 20801 2015-09-09 14:02:31Z wsmits $ 
 * @author Merijn Schering <mschering@intermesh.nl>
 */

namespace GO\Projects2\Report;


class ProjectReport extends AbstractReport {

	/**
	 *
	 * @var \GO\Base\Util\Pdf 
	 */
	private $_pdf;

	public function name() {
		return \GO::t('projectReport', 'projects2');
	}

	public function fileExtension() {
		return 'pdf';
	}

	public function supportsSelectedProject() {
		return true;
	}
	
	
	public function supportsDateRange() {
		return true;
	}

	public function render($return = false) {
		$this->_pdf = new \GO\Base\Util\Pdf();
		$this->_pdf->title = \GO::t('projectReport', 'projects2');
		if (!empty($_REQUEST['startdate'])) {
			$this->_pdf->subtitle = $_REQUEST['startdate'];

			if (!empty($_REQUEST['enddate'])) {
				$this->_pdf->subtitle .=" - " . $_REQUEST['enddate'];
			}
		}


		$this->_pdf->AddPage();

		$this->_addProjectInfo();
		
		$this->_addTasks();

		$this->_addTimeEntries();

		$this->_addExpenses();
		
		

//		$this->_addMileage();
//		exit;
		if ($return)
			return $this->_pdf->Output($this->filename.".pdf", 'I');
		else {
			\GO\Base\Util\Http::outputDownloadHeaders(new \GO\Base\Fs\File($this->filename.".pdf"));
			echo $this->_pdf->Output($this->filename.".pdf", 'I');
		}
	}

	private function _addProjectInfo() {
		$html = '<table cellpadding="2">';

		$html .= '<tr><td width="150px">' . \GO::t('strName') . ':</td><td>' . $this->project->path . '</td></tr>';
		if(!empty($this->project->reference_no)){
			$html .= '<tr><td width="150px">' . \GO::t('referenceNo','projects2') . ':</td><td>' . $this->project->reference_no . '</td></tr>';
		}
		$html .= '<tr><td>' . \GO::t('status', 'projects2') . ':</td><td>' . $this->project->status->name . '</td></tr>';

		if (!empty($this->project->start_time))
			$html .= '<tr><td>' . \GO::t('startTime', 'projects2') . ':</td><td>' . $this->project->getAttribute('start_time', 'formatted') . '</td></tr>';

		if (!empty($this->project->due_time))
			$html .= '<tr><td>' . \GO::t('projectDue_time', 'projects2') . ':</td><td>' . $this->project->getAttribute('due_time', 'formatted') . '</td></tr>';

		$html .= '<tr><td>' . \GO::t('lag', 'projects2') . ':</td><td>' . \GO\Base\Util\Date::minutesToTimeString($this->project->getLag()). '</td></tr>';
		
		
						
		if (!empty($this->project->description))
			$html .= '<tr><td>' . \GO::t('strDescription') . ':</td><td>' . $this->project->description . '</td></tr>';

		if (!empty($this->project->income_type)) {
			switch ($this->project->income_type) {
				case \GO\Projects2\Model\Project::INCOME_CONTRACT_PRICE:
					$html .= '<tr><td>' . \GO::t('incomeType','projects2') . ':</td><td>' . \GO::t('contractPrice','projects2') . '</td></tr>';
					break;
				case \GO\Projects2\Model\Project::INCOME_POST_CALCULATION:
					$html .= '<tr><td>' . \GO::t('incomeType','projects2') . ':</td><td>' . \GO::t('postCalculation','projects2') . '</td></tr>';
					break;
				case \GO\Projects2\Model\Project::INCOME_NOT_BILLABLE:
					$html .= '<tr><td>' . \GO::t('incomeType','projects2') . ':</td><td>' . \GO::t('notBillable','projects2') . '</td></tr>';
					break;
				default:
					break;
			}
		}
		
		$html .= '</table>';


		$this->_pdf->writeHTML($html,true,false,false,true);
			
		$this->_pdf->Ln(10);
	}

	private function _addTimeEntries() {
		$stmt = $this->project->resources;

		if ($stmt->rowCount()) {
		


			$html = $this->_pdf->getStyle().
							'<h2>'.\GO::t('timeEntries', 'projects2').'</h2>'.							
							'<table border="0" cellpadding="3" nobr="true">';
			
				$html .= '<thead>' .
								$this->_pdf->tableHeaders(array(
										new \GO\Base\Util\PdfTableColumn(array('width' => 70, 'text' => \GO::t('strDate'), 'class'=>'head')),
//									new \GO\Base\Util\PdfTableColumn(array('width'=>150, 'text'=>\GO::t('employee','projects2'),'isHeader'=>true)),
										new \GO\Base\Util\PdfTableColumn(array('width' => 280, 'text' => \GO::t('strDescription'), 'class'=>'head')),
										new \GO\Base\Util\PdfTableColumn(array('width' => 80, 'text' => \GO::t('strHours'), 'class'=>'head', 'align' => 'right')),
										new \GO\Base\Util\PdfTableColumn(array('width' => 80, 'text' => \GO::t('cost', 'projects2'), 'class'=>'head', 'align' => 'right')),
										new \GO\Base\Util\PdfTableColumn(array('width' => 80, 'text' => \GO::t('travelDistance', 'projects2'), 'class'=>'head', 'align' => 'right')),
										new \GO\Base\Util\PdfTableColumn(array('width' => 80, 'text' => \GO::t('travel_costs', 'projects2'), 'class'=>'head', 'align' => 'right'))
								)) .
								'</thead><tbody>';
				
			$total = 0;
					$totalCost = 0;
					$totalTravelDistance = 0;
					$totalTravelCosts = 0;
				
			foreach ($stmt as $resource) {


				
				

				$findParams = \GO\Base\Db\FindParams::newInstance()
								->order('date', 'ASC')
								->select('t.*');

				$findParams->getCriteria()->addCondition('user_id', $resource->user->id);

				if (isset($this->startDate)) {
					$findParams->getCriteria()->addCondition('date', $this->startDate, '>=');
				}

				if (isset($this->endDate)) {
					$findParams->getCriteria()->addCondition('date', $this->endDate, '<');
				}

				$stmt = $this->project->_timeEntries($findParams);

				if (!$stmt->rowCount()) {
//					$html .= '<tr>' .
//									'<td colspan="6">' . GO::t('strNoItems') . '</td>' .
//									'</tr>';
				} else {
					
					$html .= $this->_pdf->tableRow(array(new \GO\Base\Util\PdfTableColumn(array("class"=>"group", 'text' => $resource->user->name,'colspan'=>6))));
					
					foreach ($stmt as $timeEntry) {

						$html .= $this->_pdf->tableRow(array(
								new \GO\Base\Util\PdfTableColumn(array('text' => $timeEntry->getStartTime()->format(\GO::user()->completeDateFormat))),
//									new \GO\Base\Util\PdfTableColumn(array('text'=>$timeEntry->user->name)),
								new \GO\Base\Util\PdfTableColumn(array('text' => $timeEntry->getAttribute('comments', 'html'))),
								new \GO\Base\Util\PdfTableColumn(array('text' => $timeEntry->getAttribute('units', 'formatted'))),
								new \GO\Base\Util\PdfTableColumn(array('text' => \GO\Base\Util\Number::localize($timeEntry->getTotalExternalFee()))),
								new \GO\Base\Util\PdfTableColumn(array('text' => $timeEntry->getAttribute('travel_distance', 'formatted'))),
								new \GO\Base\Util\PdfTableColumn(array('text' => \GO\Base\Util\Number::localize($timeEntry->getTravelCosts())))
										));

						$totalCost += $timeEntry->getTotalExternalFee();
						$total += $timeEntry->units;

						$totalTravelDistance +=$timeEntry->travel_distance;
						$totalTravelCosts +=$timeEntry->getTravelCosts();
					}				
				}				
			}
			
			
				$html .= $this->_pdf->tableRow(array(
							new \GO\Base\Util\PdfTableColumn(array('class' => 'total', 'colspan' => 2, 'text' => \GO::t('total') . ':')),
					new \GO\Base\Util\PdfTableColumn(array('class' => 'total', 'text' => \GO\Base\Util\Number::localize($total))),
					new \GO\Base\Util\PdfTableColumn(array('class' => 'total', 'text' => \GO\Base\Util\Number::localize($totalCost))),
					new \GO\Base\Util\PdfTableColumn(array('class' => 'total', 'text' => \GO\Base\Util\Number::localize($totalTravelDistance))),
					new \GO\Base\Util\PdfTableColumn(array('class' => 'total', 'text' => \GO\Base\Util\Number::localize($totalTravelCosts)))
							));
			
			$html .= '</tbody></table>';


			$this->_pdf->writeHTML($html,true,false,false,true);

			$this->_pdf->Ln(20);
		}
	}

	private function _addExpenses() {
		$findParams = \GO\Base\Db\FindParams::newInstance()->criteria(
						\GO\Base\Db\FindCriteria::newInstance()
										->addCondition('project_id', $this->project->id)
		);

		$findParams->joinRelation('expenseBudget', 'LEFT');

		if (isset($this->startDate)) {
			$findParams->getCriteria()->addCondition('date', $this->startDate, '>=');
		}

		if (isset($this->endDate)) {
			$findParams->getCriteria()->addCondition('date', $this->endDate, '<');
		}


		$stmt = \GO\Projects2\Model\Expense::model()->find($findParams);

		if ($stmt->rowCount()) {
		
			$html = $this->_pdf->getStyle().
							'<h2>'.\GO::t('expenses', 'projects2').'</h2>'.	
							'<table border="0" cellpadding="3" nobr="true">';
			$html .= '<thead>' .
							$this->_pdf->tableHeaders(array(
									new \GO\Base\Util\PdfTableColumn(array('width' => 70, 'text' => \GO::t('strDate'), 'class'=>'head')),
									new \GO\Base\Util\PdfTableColumn(array('width' => 150, 'text' => \GO::t('expenseBudget', 'projects2'), 'class'=>'head')),
									new \GO\Base\Util\PdfTableColumn(array('width' => 370, 'text' => \GO::t('strDescription'), 'class'=>'head')),
									new \GO\Base\Util\PdfTableColumn(array('width' => 80, 'text' => \GO::t('cost', 'projects2'), 'class'=>'head', 'align' => 'right'))
							)) .
							'</thead><tbody>';
			$totalCost = 0;
			foreach ($stmt as $expense) {
				$html .= $this->_pdf->tableRow(array(
						new \GO\Base\Util\PdfTableColumn(array('text' => $expense->getAttribute('date', 'formatted'))),
						new \GO\Base\Util\PdfTableColumn(array('text' => !empty($expense->expenseBudget->description) ? $expense->expenseBudget->description : \GO::t("unclassifiedExpenses", "projects"))),
						new \GO\Base\Util\PdfTableColumn(array('text' => $expense->description)),
						new \GO\Base\Util\PdfTableColumn(array('text' => $expense->getAttribute('nett', 'formatted'))),
								));

				$totalCost += $expense->nett;
			}

			$html .= $this->_pdf->tableRow(array(
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total', 'colspan' => 3, 'text' => \GO::t('total') . ':')),
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total', 'text' => \GO\Base\Util\Number::localize($totalCost))),
							));



			$html .= '</tbody></table>';


			$this->_pdf->writeHTML($html,true,false,false,true);
			
			$this->_pdf->Ln(20);
		}
	}
	
	
	private function _addTasks(){
		
//		$this->_pdf->AddPage();
		
		$findParams = \GO\Base\Db\FindParams::newInstance()
						->select('t.*,parent.description AS parent_description')
						->group('t.id')
						->limit(0)
						->order('sort_order','ASC')
						->joinRelation('parent','LEFT');
						
		
		$findParams->groupRelation('timeEntries', 'sum(timeEntries.duration) AS minutes_booked','LEFT');
		
//		if(!empty($params['project_id'])){
		$findParams->getCriteria()
						->addCondition('project_id', $this->project->id)
						->addCondition('has_children', false);
		
//		if (isset($this->startDate)) {
//			$findParams->getCriteria()->addCondition('date', $this->startDate, '>=');
//		}
//
//		if (isset($this->endDate)) {
//			$findParams->getCriteria()->addCondition('date', $this->endDate, '<');
//		}
//		
		$stmt = \GO\Projects2\Model\Task::model()->find($findParams);
		
		

		if ($stmt->rowCount()) {
//			$this->_pdf->h2(\GO::t('tasks', 'projects2'));
			
			$html = $this->_pdf->getStyle();

			$html .= '<table border="0" cellpadding="3" nobr="true">';
			$html .= '<thead>' .
							$this->_pdf->tableRow(array(
						new \GO\Base\Util\PdfTableColumn(array("class"=>"", 'text' => '<h2>'.\GO::t('tasks', 'projects2').'</h2>','colspan'=>6)),
						
								)).
			
							$this->_pdf->tableHeaders(array(
									new \GO\Base\Util\PdfTableColumn(array('class'=>'head','width' => 70, 'text' => \GO::t('strDate'), 'isHeader' => false)),
									new \GO\Base\Util\PdfTableColumn(array('class'=>'head', 'width' => 205, 'text' => \GO::t('strDescription'), 'isHeader' => false)),
									new \GO\Base\Util\PdfTableColumn(array('class'=>'head','width' => 75, 'text' => \GO::t('percentageComplete', 'projects2'), 'align' => 'right')),
									new \GO\Base\Util\PdfTableColumn(array('class'=>'head','width' => 150, 'text' => \GO::t('employee', 'projects2'),'align' => 'right')),
									new \GO\Base\Util\PdfTableColumn(array('class'=>'head','width' => 80, 'text' => \GO::t('duration', 'projects2'), 'align' => 'right')),
									new \GO\Base\Util\PdfTableColumn(array('class'=>'head','width' => 90, 'text' => \GO::t('hoursBooked', 'projects2'),  'align' => 'right'))
							)) .
							'</thead><tbody>';
//			$totalCost = 0;
			
			$lastGroup = false;
			$totalDuration =0;
			$totalBooked =0;
			
			foreach ($stmt as $task) {
				
				$newGroup = !empty($task->parent_description) ? $task->parent_description : \GO::t('ungrouped','projects2');
				
				if($newGroup!=$lastGroup){
					$html .= $this->_pdf->tableRow(array(
						new \GO\Base\Util\PdfTableColumn(array("class"=>"group", 'text' => $newGroup,'colspan'=>6)),
						
								));
				}
				
				$lastGroup = $newGroup;
				
				$html .= $this->_pdf->tableRow(array(
						new \GO\Base\Util\PdfTableColumn(array("class"=>"normal",'text' => $task->getAutoDueDate(true))),
						new \GO\Base\Util\PdfTableColumn(array("class"=>"normal",'text' => $task->description)),
						new \GO\Base\Util\PdfTableColumn(array("class"=>"normal",'text' => $task->getAttribute('percentage_complete', 'formatted'))),
						new \GO\Base\Util\PdfTableColumn(array("class"=>"normal",'text' => $task->user->name)),
						new \GO\Base\Util\PdfTableColumn(array("class"=>"normal",'text' => \GO\Base\Util\Number::localize($task->duration/60))),
						new \GO\Base\Util\PdfTableColumn(array("class"=>"normal",'text' => \GO\Base\Util\Number::localize($task->minutes_booked/60))),
								));

				$totalDuration +=$task->duration;
				$totalBooked +=$task->minutes_booked;
				
			}

			$html .= $this->_pdf->tableRow(array(
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','colspan' => 4, 'text' => \GO::t('total') . ':')),
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','text' => \GO\Base\Util\Number::localize($totalDuration/60))),
					new \GO\Base\Util\PdfTableColumn(array('class'=>'total','text' => \GO\Base\Util\Number::localize($totalBooked/60))),
							));



			$html .= '</tbody></table>';


			$this->_pdf->writeHTML($html,true,false,false,true);
			
			$this->_pdf->Ln(20);
		}
		
	}

}
