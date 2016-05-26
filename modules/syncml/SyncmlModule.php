<?php

namespace GO\Syncml;


class SyncmlModule extends \GO\Professional\Module{
	
	public function depends() {
		return array('sync');
	}
}