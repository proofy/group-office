-- --------------------------------------------------------
--
-- Tabelstructuur voor tabel `dav_contacts`
--

DROP TABLE IF EXISTS `dav_contacts`;
CREATE TABLE IF NOT EXISTS `dav_contacts` (
  `id` int(11) NOT NULL,
  `mtime` int(11) NOT NULL,
  `data` LONGTEXT NOT NULL,
  `uri` varchar(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `uri` (`uri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;