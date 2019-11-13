-- MySQL dump 10.13  Distrib 5.7.25, for Win64 (x86_64)
--
-- Host: localhost    Database: insigniisDB
-- ------------------------------------------------------
-- Server version	5.7.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `insigniisDB`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `insigniisDB` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci */;

USE `insigniisDB`;

--
-- Table structure for table `delegacion`
--

DROP TABLE IF EXISTS `delegacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delegacion` (
  `id_del` tinyint(2) NOT NULL AUTO_INCREMENT,
  `nom_del` varchar(60) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`id_del`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delegacion`
--

LOCK TABLES `delegacion` WRITE;
/*!40000 ALTER TABLE `delegacion` DISABLE KEYS */;
INSERT INTO `delegacion` VALUES (1,'Álvaro Obregón'),(2,'Azcapotzalco'),(3,'Benito Juárez'),(4,'Coyoacán'),(5,'Cuajimalpa de Morelos'),(6,'Cuauhtémoc'),(7,'Gustavo A. Madero'),(8,'Iztacalco'),(9,'Iztapalapa'),(10,'Magdalena Contreras'),(11,'Miguel Hidalgo'),(12,'Milpa Alta'),(13,'Tláhuac'),(14,'Tlalpan'),(15,'Venustiano Carranza'),(16,'Xochimilco');
/*!40000 ALTER TABLE `delegacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reporte`
--

DROP TABLE IF EXISTS `reporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reporte` (
  `id_rep` bigint(20) NOT NULL AUTO_INCREMENT,
  `des_rep` varchar(255) COLLATE utf8_spanish_ci NOT NULL,
  `id_del` tinyint(2) DEFAULT NULL,
  `id_usu` int(11) DEFAULT NULL,
  `id_tip` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id_rep`),
  KEY `id_del` (`id_del`),
  KEY `id_usu` (`id_usu`),
  KEY `id_tip` (`id_tip`),
  CONSTRAINT `reporte_ibfk_1` FOREIGN KEY (`id_del`) REFERENCES `delegacion` (`id_del`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reporte_ibfk_2` FOREIGN KEY (`id_usu`) REFERENCES `usuario` (`id_usu`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reporte_ibfk_3` FOREIGN KEY (`id_tip`) REFERENCES `tipodelito` (`id_tip`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reporte`
--

LOCK TABLES `reporte` WRITE;
/*!40000 ALTER TABLE `reporte` DISABLE KEYS */;
/*!40000 ALTER TABLE `reporte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipodelito`
--

DROP TABLE IF EXISTS `tipodelito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipodelito` (
  `id_tip` tinyint(4) NOT NULL AUTO_INCREMENT,
  `nom_tip` varchar(60) COLLATE utf8_spanish_ci NOT NULL UNIQUE,
  PRIMARY KEY (`id_tip`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipodelito`
--

LOCK TABLES `tipodelito` WRITE;
/*!40000 ALTER TABLE `tipodelito` DISABLE KEYS */;
INSERT INTO `tipodelito` VALUES (1,'Violencia Familiar'),(2,'Robo de objetos'),(3,'Fraude'),(4,'Amenazas'),(5,'Daño en propiedad ajena intencional'),(6,'Usurpación de identidad'),(7,'Abuso Sexual'),(8,'Abuso de autoridad'),(9,'Extorsión'),(10,'Sustracción de menores'),(11,'Encubrimiento'),(12,'Abandono de persona'),(13,'Allanamiento de morada'),(14,'Narcomenudeo'),(15,'Tortura'),(16,'Lesiones Culposas'),(17,'Privación de la libertad personal'),(18,'Delitos Ambientales'),(19,'Acoso Sexual'),(20,'Tentativa de robo'),(21,'Maltrato Animal'),(22,'Portación de arma de fuego'),(23,'Corrupción de menores'),(24,'Disparos de arma de fuego'),(25,'Trata de personas'),(26,'Pornografia Infantil'),(27,'Tentativa de homicidio'),(28,'Robo'),(29,'Homicidio');
/*!40000 ALTER TABLE `tipodelito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `id_usu` int(11) NOT NULL AUTO_INCREMENT,
  `nom_usu` varchar(255) COLLATE utf8_spanish_ci NOT NULL,
  `app_usu` varchar(255) COLLATE utf8_spanish_ci NOT NULL,
  `apm_usu` varchar(255) COLLATE utf8_spanish_ci NOT NULL,
  `fec_usu` date NOT NULL,
  `usu_usu` varchar(255) COLLATE utf8_spanish_ci NOT NULL,
  `cor_usu` varchar(255) COLLATE utf8_spanish_ci NOT NULL,
  `pas_usu` varchar(255) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`id_usu`),
  UNIQUE KEY `usu_usu` (`usu_usu`),
  UNIQUE KEY `cor_usu` (`cor_usu`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Bryann Milton','Ocampo','Vazquez ','2001-09-24','miltonf55','miltonf55@hotmail.com','qwerty');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-11 11:49:18
