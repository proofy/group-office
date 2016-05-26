<?php

namespace GO\Savemailas;


class SavemailasModule extends \GO\Professional\Module{
	
	public function depends()
	{
		return array('email');
	}
	
	public function autoInstall() {
		return true;
	}
}