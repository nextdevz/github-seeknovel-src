-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.5.5-10.1.9-MariaDB


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema novel
--

CREATE DATABASE IF NOT EXISTS novel;
USE novel;

--
-- Definition of table `nv_members`
--

DROP TABLE IF EXISTS `nv_members`;
CREATE TABLE `nv_members` (
  `id_member` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `member_name` varchar(80) NOT NULL DEFAULT '',
  `passwd` varchar(64) NOT NULL DEFAULT '',
  `real_name` varchar(255) NOT NULL DEFAULT '',
  `email_address` varchar(255) NOT NULL DEFAULT '',
  `birthdate` date NOT NULL DEFAULT '0001-01-01',
  `gender` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `id_facebook` bigint(20) unsigned NOT NULL DEFAULT '0',
  `link_facebook` varchar(255) NOT NULL DEFAULT '',
  `id_google` bigint(20) unsigned NOT NULL DEFAULT '0',
  `link_google` varchar(255) NOT NULL DEFAULT '',
  `date_regis` int(10) unsigned NOT NULL DEFAULT '0',
  `last_login` int(10) unsigned NOT NULL DEFAULT '0',
  `silver_coin` int(10) unsigned NOT NULL DEFAULT '0',
  `gold_coin` int(10) unsigned NOT NULL DEFAULT '0',
  `avatar` varchar(255) NOT NULL DEFAULT '',
  `notify_news` tinyint(4) NOT NULL DEFAULT '0',
  `member_ip` varchar(255) NOT NULL DEFAULT '',
  `member_ip2` varchar(255) NOT NULL DEFAULT '',
  `is_activated` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_member`),
  KEY `member_name` (`member_name`),
  KEY `real_name` (`real_name`),
  KEY `birthdate` (`birthdate`),
  KEY `id_facebook` (`id_facebook`),
  KEY `link_facebook` (`link_facebook`),
  KEY `id_google` (`id_google`),
  KEY `link_google` (`link_google`),
  KEY `date_regis` (`date_regis`),
  KEY `last_login` (`last_login`),
  KEY `silver_coin` (`silver_coin`),
  KEY `gold_coin` (`gold_coin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `nv_members`
--

/*!40000 ALTER TABLE `nv_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `nv_members` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
