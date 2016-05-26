<?php

namespace GO\Caldav;

use GO\Caldav\Model\DavEvent;
use GO\Caldav\Model\DavTask;

class CaldavModule extends \GO\Professional\Module {
	
	public function depends() {
		return array("dav","sync","calendar");
	}
	
	public static function initListeners() {
		
		if(\GO::modules()->isInstalled('calendar')) {
			\GO\Calendar\Model\Event::model()->addListener("save", "GO\Caldav\CaldavModule", "saveEvent");
			\GO\Calendar\Model\Event::model()->addListener("delete", "GO\Caldav\CaldavModule", "deleteEvent");
		}
		
		if(\GO::modules()->isInstalled('tasks'))	{
			\GO\Tasks\Model\Task::model()->addListener("save", "GO\Caldav\CaldavModule", "saveTask");
			\GO\Tasks\Model\Task::model()->addListener("delete", "GO\Caldav\CaldavModule", "deleteTask");
		}
			
		
	}
	
	public static function saveEvent(\GO\Calendar\Model\Event $event, $wasNew) {
		
		if($event->isException()) {
			return;
		}
		
		if($wasNew) {		
			$davEvent = new DavEvent();
			$davEvent->id = $event->id;	
			$davEvent->mtime = $event->mtime;
			$davEvent->calendarId = $event->calendar_id;
			$davEvent->data = self::exportCalendarEvent($event);
			$davEvent->uri = $event->getUri();
			return $davEvent->save();
		} else {
			$davEvent = DavEvent::model()->findByPk($event->id);
			if(!$davEvent) {
				$davEvent = new DavEvent();
				$davEvent->id = $event->id;
				$davEvent->uri = $event->getUri();
			}
//			if($davEvent->mtime != $event->mtime){
				$davEvent->data = self::exportCalendarEvent($event);			
				$davEvent->mtime = $event->mtime;
				$davEvent->calendarId = $event->calendar_id;
				return $davEvent->save();
//			}
		}
	}
	
	public static function saveTask(\GO\Tasks\Model\Task $task, $wasNew) {
	
		if($wasNew) {		
			$davTask = new DavTask();
			$davTask->id = $task->id;	
			$davTask->mtime = $task->mtime;
			$davTask->tasklistId = $task->tasklist_id;
			$davTask->data =$task->toICS();
			$davTask->uri = $task->getUri();
			return $davTask->save();
		} else {
			$davTask = DavTask::model()->findByPk($task->id);
			if(!$davTask) {
				$davTask = new DavTask();
				$davTask->id = $task->id;
				$davTask->uri = $task->getUri();
			}
//			if($davTask->mtime != $task->mtime){
				$davTask->data = $task->toICS();			
				$davTask->mtime = $task->mtime;
				$davTask->tasklistId = $task->tasklist_id;
				return $davTask->save();
//			}
		}
	}
	
	public static function deleteEvent(\GO\Calendar\Model\Event $event){
		$davEvent = Model\DavEvent::model()->findByPk($event->id);
		if(!$davEvent)
			return;
		$davEvent->calendarId = $event->calendar_id;
		$davEvent->delete();
	}
	
	public static function deleteTask(\GO\Tasks\Model\Task $task){
		$davTask = Model\DavTask::model()->findByPk($task->id);
		if(!$davTask)
			return;
		$davTask->tasklistId = $task->tasklist_id;
		$davTask->delete();
	}
	
	/**
	 * Event to VObject data
	 * Copied from CalendarBackend
	 * @param type $event
	 * @return type
	 */
	static private function exportCalendarEvent($event){
		
		$events=array();
		if(empty($event->rrule)){
			$events[]=$event;
		}else{
			//a recurring event must be sent with all it's exceptions in the same data
			
			$fp = \GO\Base\Db\FindParams::newInstance()
				->order('start_time','ASC')
				->select('t.*')
				->debugSql()
				->ignoreAcl();
			$fp->getCriteria()
				->addCondition('calendar_id', $event->calendar_id)
				->addCondition('uuid', $event->uuid);
			
			$stmt = \GO\Calendar\Model\Event::model()->find($fp);
			
			$sequence=0;
			while($e=$stmt->fetch()){
				
				if($e->private && $e->calendar->user_id != \GO::user()->id){
					$e->name=\GO::t('private','calendar');
					$e->location='';
					$e->description='';
				}
				$e->sequence=$sequence;
				$sequence++;
				$events[]=$e;

			}			
		}
		
		$c = new \GO\Base\VObject\VCalendar();		
		$c->add(new \GO\Base\VObject\VTimezone());
		foreach($events as $event){
			$c->add($event->toVObject('REQUEST', false));		
		}
		
		return $c->serialize();
	}
}