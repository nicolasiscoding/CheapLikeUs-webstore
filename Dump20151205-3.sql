CREATE DATABASE  IF NOT EXISTS `schema` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `schema`;
-- MySQL dump 10.13  Distrib 5.5.46, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: schema
-- ------------------------------------------------------
-- Server version	5.5.46-0ubuntu0.14.04.2

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
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Product` (
  `ProductID` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `price` decimal(4,2) DEFAULT NULL,
  `stockquantity` int(11) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `active` tinyint(4) DEFAULT NULL,
  `alert` tinyint(1) DEFAULT '0',
  `LastPurchase` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product`
--

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
INSERT INTO `Product` VALUES (1,'Apple Macbook Air',89.00,15,'Apple Laptop',1,0,NULL),(2,'Alternator',31.60,9,'Recharges car battery',1,1,NULL),(3,'Shirt',10.00,88,'Comfort-fit',1,0,'2015-12-05 14:07:54'),(4,'Shoes',21.00,75,'They make you run faster.',1,0,'2015-12-05 14:07:54'),(5,'Pants',45.00,104,'Keeps you warm during the harsh Gainesville w',1,0,NULL),(6,'Jacket',63.88,17,'Keeps your lower body warm during the cold Ga',0,0,NULL),(7,'Starter',19.27,8,'Get your car started',1,0,NULL),(8,'Muffler',32.15,35,'Silences explosions caused by your engine',1,0,NULL),(9,'Socks',0.88,200,'Keeps your feet warm during the harsh Gainesv',1,0,NULL),(10,'iPhone 6S',99.00,34,'A sweet cellular device',1,0,NULL),(11,'toDel',9.00,99,'toDel',1,0,'2015-12-05 14:51:56');
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `nosupply` BEFORE UPDATE ON `schema`.`Product`
    FOR EACH ROW
	BEGIN
		IF NEW.stockquantity <= 5  THEN 
			SET NEW.alert = 1;
		END IF;

		IF NEW.stockquantity <= 0  THEN 
			SET NEW.active = 0;
		END IF;
 END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `PreventActiveItemDelete` BEFORE DELETE ON `Product` 
	FOR EACH ROW
	BEGIN
	  IF (SELECT TIMESTAMPDIFF (DAY,(SELECT LastPurchase FROM  Product WHERE ProductID = OLD.ProductID), (SELECT NOW()))) < 30 THEN -- Abort when trying to remove this record
		CALL cannot_delete_error; -- raise an error to prevent deleting from the table
	  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Supplier`
--

DROP TABLE IF EXISTS `Supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Supplier` (
  `id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Supplier`
--

LOCK TABLES `Supplier` WRITE;
/*!40000 ALTER TABLE `Supplier` DISABLE KEYS */;
INSERT INTO `Supplier` VALUES (1,'ACME Stuff Inc.'),(2,'Defacto Company Ltd.');
/*!40000 ALTER TABLE `Supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Supplies`
--

DROP TABLE IF EXISTS `Supplies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Supplies` (
  `productID` int(11) NOT NULL,
  `supplierID` int(11) NOT NULL,
  KEY `fk_Supplies_1_idx` (`productID`),
  KEY `fk_Supplies_2_idx` (`supplierID`),
  CONSTRAINT `fk_Supplies_1` FOREIGN KEY (`productID`) REFERENCES `Product` (`ProductID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Supplies_2` FOREIGN KEY (`supplierID`) REFERENCES `Supplier` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Supplies`
--

LOCK TABLES `Supplies` WRITE;
/*!40000 ALTER TABLE `Supplies` DISABLE KEYS */;
/*!40000 ALTER TABLE `Supplies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `containsTable`
--

DROP TABLE IF EXISTS `containsTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `containsTable` (
  `productID` int(11) DEFAULT NULL,
  `orderID` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  KEY `fk_containsTable_1_idx` (`productID`),
  KEY `fk_containsTable_2_idx` (`orderID`),
  CONSTRAINT `fk_containsTable_1` FOREIGN KEY (`productID`) REFERENCES `Product` (`ProductID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_containsTable_2` FOREIGN KEY (`orderID`) REFERENCES `orderTable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `containsTable`
--

LOCK TABLES `containsTable` WRITE;
/*!40000 ALTER TABLE `containsTable` DISABLE KEYS */;
/*!40000 ALTER TABLE `containsTable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderTable`
--

DROP TABLE IF EXISTS `orderTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orderTable` (
  `id` int(11) NOT NULL,
  `date` datetime DEFAULT NULL,
  `paid` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderTable`
--

LOCK TABLES `orderTable` WRITE;
/*!40000 ALTER TABLE `orderTable` DISABLE KEYS */;
INSERT INTO `orderTable` VALUES (1,'2015-12-02 00:00:00',1),(4,'1552-12-21 00:00:00',1),(5,'2015-12-04 12:52:53',1),(6,'2015-12-04 13:43:19',1),(7,'2015-12-04 13:45:35',1),(8,'2015-12-04 13:48:37',1),(9,'2015-12-04 13:53:28',1),(10,'2015-12-04 13:54:26',1),(11,'2015-12-04 13:54:57',1),(12,'2015-12-04 14:00:10',1),(13,'2015-12-04 14:02:42',1),(14,'2015-12-04 14:05:15',1),(15,'2015-12-04 14:05:16',1),(16,'2015-12-04 14:05:17',1),(17,'2015-12-04 14:05:21',1),(18,'2015-12-04 14:06:18',1),(19,'2015-12-04 14:07:00',1),(20,'2015-12-04 14:07:19',1),(21,'2015-12-04 14:10:07',1),(22,'2015-12-04 14:35:52',1),(23,'2015-12-04 14:37:43',1),(24,'2015-12-04 14:38:26',1),(25,'2015-12-04 14:38:28',1),(26,'2015-12-04 14:39:38',1),(27,'2015-12-04 14:40:25',1),(28,'2015-12-04 14:41:32',1),(29,'2015-12-04 14:44:16',1),(30,'2015-12-04 14:45:58',1),(31,'2015-12-04 14:48:42',1),(32,'2015-12-04 14:50:15',1),(33,'2015-12-04 14:50:32',1),(34,'2015-12-05 14:07:54',1);
/*!40000 ALTER TABLE `orderTable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userTable`
--

DROP TABLE IF EXISTS `userTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userTable` (
  `userID` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(15) DEFAULT NULL,
  `isStaff` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userTable`
--

LOCK TABLES `userTable` WRITE;
/*!40000 ALTER TABLE `userTable` DISABLE KEYS */;
INSERT INTO `userTable` VALUES (1,'Nicolas James','123 MAIN ST GAINESVILLE, FL 32608','NICOLASCODING@GMAIL.COM','password',1),(2,'Philip Smith','1313 MOCKINGBIRD LN GAINESVILLE, FL 32607','PHILIP@EMAIL.COM','pa$$word',1),(3,'Guest Account','22 ADDRESS RD GAINESVILLE, FL 32612','GUEST@EMAIL.COM','pa$Sword',0),(8,'Pops Tops','33 Main ST Gainesville, Fl 32612','TEST@EMAIL.COM','password1',0);
/*!40000 ALTER TABLE `userTable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userorderTable`
--

DROP TABLE IF EXISTS `userorderTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userorderTable` (
  `orderid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  KEY `fk_userorderTable_1_idx` (`orderid`),
  KEY `fk_userorderTable_2_idx` (`userid`),
  CONSTRAINT `fk_userorderTable_1` FOREIGN KEY (`orderid`) REFERENCES `orderTable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_userorderTable_2` FOREIGN KEY (`userid`) REFERENCES `userTable` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userorderTable`
--

LOCK TABLES `userorderTable` WRITE;
/*!40000 ALTER TABLE `userorderTable` DISABLE KEYS */;
INSERT INTO `userorderTable` VALUES (9,1),(10,1),(11,3),(12,3),(13,3),(14,3),(15,3),(16,3),(17,3),(18,3),(19,3),(20,3),(21,3),(22,3),(23,3),(24,3),(25,3),(26,3),(27,3),(28,3),(29,3),(30,3),(31,3),(32,3),(33,3),(34,3);
/*!40000 ALTER TABLE `userorderTable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'schema'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-12-05 15:06:57
