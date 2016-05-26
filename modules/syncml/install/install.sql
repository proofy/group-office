DROP TABLE IF EXISTS `sy_anchors`;
CREATE TABLE IF NOT EXISTS `sy_anchors` (
  `store` varchar(50) NOT NULL,
  `device_id` int(11) NOT NULL,
  `local_last_anchor` int(11) NOT NULL,
  `remote_last_anchor` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`store`,`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `sy_devices`;
CREATE TABLE IF NOT EXISTS `sy_devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dev_id` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `man` varchar(50) NOT NULL DEFAULT '',
  `mod` varchar(50) NOT NULL DEFAULT '',
  `swv` varchar(50) NOT NULL DEFAULT '',
  `utc` tinyint(1) NOT NULL DEFAULT '0',
	`vcard_version` VARCHAR( 6 ) NOT NULL DEFAULT '2.1',
	`vcalendar_version` VARCHAR( 6 ) NOT NULL DEFAULT '1.0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `sy_maps`;
CREATE TABLE IF NOT EXISTS `sy_maps` (
  `device_id` int(11) NOT NULL,
  `store` varchar(100) NOT NULL,
  `server_id` int(11) NOT NULL,
  `client_id` varchar(255) NOT NULL,
  `mtime` int(11) NOT NULL,
  PRIMARY KEY (`device_id`,`store`,`server_id`,`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

