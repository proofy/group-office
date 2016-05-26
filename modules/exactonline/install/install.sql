-- --------------------------------------------------------


--
-- Tabelstructuur voor tabel `exact_project_templates`
--

DROP TABLE IF EXISTS `exact_project_templates`;
CREATE TABLE IF NOT EXISTS `exact_project_templates` (
  `template_id` int(11) NOT NULL,
  `division_number` varchar(16) NOT NULL DEFAULT '',
  PRIMARY KEY `template_id` (`template_id`)
) ENGINE=InnoDB;