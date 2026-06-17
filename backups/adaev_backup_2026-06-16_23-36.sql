-- MySQL dump 10.13  Distrib 9.7.0, for Win64 (x86_64)
--
-- Host: localhost    Database: adaev
-- ------------------------------------------------------
-- Server version	9.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '4d086533-563a-11f1-83ac-88ad43ffe3ed:1-1980';

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int unsigned DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_al_user` (`user_id`),
  KEY `idx_al_entity` (`entity`,`entity_id`),
  KEY `idx_al_action` (`action`),
  KEY `idx_al_created_at` (`created_at`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,1,'auth:login','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 11:18:10'),(2,1,'auth:login','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:40:26'),(3,1,'products:create','products',1,NULL,'{\"sku\": \"IF-01\", \"name\": \"agua\", \"price\": 15, \"category_id\": null, \"description\": \"\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:40:52'),(4,1,'users:create','users',13,NULL,'{\"email\": \"sdqwq@gmail.com\", \"username\": \"admin1\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:41:54'),(5,1,'users:create','users',14,NULL,'{\"email\": \"sadqdqwdwq@gmail.com\", \"username\": \"admin2\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:42:18'),(6,1,'auth:logout','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:42:31'),(7,14,'auth:login','users',14,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:42:50'),(8,13,'auth:login','users',13,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:42:56'),(9,13,'sales:create_order','sales',1,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:43:13'),(10,13,'sales:create_order','sales',2,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:43:39'),(11,13,'sales:create_order','sales',3,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:43:48'),(12,13,'auth:logout','users',13,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:44:08'),(13,1,'auth:login','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:44:10'),(14,1,'inventory:in','inventory',1,NULL,'{\"type\": \"in\", \"reason\": null, \"event_id\": null, \"quantity\": 8, \"product_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:44:28'),(15,14,'sales:create','sales',4,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:45:35'),(16,13,'auth:login','users',13,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:46:40'),(17,13,'sales:create_order','sales',5,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:46:48'),(18,1,'events:create','events',1,NULL,'{\"name\": \"Gran poder\", \"status\": \"draft\", \"ends_at\": \"2026-06-16T00:47:00.000Z\", \"location\": \"\", \"starts_at\": \"2026-06-16T00:47:00.000Z\", \"description\": \"\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:47:07'),(19,1,'users:update','users',14,'{\"id\": 14, \"email\": \"sadqdqwdwq@gmail.com\", \"username\": \"admin2\", \"is_active\": 1, \"last_name\": \"qweqweqwdqqdw\", \"created_at\": \"2026-06-15T20:42:18.000Z\", \"first_name\": \"12312eqwe\", \"updated_at\": \"2026-06-15T20:42:50.000Z\", \"seller_type\": \"bartender\", \"last_login_at\": \"2026-06-15T20:42:50.000Z\", \"assigned_event_id\": null, \"assigned_event_name\": null}','{\"email\": \"sadqdqwdwq@gmail.com\", \"roles\": [4], \"last_name\": \"qweqweqwdqqdw\", \"first_name\": \"12312eqwe\", \"seller_type\": \"bartender\", \"assigned_event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:47:21'),(20,1,'users:update','users',13,'{\"id\": 13, \"email\": \"sdqwq@gmail.com\", \"username\": \"admin1\", \"is_active\": 1, \"last_name\": \"qweqweqw\", \"created_at\": \"2026-06-15T20:41:54.000Z\", \"first_name\": \"wqewqdqw\", \"updated_at\": \"2026-06-15T20:46:40.000Z\", \"seller_type\": \"waiter\", \"last_login_at\": \"2026-06-15T20:46:40.000Z\", \"assigned_event_id\": null, \"assigned_event_name\": null}','{\"email\": \"sdqwq@gmail.com\", \"roles\": [4], \"last_name\": \"qweqweqw\", \"first_name\": \"wqewqdqw\", \"seller_type\": \"waiter\", \"assigned_event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:47:28'),(21,13,'sales:create_order','sales',6,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:47:45'),(22,13,'sales:create_order','sales',7,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:47:59'),(23,1,'inventory:in','inventory',2,NULL,'{\"type\": \"in\", \"reason\": null, \"event_id\": 1, \"quantity\": 7, \"product_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:48:22'),(24,13,'sales:create_order','sales',8,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:48:39'),(25,1,'users:update','users',1,'{\"id\": 1, \"email\": \"admin@adaev.com\", \"username\": \"admin\", \"is_active\": 1, \"last_name\": \"Alberto Limachi\", \"created_at\": \"2026-06-10T18:11:34.000Z\", \"first_name\": \"Luis Rafael\", \"updated_at\": \"2026-06-15T20:44:10.000Z\", \"seller_type\": null, \"last_login_at\": \"2026-06-15T20:44:10.000Z\", \"assigned_event_id\": null, \"assigned_event_name\": null}','{\"email\": \"admin@adaev.com\", \"roles\": [4], \"last_name\": \"Alberto Limachi\", \"first_name\": \"Luis Rafael\", \"seller_type\": \"bartender\", \"assigned_event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:50:02'),(26,1,'auth:logout','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:50:45'),(27,14,'auth:logout','users',14,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:53:13'),(28,14,'auth:login','users',14,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:53:20'),(29,1,'auth:login','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 20:53:30'),(30,1,'auth:logout','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:02:12'),(31,1,'auth:login','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:02:14'),(32,1,'sales:create','sales',9,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:02:30'),(33,1,'sales:create','sales',10,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:02:47'),(34,1,'sales:create','sales',11,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:02:54'),(35,1,'auth:logout','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:04:25'),(36,13,'auth:login','users',13,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:04:31'),(37,13,'sales:create_order','sales',12,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:04:42'),(38,13,'sales:create_order','sales',13,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:04:53'),(39,13,'sales:create_order','sales',14,NULL,'{\"items\": 1, \"total\": 45, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:06:17'),(40,13,'sales:create_order','sales',15,NULL,'{\"items\": 1, \"total\": 30, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:06:39'),(41,13,'sales:create_order','sales',16,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:18:15'),(42,13,'sales:create_order','sales',17,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:18:38'),(43,13,'auth:logout','users',13,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:18:56'),(44,13,'auth:logout','users',13,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:18:58'),(45,13,'auth:login','users',13,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:19:09'),(46,14,'auth:login','users',14,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:19:14'),(47,13,'sales:create_order','sales',18,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:19:23'),(48,13,'sales:create_order','sales',19,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:19:32'),(49,13,'sales:create_order','sales',20,NULL,'{\"items\": 1, \"total\": 150, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:19:42'),(50,1,'auth:login','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:20:00'),(51,13,'sales:create_order','sales',21,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:20:12'),(52,1,'users:update','users',1,'{\"id\": 1, \"email\": \"admin@adaev.com\", \"username\": \"admin\", \"is_active\": 1, \"last_name\": \"Alberto Limachi\", \"created_at\": \"2026-06-10T18:11:34.000Z\", \"first_name\": \"Luis Rafael\", \"updated_at\": \"2026-06-15T21:20:00.000Z\", \"seller_type\": null, \"last_login_at\": \"2026-06-15T21:20:00.000Z\", \"assigned_event_id\": null, \"assigned_event_name\": null}','{\"email\": \"admin@adaev.com\", \"roles\": [1], \"last_name\": \"Alberto Limachi\", \"first_name\": \"Luis Rafael\", \"seller_type\": \"bartender\", \"assigned_event_id\": null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:21:17'),(53,13,'sales:create_order','sales',22,NULL,'{\"items\": 1, \"total\": 60, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:21:31'),(54,1,'users:create','users',15,NULL,'{\"email\": \"wqsdqwqd@gmail.com\", \"username\": \"admin3\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:22:18'),(55,1,'users:update','users',1,'{\"id\": 1, \"email\": \"admin@adaev.com\", \"username\": \"admin\", \"is_active\": 1, \"last_name\": \"Alberto Limachi\", \"created_at\": \"2026-06-10T18:11:34.000Z\", \"first_name\": \"Luis Rafael\", \"updated_at\": \"2026-06-15T21:21:16.000Z\", \"seller_type\": \"bartender\", \"last_login_at\": \"2026-06-15T21:20:00.000Z\", \"assigned_event_id\": null, \"assigned_event_name\": null}','{\"email\": \"admin@adaev.com\", \"roles\": [1], \"last_name\": \"Alberto Limachi\", \"first_name\": \"Luis Rafael\", \"seller_type\": \"bartender\", \"assigned_event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:22:31'),(56,13,'sales:create_order','sales',23,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:22:45'),(57,1,'auth:logout','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:22:50'),(58,1,'auth:login','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:22:52'),(59,13,'sales:create_order','sales',24,NULL,'{\"items\": 1, \"total\": 210, \"event_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:23:12'),(60,14,'sales:mark_ready','sales',6,NULL,'{\"confirmation_code\": \"8125\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:23:22'),(61,14,'sales:mark_ready','sales',7,NULL,'{\"confirmation_code\": \"9899\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:23:25'),(62,14,'sales:mark_ready','sales',8,NULL,'{\"confirmation_code\": \"6698\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:23:28'),(63,1,'sales:mark_ready','sales',12,NULL,'{\"confirmation_code\": \"8669\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:23:59'),(64,1,'inventory:in','inventory',2,NULL,'{\"type\": \"in\", \"reason\": null, \"event_id\": 1, \"quantity\": 30, \"product_id\": 1}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:24:34'),(65,1,'sales:mark_ready','sales',13,NULL,'{\"confirmation_code\": \"7058\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:24:38'),(66,1,'sales:mark_ready','sales',14,NULL,'{\"confirmation_code\": \"9818\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:24:42'),(67,1,'auth:logout','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:40:02'),(68,1,'auth:login','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:44:21'),(69,13,'auth:login','users',13,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:44:28'),(70,14,'auth:login','users',14,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:44:34'),(71,14,'sales:mark_ready','sales',15,NULL,'{\"confirmation_code\": \"9711\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:46:06'),(72,14,'sales:mark_ready','sales',22,NULL,'{\"confirmation_code\": \"3551\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:46:31'),(73,14,'sales:mark_ready','sales',16,NULL,'{\"confirmation_code\": \"9014\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:46:59'),(74,14,'sales:mark_ready','sales',17,NULL,'{\"confirmation_code\": \"9936\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:47:02'),(75,14,'sales:mark_ready','sales',18,NULL,'{\"confirmation_code\": \"8069\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:47:05'),(76,14,'sales:mark_ready','sales',24,NULL,'{\"confirmation_code\": \"5935\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:47:07'),(77,14,'sales:mark_ready','sales',23,NULL,'{\"confirmation_code\": \"2302\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:47:10'),(78,14,'sales:mark_ready','sales',19,NULL,'{\"confirmation_code\": \"8171\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:47:12'),(79,14,'sales:mark_ready','sales',21,NULL,'{\"confirmation_code\": \"8425\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 21:47:18'),(80,14,'auth:logout','users',14,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:01:45'),(81,13,'auth:login','users',13,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:01:57'),(82,13,'sales:confirm_delivery','sales',6,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:03:59'),(83,13,'auth:logout','users',13,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:12:21'),(84,14,'auth:login','users',14,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:12:28'),(85,13,'sales:confirm_delivery','sales',7,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:12:42'),(86,13,'auth:login','users',13,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:27:41'),(87,14,'auth:login','users',14,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:27:53'),(88,13,'sales:confirm_delivery','sales',8,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:28:12'),(89,13,'sales:confirm_delivery','sales',12,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:28:23'),(90,13,'sales:confirm_delivery','sales',13,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:29:09'),(91,13,'sales:confirm_delivery','sales',14,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:30:08'),(92,14,'auth:logout','users',14,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:30:22'),(93,13,'auth:logout','users',13,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-15 22:30:26'),(94,1,'auth:login','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 17:46:43'),(95,1,'events:update','events',1,'{\"status\": \"draft\"}','{\"name\": \"Gran poder\", \"status\": \"active\", \"ends_at\": \"2026-06-16T04:47:00.000Z\", \"location\": \"\", \"starts_at\": \"2026-06-16T04:47:00.000Z\", \"description\": \"\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 17:47:07'),(96,1,'finance:create','financial_movements',1,NULL,'{\"type\": \"donation\", \"amount\": 1000, \"category\": \"external_income\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 17:49:48'),(97,1,'auth:logout','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 17:51:31'),(98,1,'auth:login','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 17:51:32'),(99,1,'users:create','users',16,NULL,'{\"email\": \"12e31221@gmail.com\", \"username\": \"admin22\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 17:53:04'),(100,1,'finance:create','financial_movements',2,NULL,'{\"type\": \"loan\", \"amount\": 12312312, \"category\": \"contribution\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 17:53:52'),(101,1,'users:create','users',17,NULL,'{\"email\": \"wqwqwww@gmail.com\", \"username\": \"admin12345\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 18:04:18'),(102,1,'auth:login','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 18:31:34'),(103,1,'auth:login','users',1,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 18:32:57'),(104,1,'auth:login','users',1,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:10:05'),(105,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:12:07'),(106,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',NULL,'2026-06-16 19:14:09'),(107,13,'sales:confirm_delivery','sales',15,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:14:25'),(108,13,'sales:confirm_delivery','sales',16,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:14:37'),(109,13,'sales:confirm_delivery','sales',22,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:15:23'),(110,13,'sales:create_order','sales',25,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:15:55'),(111,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:20:36'),(112,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:22:22'),(113,14,'auth:logout','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:22:36'),(114,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:24:07'),(115,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:24:47'),(116,13,'sales:create_order','sales',26,NULL,'{\"items\": 1, \"total\": 30, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:25:09'),(117,13,'sales:confirm_delivery','sales',24,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:31:26'),(118,13,'auth:logout','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:31:38'),(119,14,'auth:logout','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:31:42'),(120,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:31:53'),(121,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:32:10'),(122,13,'sales:confirm_delivery','sales',23,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:32:24'),(123,13,'sales:confirm_delivery','sales',21,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:32:48'),(124,13,'sales:create_order','sales',27,NULL,'{\"items\": 1, \"total\": 45, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:33:15'),(125,14,'auth:logout','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:36:17'),(126,13,'auth:logout','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:36:25'),(127,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:36:34'),(128,14,'auth:logout','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:37:03'),(129,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:37:46'),(130,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:37:54'),(131,1,'auth:login','users',1,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:38:20'),(132,1,'inventory:in','inventory',2,NULL,'{\"type\": \"in\", \"reason\": null, \"event_id\": 1, \"quantity\": 50, \"product_id\": 1}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:38:39'),(133,14,'sales:mark_ready','sales',27,NULL,'{\"confirmation_code\": \"7025\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:38:47'),(134,14,'sales:mark_ready','sales',26,NULL,'{\"confirmation_code\": \"4649\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:39:00'),(135,14,'auth:logout','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:39:07'),(136,13,'auth:logout','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:39:10'),(137,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:39:17'),(138,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:39:51'),(139,14,'sales:mark_ready','sales',25,NULL,'{\"confirmation_code\": \"9385\"}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:40:03'),(140,14,'sales:mark_ready','sales',20,NULL,'{\"confirmation_code\": \"2892\"}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:40:17'),(141,13,'sales:create_order','sales',28,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:42:08'),(142,13,'sales:create_order','sales',29,NULL,'{\"items\": 1, \"total\": 60, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:42:18'),(143,14,'auth:logout','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:44:13'),(144,13,'auth:logout','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:45:20'),(145,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 19:45:31'),(146,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:45:39'),(147,14,'sales:mark_ready','sales',28,NULL,'{\"confirmation_code\": \"2443\"}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:46:06'),(148,14,'sales:mark_ready','sales',29,NULL,'{\"confirmation_code\": \"2037\"}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 19:53:11'),(149,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:12:58'),(150,14,'auth:logout','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:13:10'),(151,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:13:25'),(152,13,'sales:create_order','sales',30,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:13:37'),(153,13,'sales:create_order','sales',31,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:13:41'),(154,13,'sales:create_order','sales',32,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:13:45'),(155,14,'sales:mark_ready','sales',32,NULL,'{\"confirmation_code\": \"8825\"}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:13:48'),(156,14,'sales:mark_ready','sales',31,NULL,'{\"confirmation_code\": \"8017\"}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:14:31'),(157,14,'sales:mark_ready','sales',30,NULL,'{\"confirmation_code\": \"3775\"}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:14:44'),(158,13,'sales:create_order','sales',33,NULL,'{\"items\": 1, \"total\": 60, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:15:13'),(159,14,'sales:mark_ready','sales',33,NULL,'{\"confirmation_code\": \"3386\"}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:15:17'),(160,13,'auth:logout','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:15:37'),(161,14,'auth:logout','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:15:40'),(162,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:15:51'),(163,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:15:58'),(164,13,'sales:create_order','sales',34,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:16:10'),(165,13,'sales:create_order','sales',35,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:16:16'),(166,13,'sales:create_order','sales',36,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:16:21'),(167,13,'sales:create_order','sales',37,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:16:25'),(168,14,'sales:mark_ready','sales',37,NULL,'{\"confirmation_code\": \"1534\"}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:16:27'),(169,14,'sales:mark_ready','sales',34,NULL,'{\"confirmation_code\": \"2542\"}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:16:35'),(170,14,'auth:logout','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:16:46'),(171,13,'auth:logout','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:16:51'),(172,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:16:56'),(173,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:20:31'),(174,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:20:56'),(175,14,'sales:mark_ready','sales',36,NULL,'{\"confirmation_code\": \"8674\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:21:07'),(176,14,'sales:mark_ready','sales',35,NULL,'{\"confirmation_code\": \"5735\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:21:18'),(177,1,'auth:login','users',1,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:36:14'),(178,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:37:34'),(179,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:41:44'),(180,13,'sales:confirm_delivery','sales',37,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:42:06'),(181,13,'sales:confirm_delivery','sales',36,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:42:52'),(182,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:48:49'),(183,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:49:07'),(184,13,'sales:confirm_delivery','sales',35,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:49:39'),(185,14,'auth:logout','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:49:48'),(186,13,'auth:logout','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:49:50'),(187,14,'auth:login','users',14,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:49:59'),(188,14,'sales:create','sales',38,NULL,'{\"items\": 1, \"total\": 15, \"event_id\": 1}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 20:50:19'),(189,1,'auth:login','users',1,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 20:59:53'),(190,1,'users:create','users',18,NULL,'{\"email\": \"sadasdas@gmail.com\", \"username\": \"admin4\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0',NULL,'2026-06-16 21:01:05'),(191,18,'auth:login','users',18,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 21:01:39'),(192,18,'custody:create','custody_items',1,NULL,'{\"description\": \"Mochila\", \"ticket_code\": \"123456\"}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 21:02:44'),(193,18,'custody:return','custody_items',1,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 21:03:06'),(194,18,'custody:create','custody_items',2,NULL,'{\"description\": \"Mochila\", \"ticket_code\": \"123456\"}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 21:03:34'),(195,18,'custody:return','custody_items',2,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 21:04:47'),(196,18,'custody:create','custody_items',3,NULL,'{\"description\": \"Mochila\", \"ticket_code\": \"12344\"}','127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 21:09:10'),(197,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 22:45:48'),(198,13,'auth:logout','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 22:45:57'),(199,18,'auth:login','users',18,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 22:46:07'),(200,18,'custody:return','custody_items',3,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 22:46:52'),(201,18,'auth:login','users',18,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 22:57:28'),(202,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 23:01:31'),(203,1,'auth:login','users',1,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 23:01:52'),(204,1,'auth:logout','users',1,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 23:02:40'),(205,13,'auth:login','users',13,NULL,NULL,'127.0.0.1','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',NULL,'2026-06-16 23:04:19');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cash_movements`
--

DROP TABLE IF EXISTS `cash_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_movements` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cash_session_id` int unsigned NOT NULL,
  `type` enum('open','close','in','out','adjustment') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_cm_session` (`cash_session_id`),
  KEY `idx_cm_type` (`type`),
  KEY `idx_cm_created_at` (`created_at`),
  CONSTRAINT `cash_movements_ibfk_1` FOREIGN KEY (`cash_session_id`) REFERENCES `cash_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cash_movements_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_movements`
--

LOCK TABLES `cash_movements` WRITE;
/*!40000 ALTER TABLE `cash_movements` DISABLE KEYS */;
INSERT INTO `cash_movements` VALUES (1,1,'open',0.00,'Apertura de caja',1,'2026-06-14 00:50:52'),(2,1,'in',200.00,NULL,1,'2026-06-14 00:51:24'),(3,1,'in',350.00,NULL,1,'2026-06-14 00:51:41'),(4,1,'in',500.00,'entradas',1,'2026-06-14 00:51:50'),(5,1,'close',950.00,'Cierre de caja',1,'2026-06-14 00:52:44'),(6,2,'open',950.00,'Apertura de caja',1,'2026-06-14 00:54:10'),(7,2,'out',200.00,NULL,1,'2026-06-14 00:54:24'),(8,2,'adjustment',350.00,NULL,1,'2026-06-14 00:54:34');
/*!40000 ALTER TABLE `cash_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cash_registers`
--

DROP TABLE IF EXISTS `cash_registers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_registers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cash_registers_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_registers`
--

LOCK TABLES `cash_registers` WRITE;
/*!40000 ALTER TABLE `cash_registers` DISABLE KEYS */;
INSERT INTO `cash_registers` VALUES (1,'Rafael','encargado de caja',1,'2026-06-14 00:50:39','2026-06-14 00:50:39');
/*!40000 ALTER TABLE `cash_registers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cash_sessions`
--

DROP TABLE IF EXISTS `cash_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_sessions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cash_register_id` int unsigned NOT NULL,
  `event_id` int unsigned DEFAULT NULL,
  `opened_by` int unsigned DEFAULT NULL,
  `closed_by` int unsigned DEFAULT NULL,
  `opening_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `closing_amount` decimal(10,2) DEFAULT NULL,
  `expected_amount` decimal(10,2) DEFAULT NULL,
  `difference` decimal(10,2) DEFAULT NULL,
  `status` enum('open','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `opened_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `closed_at` datetime DEFAULT NULL,
  `notes` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `opened_by` (`opened_by`),
  KEY `closed_by` (`closed_by`),
  KEY `idx_cs_register` (`cash_register_id`),
  KEY `idx_cs_event` (`event_id`),
  KEY `idx_cs_status` (`status`),
  KEY `idx_cs_opened_at` (`opened_at`),
  CONSTRAINT `cash_sessions_ibfk_1` FOREIGN KEY (`cash_register_id`) REFERENCES `cash_registers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cash_sessions_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `cash_sessions_ibfk_3` FOREIGN KEY (`opened_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `cash_sessions_ibfk_4` FOREIGN KEY (`closed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_sessions`
--

LOCK TABLES `cash_sessions` WRITE;
/*!40000 ALTER TABLE `cash_sessions` DISABLE KEYS */;
INSERT INTO `cash_sessions` VALUES (1,1,1,1,1,0.00,950.00,0.00,950.00,'closed','2026-06-14 00:50:52','2026-06-14 00:52:44',NULL,'2026-06-14 00:50:52','2026-06-14 00:52:44'),(2,1,1,1,NULL,950.00,NULL,NULL,NULL,'open','2026-06-14 00:54:10',NULL,NULL,'2026-06-14 00:54:10','2026-06-14 00:54:10');
/*!40000 ALTER TABLE `cash_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` int unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_categories_parent` (`parent_id`),
  KEY `idx_categories_name` (`name`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `custody_items`
--

DROP TABLE IF EXISTS `custody_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `custody_items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ticket_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` int unsigned DEFAULT NULL,
  `operator_id` int unsigned DEFAULT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `observations` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `photo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','returned','lost') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `received_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `returned_at` datetime DEFAULT NULL,
  `returned_by` int unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `operator_id` (`operator_id`),
  KEY `returned_by` (`returned_by`),
  KEY `idx_custody_ticket` (`ticket_code`),
  KEY `idx_custody_event` (`event_id`),
  KEY `idx_custody_status` (`status`),
  KEY `idx_custody_received` (`received_at`),
  CONSTRAINT `custody_items_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `custody_items_ibfk_2` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `custody_items_ibfk_3` FOREIGN KEY (`returned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `custody_items`
--

LOCK TABLES `custody_items` WRITE;
/*!40000 ALTER TABLE `custody_items` DISABLE KEYS */;
INSERT INTO `custody_items` VALUES (1,'123456',1,18,'Mochila','Negro',5.00,'/uploads/custody/1781658164058_32496.jpg','returned','2026-06-16 21:02:44','2026-06-16 21:03:06',18,'2026-06-16 21:02:44','2026-06-16 21:03:06'),(2,'123456',1,18,'Mochila','Negro',1.00,NULL,'returned','2026-06-16 21:03:34','2026-06-16 21:04:47',18,'2026-06-16 21:03:34','2026-06-16 21:04:47'),(3,'12344',1,18,'Mochila','Negro',3.00,NULL,'returned','2026-06-16 21:09:10','2026-06-16 22:46:51',18,'2026-06-16 21:09:10','2026-06-16 22:46:51');
/*!40000 ALTER TABLE `custody_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_products`
--

DROP TABLE IF EXISTS `event_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `event_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_event_product` (`event_id`,`product_id`),
  KEY `idx_ep_event` (`event_id`),
  KEY `idx_ep_product` (`product_id`),
  CONSTRAINT `event_products_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `event_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_products`
--

LOCK TABLES `event_products` WRITE;
/*!40000 ALTER TABLE `event_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `starts_at` datetime NOT NULL,
  `ends_at` datetime DEFAULT NULL,
  `status` enum('draft','active','paused','closed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` int unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_events_status` (`status`),
  KEY `idx_events_starts_at` (`starts_at`),
  KEY `idx_events_name` (`name`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Gran poder','','','2026-06-16 04:47:00','2026-06-16 04:47:00','active',1,1,'2026-06-15 20:47:06','2026-06-16 17:47:07');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financial_movements`
--

DROP TABLE IF EXISTS `financial_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financial_movements` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `event_id` int unsigned DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `organization_id` int unsigned DEFAULT NULL,
  `related_movement_id` int unsigned DEFAULT NULL,
  `category` enum('external_income','contribution','expense','return') COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `organization_id` (`organization_id`),
  KEY `related_movement_id` (`related_movement_id`),
  KEY `idx_fm_event` (`event_id`),
  KEY `idx_fm_category` (`category`),
  KEY `idx_fm_type` (`type`),
  KEY `idx_fm_date` (`date`),
  CONSTRAINT `financial_movements_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `financial_movements_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `financial_movements_ibfk_3` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `financial_movements_ibfk_4` FOREIGN KEY (`related_movement_id`) REFERENCES `financial_movements` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financial_movements`
--

LOCK TABLES `financial_movements` WRITE;
/*!40000 ALTER TABLE `financial_movements` DISABLE KEYS */;
INSERT INTO `financial_movements` VALUES (1,1,1,NULL,NULL,'external_income','donation',1000.00,NULL,'2026-06-16','2026-06-16 17:49:48','2026-06-16 17:49:48'),(2,1,1,1,NULL,'contribution','loan',12312312.00,'213123','2026-06-16','2026-06-16 17:53:52','2026-06-16 17:53:52');
/*!40000 ALTER TABLE `financial_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `event_id` int unsigned DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `min_stock` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_inventory_product_event` (`product_id`,`event_id`),
  KEY `idx_inventory_product` (`product_id`),
  KEY `idx_inventory_event` (`event_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,1,NULL,7,0,'2026-06-15 20:44:27','2026-06-15 20:45:35'),(2,1,1,17,0,'2026-06-15 20:48:22','2026-06-16 20:50:19');
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_movements`
--

DROP TABLE IF EXISTS `inventory_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_movements` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `inventory_id` int unsigned NOT NULL,
  `type` enum('in','out','adjustment','return') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_im_inventory` (`inventory_id`),
  KEY `idx_im_type` (`type`),
  KEY `idx_im_created_at` (`created_at`),
  CONSTRAINT `inventory_movements_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inventory_movements_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_movements`
--

LOCK TABLES `inventory_movements` WRITE;
/*!40000 ALTER TABLE `inventory_movements` DISABLE KEYS */;
INSERT INTO `inventory_movements` VALUES (1,1,'out',1,'Venta',NULL,14,'2026-06-15 20:45:35'),(2,2,'out',1,'Venta',NULL,1,'2026-06-15 21:02:30'),(3,2,'out',1,'Venta',NULL,1,'2026-06-15 21:02:47'),(4,2,'out',1,'Venta',NULL,1,'2026-06-15 21:02:54'),(5,2,'out',1,'Preparación de pedido #6',NULL,14,'2026-06-15 21:23:22'),(6,2,'out',1,'Preparación de pedido #7',NULL,14,'2026-06-15 21:23:25'),(7,2,'out',1,'Preparación de pedido #8',NULL,14,'2026-06-15 21:23:28'),(8,2,'out',1,'Preparación de pedido #12',NULL,1,'2026-06-15 21:23:59'),(9,2,'in',30,NULL,NULL,1,'2026-06-15 21:24:34'),(10,2,'out',1,'Preparación de pedido #13',NULL,1,'2026-06-15 21:24:38'),(11,2,'out',3,'Preparación de pedido #14',NULL,1,'2026-06-15 21:24:42'),(12,2,'out',2,'Preparación de pedido #15',NULL,14,'2026-06-15 21:46:06'),(13,2,'out',4,'Preparación de pedido #22',NULL,14,'2026-06-15 21:46:31'),(14,2,'out',1,'Preparación de pedido #16',NULL,14,'2026-06-15 21:46:59'),(15,2,'out',1,'Preparación de pedido #17',NULL,14,'2026-06-15 21:47:02'),(16,2,'out',1,'Preparación de pedido #18',NULL,14,'2026-06-15 21:47:05'),(17,2,'out',14,'Preparación de pedido #24',NULL,14,'2026-06-15 21:47:07'),(18,2,'out',1,'Preparación de pedido #23',NULL,14,'2026-06-15 21:47:10'),(19,2,'out',1,'Preparación de pedido #19',NULL,14,'2026-06-15 21:47:12'),(20,2,'out',1,'Preparación de pedido #21',NULL,14,'2026-06-15 21:47:18'),(21,2,'in',50,NULL,NULL,1,'2026-06-16 19:38:39'),(22,2,'out',3,'Preparación de pedido #27',NULL,14,'2026-06-16 19:38:47'),(23,2,'out',2,'Preparación de pedido #26',NULL,14,'2026-06-16 19:38:59'),(24,2,'out',1,'Preparación de pedido #25',NULL,14,'2026-06-16 19:40:03'),(25,2,'out',10,'Preparación de pedido #20',NULL,14,'2026-06-16 19:40:17'),(26,2,'out',1,'Preparación de pedido #28',NULL,14,'2026-06-16 19:46:05'),(27,2,'out',4,'Preparación de pedido #29',NULL,14,'2026-06-16 19:53:11'),(28,2,'out',1,'Preparación de pedido #32',NULL,14,'2026-06-16 20:13:48'),(29,2,'out',1,'Preparación de pedido #31',NULL,14,'2026-06-16 20:14:31'),(30,2,'out',1,'Preparación de pedido #30',NULL,14,'2026-06-16 20:14:44'),(31,2,'out',4,'Preparación de pedido #33',NULL,14,'2026-06-16 20:15:16'),(32,2,'out',1,'Preparación de pedido #37',NULL,14,'2026-06-16 20:16:27'),(33,2,'out',1,'Preparación de pedido #34',NULL,14,'2026-06-16 20:16:35'),(34,2,'out',1,'Preparación de pedido #36',NULL,14,'2026-06-16 20:21:07'),(35,2,'out',1,'Preparación de pedido #35',NULL,14,'2026-06-16 20:21:17'),(36,2,'out',1,'Venta',NULL,14,'2026-06-16 20:50:19');
/*!40000 ALTER TABLE `inventory_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observations` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_org_name` (`name`),
  KEY `idx_org_type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (1,'12312312',NULL,'12312312','2131231231',NULL,1,'2026-06-16 17:53:18','2026-06-16 17:53:18');
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_permissions_code` (`code`),
  KEY `idx_permissions_module` (`module`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'events:read','events','read','Ver listado y detalle de eventos','2026-06-10 13:04:20'),(2,'events:create','events','create','Crear nuevos eventos','2026-06-10 13:04:20'),(3,'events:update','events','update','Editar eventos existentes','2026-06-10 13:04:20'),(4,'events:delete','events','delete','Eliminar o desactivar eventos','2026-06-10 13:04:20'),(5,'categories:read','categories','read','Ver categor├¡as','2026-06-10 13:04:20'),(6,'categories:create','categories','create','Crear categor├¡as','2026-06-10 13:04:20'),(7,'categories:update','categories','update','Editar categor├¡as','2026-06-10 13:04:20'),(8,'categories:delete','categories','delete','Eliminar categor├¡as','2026-06-10 13:04:20'),(9,'products:read','products','read','Ver cat├ílogo de productos','2026-06-10 13:04:20'),(10,'products:create','products','create','Agregar nuevos productos','2026-06-10 13:04:20'),(11,'products:update','products','update','Editar productos existentes','2026-06-10 13:04:20'),(12,'products:delete','products','delete','Eliminar o desactivar productos','2026-06-10 13:04:20'),(13,'inventory:read','inventory','read','Ver stock actual','2026-06-10 13:04:20'),(14,'inventory:adjust','inventory','adjust','Realizar ajustes de inventario','2026-06-10 13:04:20'),(15,'sales:read','sales','read','Ver historial de ventas','2026-06-10 13:04:20'),(16,'sales:create','sales','create','Registrar nuevas ventas','2026-06-10 13:04:20'),(17,'sales:void','sales','void','Anular ventas','2026-06-10 13:04:20'),(22,'audit:read','audit','read','Ver registros de auditor├¡a','2026-06-10 13:04:20'),(23,'users:manage','users','manage','Crear, editar y desactivar usuarios','2026-06-10 13:04:20'),(24,'roles:manage','roles','manage','Gestionar roles y asignar permisos','2026-06-10 13:04:20'),(25,'dashboard:view','dashboard','view','Acceder al panel de control','2026-06-10 13:04:20'),(26,'sales:read_all','sales','read_all','Ver todas las ventas de todos los vendedores','2026-06-12 23:57:45'),(27,'sales:void_all','sales','void_all','Anular cualquier venta','2026-06-12 23:57:45'),(28,'sales:prepare','sales','prepare','Ver cola de pedidos y marcarlos como listos','2026-06-12 23:57:45'),(29,'sales:confirm_delivery','sales','confirm_delivery','Confirmar entrega de pedido con c├│digo','2026-06-12 23:57:45'),(30,'custody:create','custody','create','Registrar objetos en custodia','2026-06-13 19:57:10'),(31,'custody:read','custody','read','Ver registros de custodia','2026-06-13 19:57:10'),(32,'custody:return','custody','return','Marcar objeto como devuelto','2026-06-13 19:57:10'),(33,'custody:manage','custody','manage','Gesti├│n completa de custodia (admin)','2026-06-13 19:57:10'),(34,'finance:read','finance','read','Ver movimientos financieros','2026-06-14 02:20:28'),(35,'finance:create','finance','create','Registrar movimientos financieros','2026-06-14 02:20:28'),(36,'finance:delete','finance','delete','Eliminar movimientos financieros','2026-06-14 02:20:28'),(37,'finance:summary','finance','summary','Ver resumen financiero del evento','2026-06-14 02:20:28'),(38,'organizations:read','finance','org_read','Ver organizaciones','2026-06-14 02:20:28'),(39,'organizations:manage','finance','org_manage','Gestionar organizaciones','2026-06-14 02:20:28');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `category_id` int unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` int unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `created_by` (`created_by`),
  KEY `idx_products_name` (`name`),
  KEY `idx_products_sku` (`sku`),
  KEY `idx_products_category` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'agua',NULL,'IF-01',15.00,NULL,1,1,'2026-06-15 20:40:51','2026-06-15 20:40:51');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL DEFAULT '0',
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_rt_token` (`token`),
  KEY `idx_rt_user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=225 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'1d175bb0-0453-4282-b3e2-968b8b39fefa',0,'2026-06-17 22:29:18','2026-06-10 18:29:18'),(2,1,'0ca5c6f2-830d-402f-a498-c474be45c257',0,'2026-06-17 22:38:36','2026-06-10 18:38:36'),(3,1,'883224a7-82ab-4d9c-b902-5b19a93d1c75',0,'2026-06-17 22:53:32','2026-06-10 18:53:32'),(4,1,'05a43522-ba91-4141-a09b-7ab8e8146cf0',0,'2026-06-18 03:16:56','2026-06-10 23:16:56'),(5,1,'bb9c9a52-0e31-49f2-a6dd-1920254a6549',0,'2026-06-18 03:56:40','2026-06-10 23:56:40'),(6,1,'f19bbf11-0735-43b3-b4be-e375090617ca',0,'2026-06-18 13:00:26','2026-06-11 09:00:26'),(7,1,'c09daa9b-43bb-4c51-8ef7-7b97aa2e840e',0,'2026-06-18 23:44:39','2026-06-11 19:44:39'),(8,1,'5e005df5-c3f9-4ed7-9889-dc5f3abde56b',1,'2026-06-19 04:51:48','2026-06-12 00:51:48'),(9,1,'3616dff8-be77-447f-941c-1828a381f442',0,'2026-06-19 05:08:07','2026-06-12 01:08:06'),(10,1,'900a3666-58ea-4cfa-966c-6de47dcfd824',0,'2026-06-19 05:08:07','2026-06-12 01:08:06'),(11,1,'4fe33bf6-ff70-4ad0-b0d4-20e437e3c752',1,'2026-06-19 16:17:32','2026-06-12 12:17:31'),(12,1,'1840b839-0e85-454e-8d37-82c1db297f4a',1,'2026-06-19 16:33:03','2026-06-12 12:33:02'),(13,1,'6fecd0a1-6cdd-4519-b162-329d9de7d797',1,'2026-06-19 21:38:21','2026-06-12 17:38:21'),(14,1,'1876b013-87c6-4eee-ba79-01cc78bdb361',0,'2026-06-19 21:56:58','2026-06-12 17:56:58'),(15,1,'3451e053-1ec8-4dbf-8ad5-27abdc4d6501',1,'2026-06-19 21:56:58','2026-06-12 17:56:58'),(16,1,'3bbb643d-14a0-47c4-876f-3a2393ccbc1f',1,'2026-06-19 22:14:01','2026-06-12 18:14:00'),(17,1,'59a42605-694d-441b-9704-fa98666a5200',0,'2026-06-19 22:29:02','2026-06-12 18:29:01'),(18,1,'3a4a9af7-6762-43b6-bd74-1851bdb267c9',0,'2026-06-19 22:29:02','2026-06-12 18:29:01'),(19,1,'c449a527-3f0a-4739-83e1-40f19f41bbd9',0,'2026-06-19 22:29:02','2026-06-12 18:29:01'),(20,1,'3e8e0818-87cf-4f4d-8072-ef4399dc95cc',1,'2026-06-19 22:29:02','2026-06-12 18:29:01'),(21,1,'eedf228d-1cd4-4381-bbda-6c0819fd1d68',0,'2026-06-19 22:46:22','2026-06-12 18:46:21'),(22,1,'18f318b1-c906-4f93-828d-8533b13cdaa7',0,'2026-06-19 22:46:22','2026-06-12 18:46:21'),(23,1,'59941c78-716f-40e1-a34d-996747c4c5be',0,'2026-06-19 22:46:22','2026-06-12 18:46:21'),(24,1,'6e8b2070-cac3-4ab7-9838-b7ad2ff99292',0,'2026-06-19 22:46:22','2026-06-12 18:46:21'),(25,1,'09e39f5b-cf23-4d3c-927a-e337fa766ecf',0,'2026-06-19 22:46:22','2026-06-12 18:46:21'),(26,1,'0f8bc087-35a5-4b8d-968d-218f283ac580',0,'2026-06-19 22:46:22','2026-06-12 18:46:21'),(27,1,'e359a97e-4ed1-4f55-881a-b2a68ca71be5',1,'2026-06-20 00:06:11','2026-06-12 20:06:11'),(28,1,'13bb1e37-522b-4fa3-9939-0bd1e428db9a',1,'2026-06-20 00:09:40','2026-06-12 20:09:40'),(30,1,'a7e5a0d5-77fc-45c4-8838-a41df560b505',1,'2026-06-20 00:11:32','2026-06-12 20:11:32'),(33,1,'2bec21f6-590a-4af6-99f2-3502c7792f0c',1,'2026-06-20 00:44:50','2026-06-12 20:44:50'),(36,1,'e3119911-376d-4428-b4d8-0e0140bb9271',1,'2026-06-20 00:48:42','2026-06-12 20:48:41'),(42,1,'938df519-d51c-4faa-b11e-3a8db5e6f32a',1,'2026-06-20 02:59:03','2026-06-12 22:59:03'),(44,1,'1288af52-db4f-43c9-bc7c-3d9f6bdb2caa',1,'2026-06-20 14:00:32','2026-06-13 10:00:31'),(46,1,'1cea2da0-d813-4586-9126-311b850abd1d',1,'2026-06-20 14:02:13','2026-06-13 10:02:12'),(48,1,'2208cdc2-7029-4849-8348-ebe1204706d1',1,'2026-06-20 14:20:43','2026-06-13 10:20:42'),(52,1,'071d28d3-c7cd-4067-9cc8-abbc1b8788dc',1,'2026-06-20 15:10:45','2026-06-13 11:10:44'),(54,1,'db72e25b-c594-47fb-8ee1-242fa6dac207',1,'2026-06-20 15:12:49','2026-06-13 11:12:48'),(70,1,'b109258f-ba39-434d-b433-5f4cc1c71da9',1,'2026-06-20 19:39:33','2026-06-13 15:39:32'),(72,1,'10f70450-7e9a-4bc5-b6d3-e5dd0d18d834',1,'2026-06-20 19:50:59','2026-06-13 15:50:59'),(74,1,'cf6b5a47-f1e2-4309-8de6-8ea0d34b01a7',1,'2026-06-20 19:56:38','2026-06-13 15:56:37'),(76,1,'74e6090b-3417-4cfe-a9a6-642b69bdf471',1,'2026-06-21 00:15:39','2026-06-13 20:15:38'),(77,1,'35a66036-bd3b-4ce2-933f-991e010a8ff5',0,'2026-06-21 00:59:57','2026-06-13 20:59:56'),(78,1,'df3fe174-3d8f-4a34-abae-3a231ff8c279',0,'2026-06-21 00:59:57','2026-06-13 20:59:56'),(79,1,'3c74f727-1877-47d1-9116-1861f236e465',1,'2026-06-21 04:37:08','2026-06-14 00:37:07'),(80,1,'ad3bc079-715c-4a53-b33d-1e69e05ac77f',0,'2026-06-21 04:52:20','2026-06-14 00:52:20'),(81,1,'1508f46d-2642-4c2f-b4ad-11482cbc2e1a',0,'2026-06-21 05:51:31','2026-06-14 01:51:30'),(82,1,'24b57b09-3611-41d4-9598-8c1b222800fd',0,'2026-06-21 16:19:33','2026-06-14 12:19:33'),(83,1,'4d2ce57c-d413-40fe-b24d-a904226a676e',0,'2026-06-21 21:01:40','2026-06-14 17:01:40'),(84,1,'26c1c2e2-deef-4de1-96c1-10d4388985e0',1,'2026-06-21 21:24:36','2026-06-14 17:24:36'),(85,1,'12460955-da5d-4a2a-a40a-c77773af19f9',0,'2026-06-21 21:35:56','2026-06-14 17:35:55'),(86,1,'66b4a6f8-77bd-47db-a0bd-935d361f681b',1,'2026-06-21 21:42:05','2026-06-14 17:42:05'),(87,1,'24f72954-1fe1-4871-8265-58359ca2e1ad',0,'2026-06-21 21:54:00','2026-06-14 17:53:59'),(88,1,'4aff159e-fedd-4527-8304-eba25104dc97',1,'2026-06-22 01:57:28','2026-06-14 21:57:28'),(89,1,'1df5f3ad-5e34-451d-b60b-ad48393103b3',1,'2026-06-22 02:02:54','2026-06-14 22:02:54'),(90,1,'34d67858-c85f-4b53-9fd9-c67dac42f643',0,'2026-06-22 02:18:11','2026-06-14 22:18:10'),(91,1,'e43d7e72-a99a-4c25-9eb0-4bf83a18d469',0,'2026-06-22 02:18:11','2026-06-14 22:18:10'),(92,1,'b7b2acb0-b66a-4a8f-9326-79adff7fc1b8',0,'2026-06-22 02:18:11','2026-06-14 22:18:10'),(93,1,'80387b2f-f4bf-45a0-ac4f-cf38b4093a80',1,'2026-06-22 02:18:11','2026-06-14 22:18:11'),(94,1,'63a0499d-6d10-41b8-a2eb-d245875b3a14',1,'2026-06-22 02:33:41','2026-06-14 22:33:40'),(95,1,'fd393c16-0c78-4e14-98b2-ca070cb93d51',0,'2026-06-22 02:39:40','2026-06-14 22:39:40'),(96,1,'bef681d3-ae1d-4c88-82d8-302095753189',1,'2026-06-22 02:39:47','2026-06-14 22:39:47'),(97,1,'a54cb978-f65e-474f-a5c4-4d8f1bd596f9',1,'2026-06-22 02:54:51','2026-06-14 22:54:51'),(102,1,'17dd7631-caac-44b6-a6ee-079251bcf074',1,'2026-06-22 03:02:48','2026-06-14 23:02:47'),(104,1,'9ee561f1-f1f2-45ef-9a17-109f17b57a73',1,'2026-06-22 03:05:17','2026-06-14 23:05:17'),(108,1,'a28f0154-e327-4307-b004-06e2ca02e405',1,'2026-06-22 03:37:58','2026-06-14 23:37:57'),(110,1,'63f31660-03d1-4354-b9d8-1cb344962080',1,'2026-06-22 03:40:12','2026-06-14 23:40:11'),(112,1,'e6c5bbf4-c867-453f-921f-a4bbfa27d466',1,'2026-06-22 03:42:06','2026-06-14 23:42:05'),(114,1,'af180572-8c12-4b45-8b0f-d95acab144b1',1,'2026-06-22 03:43:03','2026-06-14 23:43:02'),(116,1,'42085d6c-7e6c-4a48-a1f5-3c3de4204cef',1,'2026-06-22 03:44:45','2026-06-14 23:44:44'),(118,1,'ce6aa547-6c9f-424b-9204-3a2819e54276',1,'2026-06-22 03:45:55','2026-06-14 23:45:54'),(120,1,'0ece0219-5295-45c4-ba98-debc85136415',1,'2026-06-22 03:46:47','2026-06-14 23:46:46'),(121,1,'a925bbee-886c-4e2a-8ac2-edef8d3686c9',1,'2026-06-22 03:47:25','2026-06-14 23:47:25'),(123,1,'6ac34cff-7ca6-4862-a7d6-8aefdea6f8af',1,'2026-06-22 03:48:06','2026-06-14 23:48:05'),(128,1,'c0dd1e2c-b689-497a-94b9-ca104a6b99e3',1,'2026-06-22 03:55:25','2026-06-14 23:55:25'),(130,1,'5b4e7179-53f1-46b4-a919-f7afb98f02a6',1,'2026-06-22 03:58:30','2026-06-14 23:58:30'),(132,1,'5279ddeb-0cb7-47a6-aeae-bc2393f05859',1,'2026-06-22 07:26:22','2026-06-15 03:26:21'),(133,1,'edabe025-76ff-45f4-a834-58d6943a432b',0,'2026-06-22 07:28:09','2026-06-15 03:28:09'),(134,1,'5264daf4-2f82-4b8b-8960-6f8fab4610ad',0,'2026-06-22 07:35:41','2026-06-15 03:35:40'),(135,1,'94af4d85-65c8-4aa8-8327-fb41b8ee012d',0,'2026-06-22 15:18:10','2026-06-15 11:18:10'),(136,1,'c65fab7a-c6db-4dbe-b2fa-e0ecf7a25d2a',1,'2026-06-23 00:40:26','2026-06-15 20:40:25'),(137,14,'fd5f38c4-9137-4b2f-b6ee-d3ccf31bfb66',0,'2026-06-23 00:42:51','2026-06-15 20:42:50'),(138,13,'36b676e3-9633-4019-a312-ca886b3e1dbd',1,'2026-06-23 00:42:56','2026-06-15 20:42:56'),(139,1,'9da86bea-f231-447b-90ef-99a1478a07b9',0,'2026-06-23 00:44:11','2026-06-15 20:44:10'),(140,13,'41fbbc9b-0852-4ae0-9f47-3a465e74b7c7',1,'2026-06-23 00:46:40','2026-06-15 20:46:40'),(141,14,'d3dab6d5-dec0-4562-9165-b4911aba892c',0,'2026-06-23 00:53:20','2026-06-15 20:53:20'),(142,1,'3a39b101-259d-40fd-bcb0-a8fa7e11ef58',1,'2026-06-23 00:53:31','2026-06-15 20:53:30'),(143,1,'ace7baba-d75e-4e9e-8883-6def7f5964e9',1,'2026-06-23 01:02:14','2026-06-15 21:02:13'),(144,1,'88201cbd-19dd-490e-bae1-e4fb5875ef57',1,'2026-06-23 01:02:30','2026-06-15 21:02:30'),(145,13,'d8d81d76-ec01-4a70-a0d9-54569afc2299',1,'2026-06-23 01:04:31','2026-06-15 21:04:30'),(146,13,'11bc8501-168a-461e-a49b-aef969744954',0,'2026-06-23 01:10:51','2026-06-15 21:10:51'),(147,13,'24434088-16c9-4602-a750-9c280fd13df4',0,'2026-06-23 01:10:51','2026-06-15 21:10:51'),(148,13,'ec9cc66d-7982-45bb-878d-e2288e2dc674',0,'2026-06-23 01:10:51','2026-06-15 21:10:51'),(149,13,'3ce0e26d-d17d-4e27-8321-1e3c50526e77',0,'2026-06-23 01:10:51','2026-06-15 21:10:51'),(150,13,'ad35ab78-ab06-43a0-9368-d12f2baa41a0',1,'2026-06-23 01:10:51','2026-06-15 21:10:51'),(151,13,'09701a75-b2e5-4c40-bef1-b02e31b67d7f',0,'2026-06-23 01:19:09','2026-06-15 21:19:09'),(152,14,'d4020d59-b492-44e5-a735-6cac1d579e30',1,'2026-06-23 01:19:14','2026-06-15 21:19:14'),(153,14,'cd5a85af-5311-4659-a507-198353d210dc',0,'2026-06-23 01:19:57','2026-06-15 21:19:57'),(154,1,'c679f1f8-2165-4684-b8d2-ca736a3d0769',1,'2026-06-23 01:20:00','2026-06-15 21:20:00'),(155,1,'5b2e9a06-1327-403c-8cc6-ddbffcc7fdcc',1,'2026-06-23 01:22:53','2026-06-15 21:22:52'),(156,1,'d65012d7-ee28-4505-8095-75970b026b3a',0,'2026-06-23 01:39:18','2026-06-15 21:39:17'),(157,1,'d0f43665-7593-4b4c-82e1-9446721cabc2',0,'2026-06-23 01:39:18','2026-06-15 21:39:17'),(158,1,'04747fd9-33e5-45af-b4fe-f7ed751353ea',0,'2026-06-23 01:39:18','2026-06-15 21:39:17'),(159,1,'d913c792-104e-4f32-aaad-2e8c48c08c11',0,'2026-06-23 01:39:18','2026-06-15 21:39:17'),(160,1,'757b8cb5-a704-4fc7-a323-dc042c5fcb2c',1,'2026-06-23 01:39:18','2026-06-15 21:39:17'),(161,1,'9d6f9c9d-69d3-49b5-ab01-f9182794e420',0,'2026-06-23 01:39:18','2026-06-15 21:39:17'),(162,1,'1266d93b-9ce9-4861-ab13-71d2989afc05',0,'2026-06-23 01:39:18','2026-06-15 21:39:18'),(163,1,'c50028fe-2f03-4367-839e-8b8768d2080c',1,'2026-06-23 01:39:18','2026-06-15 21:39:18'),(164,1,'3bc864d7-7a66-4b0c-9f9f-0e6e80e17ecc',0,'2026-06-23 01:39:18','2026-06-15 21:39:18'),(165,1,'80aaa31d-d2ec-433a-a401-bef8da934c22',0,'2026-06-23 01:39:18','2026-06-15 21:39:18'),(166,1,'9eee730f-1437-49a4-8ace-1073536ae32c',0,'2026-06-23 01:39:18','2026-06-15 21:39:18'),(167,1,'6ca14f15-b007-45fd-9f00-7e90422974ca',0,'2026-06-23 01:39:18','2026-06-15 21:39:18'),(168,1,'58ce4a37-1fd8-4255-ab1c-ab6306a108d6',0,'2026-06-23 01:44:21','2026-06-15 21:44:20'),(169,13,'83e4fae1-06c7-4d82-a7e7-38f734636cec',0,'2026-06-23 01:44:28','2026-06-15 21:44:27'),(170,14,'f278e383-ceab-415f-9da1-abb12d30949e',1,'2026-06-23 01:44:34','2026-06-15 21:44:33'),(171,14,'47df585b-1012-4f90-a98b-3bd9c3c77da6',1,'2026-06-23 02:01:22','2026-06-15 22:01:21'),(172,13,'2cfba4c0-54b9-4886-ad48-4b2a86809a88',1,'2026-06-23 02:01:57','2026-06-15 22:01:57'),(173,13,'e402fbf1-aec7-4f6f-9b6a-84e0de47eacb',0,'2026-06-23 02:11:43','2026-06-15 22:11:43'),(174,13,'d7b0c121-82a6-43ff-a1c8-8d7ed9000680',1,'2026-06-23 02:11:43','2026-06-15 22:11:43'),(175,14,'fcdf3f7c-c12a-4f0c-8e99-46c4cd5d9174',0,'2026-06-23 02:12:28','2026-06-15 22:12:27'),(176,13,'e19731d6-a403-48f7-b7e8-ce9effe6f01f',0,'2026-06-23 02:27:41','2026-06-15 22:27:41'),(177,14,'e4710b9b-ac6c-4197-b1b3-121f427b4e09',1,'2026-06-23 02:27:53','2026-06-15 22:27:53'),(178,1,'cfd43f34-ef1e-4299-b270-638e19bbb6d5',1,'2026-06-23 21:46:43','2026-06-16 17:46:42'),(179,1,'c78d3375-ce71-49ee-a2ea-f1b388857c02',0,'2026-06-23 21:51:33','2026-06-16 17:51:32'),(180,1,'46d22d83-0b40-4e96-95aa-2ad297fee094',0,'2026-06-23 22:31:34','2026-06-16 18:31:34'),(181,1,'c2440874-7ad4-46a4-8e78-bef1fdf1ed16',0,'2026-06-23 22:32:57','2026-06-16 18:32:57'),(182,1,'b1b868b0-1f60-4e55-9c79-086ff53cae8a',1,'2026-06-23 23:10:05','2026-06-16 19:10:05'),(183,13,'4f40c3f7-6568-4b19-97de-d330918e44e9',0,'2026-06-23 23:12:07','2026-06-16 19:12:06'),(184,1,'aaa4ab59-13bc-4025-81fc-0d05d618f823',0,'2026-06-23 23:12:32','2026-06-16 19:12:32'),(185,1,'9b28406c-6aa3-4f25-be4f-3b1fc822f759',0,'2026-06-23 23:12:32','2026-06-16 19:12:32'),(186,14,'5fb53642-cd47-4356-8da9-aedc50cf1906',0,'2026-06-23 23:14:09','2026-06-16 19:14:09'),(187,14,'6e2d64b0-ea31-4c16-b655-3dd8548dfba0',0,'2026-06-23 23:20:36','2026-06-16 19:20:36'),(188,14,'559b228d-2dad-435b-bd53-9f30f7c90c4b',1,'2026-06-23 23:22:22','2026-06-16 19:22:21'),(189,13,'97a3af03-90ea-409e-85c1-4d551c533d56',1,'2026-06-23 23:24:06','2026-06-16 19:24:06'),(190,14,'d1fefb0c-4141-42c9-b74a-8fa3cafa8c3a',1,'2026-06-23 23:24:47','2026-06-16 19:24:47'),(191,14,'38627de2-7373-4531-ad28-15b9c4431fcb',1,'2026-06-23 23:31:52','2026-06-16 19:31:52'),(192,13,'a323533b-07f7-443a-a337-12f0fc81b12a',1,'2026-06-23 23:32:10','2026-06-16 19:32:09'),(193,14,'0a8d7302-0e53-4657-b5f7-d84c5f6884d4',1,'2026-06-23 23:36:34','2026-06-16 19:36:34'),(194,14,'140bd2d5-3008-4b89-91e2-718769f0afbe',1,'2026-06-23 23:37:46','2026-06-16 19:37:46'),(195,13,'59be9cee-d1af-40a9-8d81-56568026522b',1,'2026-06-23 23:37:54','2026-06-16 19:37:53'),(196,1,'41ec2782-6591-491e-87e9-686a3992e31b',0,'2026-06-23 23:38:20','2026-06-16 19:38:20'),(197,14,'6930448c-7aa5-431d-8367-fadcc3f7c504',1,'2026-06-23 23:39:17','2026-06-16 19:39:17'),(198,13,'42b06305-f496-45f9-a9d3-015a0d1c5930',1,'2026-06-23 23:39:51','2026-06-16 19:39:51'),(199,13,'b091d8c8-1418-41e3-89ec-4fd2cddc4457',0,'2026-06-23 23:45:31','2026-06-16 19:45:30'),(200,14,'f2f34f80-fbc3-4fdd-b471-469439dd9757',1,'2026-06-23 23:45:39','2026-06-16 19:45:39'),(201,13,'d3b09915-b516-46eb-bed6-ff2ad444a84e',1,'2026-06-24 00:12:59','2026-06-16 20:12:58'),(202,14,'090afcb1-ceac-499e-b698-3f5624b07004',0,'2026-06-24 00:13:06','2026-06-16 20:13:06'),(203,14,'d4e49f9b-3487-4c61-9611-2772580d5fef',1,'2026-06-24 00:13:06','2026-06-16 20:13:06'),(204,14,'5075b434-c4ea-4823-ad52-4032499dff0b',1,'2026-06-24 00:13:25','2026-06-16 20:13:24'),(205,13,'5b39c9f9-8c59-48fe-8004-dd71c293a1b4',1,'2026-06-24 00:15:50','2026-06-16 20:15:50'),(206,14,'a17e03f9-eb10-445b-91c8-ec5b8b786efd',1,'2026-06-24 00:15:59','2026-06-16 20:15:58'),(207,13,'0788b421-0866-4dfa-92f6-8e015d0cb72b',0,'2026-06-24 00:16:56','2026-06-16 20:16:56'),(208,14,'5e5be44d-d98a-47b5-8f11-8f433495ad31',0,'2026-06-24 00:20:31','2026-06-16 20:20:31'),(209,13,'1c69f33c-de75-4db8-8fc5-bea03781be2f',0,'2026-06-24 00:20:56','2026-06-16 20:20:56'),(210,1,'2b89a0c8-acc6-4c0a-9080-dad775b7e08b',0,'2026-06-24 00:36:14','2026-06-16 20:36:14'),(211,13,'e7d3d554-10f3-48d4-aa1b-cfb082966c54',0,'2026-06-24 00:37:34','2026-06-16 20:37:33'),(212,14,'89b6d461-2218-4d18-9251-502bc43a8f38',0,'2026-06-24 00:41:44','2026-06-16 20:41:43'),(213,13,'7bfb5d1a-e076-4ecf-ac4e-27724d38899a',1,'2026-06-24 00:48:48','2026-06-16 20:48:48'),(214,14,'f754d8fa-fc61-4434-a382-81612cd1f932',1,'2026-06-24 00:49:07','2026-06-16 20:49:07'),(215,14,'07ed3769-5cac-486b-a979-4c5e7228fab5',0,'2026-06-24 00:50:00','2026-06-16 20:49:59'),(216,1,'7c9c8ccd-5b6c-4347-ac11-736d3f567786',0,'2026-06-24 00:59:53','2026-06-16 20:59:53'),(217,18,'94df567c-f400-499c-84cb-a8099fa61f4b',0,'2026-06-24 01:01:40','2026-06-16 21:01:39'),(218,13,'44c89dd7-94a4-4c41-a631-f46ad127ac9d',1,'2026-06-24 02:45:48','2026-06-16 22:45:47'),(219,18,'09efa77e-96a3-448f-a8ca-cb03b03efbf1',0,'2026-06-24 02:46:07','2026-06-16 22:46:07'),(220,18,'95879461-f983-4891-ada8-88ab5b6e739b',0,'2026-06-24 02:57:27','2026-06-16 22:57:27'),(221,13,'4ea7f873-9214-4a61-8638-203b5839444c',1,'2026-06-24 03:01:32','2026-06-16 23:01:31'),(222,13,'4f3d2f9d-c5cf-44f0-887f-b47b206227e2',0,'2026-06-24 03:01:44','2026-06-16 23:01:43'),(223,1,'99c81849-b8dc-4783-ba95-5d27381c0574',1,'2026-06-24 03:01:52','2026-06-16 23:01:52'),(224,13,'51ec7e59-a536-40d8-a931-5ca1d865a1a3',0,'2026-06-24 03:04:19','2026-06-16 23:04:19');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` int unsigned NOT NULL,
  `permission_id` int unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1,'2026-06-10 18:11:44'),(1,2,'2026-06-10 18:11:44'),(1,3,'2026-06-10 18:11:44'),(1,4,'2026-06-10 18:11:44'),(1,5,'2026-06-10 18:11:44'),(1,6,'2026-06-10 18:11:44'),(1,7,'2026-06-10 18:11:44'),(1,8,'2026-06-10 18:11:44'),(1,9,'2026-06-10 18:11:44'),(1,10,'2026-06-10 18:11:44'),(1,11,'2026-06-10 18:11:44'),(1,12,'2026-06-10 18:11:44'),(1,13,'2026-06-10 18:11:44'),(1,14,'2026-06-10 18:11:44'),(1,15,'2026-06-10 18:11:44'),(1,16,'2026-06-10 18:11:44'),(1,17,'2026-06-10 18:11:44'),(1,22,'2026-06-10 18:11:44'),(1,23,'2026-06-10 18:11:44'),(1,24,'2026-06-10 18:11:44'),(1,25,'2026-06-10 18:11:44'),(1,26,'2026-06-12 23:57:45'),(1,27,'2026-06-12 23:57:45'),(1,28,'2026-06-12 23:57:45'),(1,29,'2026-06-12 23:57:45'),(1,30,'2026-06-13 19:57:10'),(1,31,'2026-06-13 19:57:10'),(1,32,'2026-06-13 19:57:10'),(1,33,'2026-06-13 19:57:10'),(1,34,'2026-06-14 02:20:28'),(1,35,'2026-06-14 02:20:28'),(1,36,'2026-06-14 02:20:28'),(1,37,'2026-06-14 02:20:28'),(1,38,'2026-06-14 02:20:28'),(1,39,'2026-06-14 02:20:28'),(2,1,'2026-06-14 22:48:23'),(2,2,'2026-06-14 22:48:22'),(2,3,'2026-06-14 22:48:23'),(2,4,'2026-06-14 22:48:23'),(2,5,'2026-06-14 22:48:22'),(2,6,'2026-06-14 22:48:22'),(2,7,'2026-06-14 22:48:22'),(2,8,'2026-06-14 22:48:22'),(2,9,'2026-06-14 22:48:23'),(2,10,'2026-06-14 22:48:23'),(2,11,'2026-06-14 22:48:23'),(2,12,'2026-06-14 22:48:23'),(2,13,'2026-06-14 22:48:23'),(2,14,'2026-06-14 22:48:23'),(2,15,'2026-06-14 22:48:24'),(2,16,'2026-06-14 22:48:24'),(2,17,'2026-06-14 22:48:24'),(2,24,'2026-06-14 22:48:23'),(2,25,'2026-06-14 22:48:22'),(2,26,'2026-06-14 22:48:24'),(2,27,'2026-06-14 22:48:24'),(2,28,'2026-06-14 22:48:24'),(2,29,'2026-06-14 22:48:23'),(2,30,'2026-06-14 22:48:22'),(2,31,'2026-06-14 22:48:22'),(2,32,'2026-06-14 22:48:22'),(2,33,'2026-06-14 22:48:22'),(2,34,'2026-06-14 22:48:23'),(2,35,'2026-06-14 22:48:23'),(2,36,'2026-06-14 22:48:23'),(2,37,'2026-06-14 22:48:23'),(2,38,'2026-06-14 22:48:23'),(2,39,'2026-06-14 22:48:23'),(3,1,'2026-06-14 22:46:49'),(3,5,'2026-06-14 22:46:49'),(3,9,'2026-06-14 22:46:50'),(3,10,'2026-06-14 22:46:50'),(3,11,'2026-06-14 22:46:50'),(3,13,'2026-06-14 22:46:50'),(3,14,'2026-06-14 22:46:50'),(3,15,'2026-06-14 22:46:50'),(3,25,'2026-06-14 22:46:49'),(3,26,'2026-06-14 22:46:50'),(3,31,'2026-06-14 22:46:49'),(3,32,'2026-06-14 22:46:49'),(3,33,'2026-06-14 22:46:49'),(3,34,'2026-06-14 22:46:50'),(3,37,'2026-06-14 22:46:50'),(3,38,'2026-06-14 22:46:50'),(4,9,'2026-06-14 23:48:18'),(4,13,'2026-06-14 23:48:18'),(4,15,'2026-06-14 23:48:18'),(4,16,'2026-06-14 23:48:18'),(4,17,'2026-06-14 23:48:18'),(4,28,'2026-06-14 23:48:18'),(4,29,'2026-06-14 23:48:18'),(5,5,'2026-06-14 22:41:58'),(5,13,'2026-06-14 22:41:58'),(5,15,'2026-06-14 22:41:58'),(5,25,'2026-06-14 22:41:58'),(5,31,'2026-06-14 22:41:58'),(6,30,'2026-06-14 23:05:49'),(6,31,'2026-06-14 23:05:49'),(6,32,'2026-06-14 23:05:49');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_roles_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'superadmin','Acceso total al sistema. No editable desde UI.',1,'2026-06-10 13:04:11','2026-06-10 13:04:11'),(2,'admin','Gesti├│n completa excepto configuraci├│n de sistema.',1,'2026-06-10 13:04:11','2026-06-10 13:04:11'),(3,'supervisor','Ventas, inventario, caja y reportes.',1,'2026-06-10 13:04:11','2026-06-10 13:04:11'),(4,'cashier','Registro de ventas y manejo de caja.',1,'2026-06-10 13:04:11','2026-06-10 13:04:11'),(5,'viewer','Solo lectura general.',1,'2026-06-10 13:04:11','2026-06-10 13:04:11'),(6,'custodian','Operador de custodia de objetos en eventos.',1,'2026-06-13 19:57:10','2026-06-13 19:57:10');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_items`
--

DROP TABLE IF EXISTS `sale_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale_items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `sale_id` int unsigned NOT NULL,
  `product_id` int unsigned DEFAULT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_si_sale` (`sale_id`),
  KEY `idx_si_product` (`product_id`),
  CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sale_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_items`
--

LOCK TABLES `sale_items` WRITE;
/*!40000 ALTER TABLE `sale_items` DISABLE KEYS */;
INSERT INTO `sale_items` VALUES (1,1,1,1,15.00,15.00,'2026-06-15 20:43:13'),(2,2,1,1,15.00,15.00,'2026-06-15 20:43:39'),(3,3,1,1,15.00,15.00,'2026-06-15 20:43:47'),(4,4,1,1,15.00,15.00,'2026-06-15 20:45:35'),(5,5,1,1,15.00,15.00,'2026-06-15 20:46:48'),(6,6,1,1,15.00,15.00,'2026-06-15 20:47:44'),(7,7,1,1,15.00,15.00,'2026-06-15 20:47:59'),(8,8,1,1,15.00,15.00,'2026-06-15 20:48:39'),(9,9,1,1,15.00,15.00,'2026-06-15 21:02:30'),(10,10,1,1,15.00,15.00,'2026-06-15 21:02:47'),(11,11,1,1,15.00,15.00,'2026-06-15 21:02:54'),(12,12,1,1,15.00,15.00,'2026-06-15 21:04:42'),(13,13,1,1,15.00,15.00,'2026-06-15 21:04:53'),(14,14,1,3,15.00,45.00,'2026-06-15 21:06:17'),(15,15,1,2,15.00,30.00,'2026-06-15 21:06:39'),(16,16,1,1,15.00,15.00,'2026-06-15 21:18:15'),(17,17,1,1,15.00,15.00,'2026-06-15 21:18:38'),(18,18,1,1,15.00,15.00,'2026-06-15 21:19:23'),(19,19,1,1,15.00,15.00,'2026-06-15 21:19:32'),(20,20,1,10,15.00,150.00,'2026-06-15 21:19:42'),(21,21,1,1,15.00,15.00,'2026-06-15 21:20:12'),(22,22,1,4,15.00,60.00,'2026-06-15 21:21:31'),(23,23,1,1,15.00,15.00,'2026-06-15 21:22:45'),(24,24,1,14,15.00,210.00,'2026-06-15 21:23:12'),(25,25,1,1,15.00,15.00,'2026-06-16 19:15:55'),(26,26,1,2,15.00,30.00,'2026-06-16 19:25:09'),(27,27,1,3,15.00,45.00,'2026-06-16 19:33:15'),(28,28,1,1,15.00,15.00,'2026-06-16 19:42:08'),(29,29,1,4,15.00,60.00,'2026-06-16 19:42:18'),(30,30,1,1,15.00,15.00,'2026-06-16 20:13:36'),(31,31,1,1,15.00,15.00,'2026-06-16 20:13:41'),(32,32,1,1,15.00,15.00,'2026-06-16 20:13:45'),(33,33,1,4,15.00,60.00,'2026-06-16 20:15:13'),(34,34,1,1,15.00,15.00,'2026-06-16 20:16:09'),(35,35,1,1,15.00,15.00,'2026-06-16 20:16:16'),(36,36,1,1,15.00,15.00,'2026-06-16 20:16:21'),(37,37,1,1,15.00,15.00,'2026-06-16 20:16:25'),(38,38,1,1,15.00,15.00,'2026-06-16 20:50:19');
/*!40000 ALTER TABLE `sale_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `event_id` int unsigned DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` enum('completed','voided','pending') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
  `order_status` enum('completed','pending','ready','delivered') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
  `confirmation_code` char(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prepared_by` int unsigned DEFAULT NULL,
  `ready_at` datetime DEFAULT NULL,
  `delivered_at` datetime DEFAULT NULL,
  `notes` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `voided_by` int unsigned DEFAULT NULL,
  `voided_at` datetime DEFAULT NULL,
  `void_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `voided_by` (`voided_by`),
  KEY `idx_sales_event` (`event_id`),
  KEY `idx_sales_user` (`user_id`),
  KEY `idx_sales_status` (`status`),
  KEY `idx_sales_created_at` (`created_at`),
  KEY `fk_sales_prepared_by` (`prepared_by`),
  KEY `idx_sales_order_status` (`order_status`),
  CONSTRAINT `fk_sales_prepared_by` FOREIGN KEY (`prepared_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sales_ibfk_3` FOREIGN KEY (`voided_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,NULL,13,15.00,'completed','pending',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-15 20:43:13','2026-06-15 20:43:13'),(2,NULL,13,15.00,'completed','pending',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-15 20:43:38','2026-06-15 20:43:38'),(3,NULL,13,15.00,'completed','pending',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-15 20:43:47','2026-06-15 20:43:47'),(4,NULL,14,15.00,'completed','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-15 20:45:35','2026-06-15 20:45:35'),(5,NULL,13,15.00,'completed','pending',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-15 20:46:47','2026-06-15 20:46:47'),(6,1,13,15.00,'completed','delivered','8125',14,'2026-06-15 21:23:22','2026-06-15 22:03:59',NULL,NULL,NULL,NULL,'2026-06-15 20:47:44','2026-06-15 22:03:59'),(7,1,13,15.00,'completed','delivered','9899',14,'2026-06-15 21:23:25','2026-06-15 22:12:41',NULL,NULL,NULL,NULL,'2026-06-15 20:47:59','2026-06-15 22:12:41'),(8,1,13,15.00,'completed','delivered','6698',14,'2026-06-15 21:23:28','2026-06-15 22:28:12',NULL,NULL,NULL,NULL,'2026-06-15 20:48:39','2026-06-15 22:28:12'),(9,1,1,15.00,'completed','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-15 21:02:30','2026-06-15 21:02:30'),(10,1,1,15.00,'completed','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-15 21:02:47','2026-06-15 21:02:47'),(11,1,1,15.00,'completed','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-15 21:02:54','2026-06-15 21:02:54'),(12,1,13,15.00,'completed','delivered','8669',1,'2026-06-15 21:23:59','2026-06-15 22:28:23',NULL,NULL,NULL,NULL,'2026-06-15 21:04:42','2026-06-15 22:28:23'),(13,1,13,15.00,'completed','delivered','7058',1,'2026-06-15 21:24:38','2026-06-15 22:29:09',NULL,NULL,NULL,NULL,'2026-06-15 21:04:53','2026-06-15 22:29:09'),(14,1,13,45.00,'completed','delivered','9818',1,'2026-06-15 21:24:42','2026-06-15 22:30:08',NULL,NULL,NULL,NULL,'2026-06-15 21:06:17','2026-06-15 22:30:08'),(15,1,13,30.00,'completed','delivered','9711',14,'2026-06-15 21:46:06','2026-06-16 19:14:25',NULL,NULL,NULL,NULL,'2026-06-15 21:06:39','2026-06-16 19:14:25'),(16,1,13,15.00,'completed','delivered','9014',14,'2026-06-15 21:46:59','2026-06-16 19:14:37',NULL,NULL,NULL,NULL,'2026-06-15 21:18:15','2026-06-16 19:14:37'),(17,1,13,15.00,'completed','ready','9936',14,'2026-06-15 21:47:02',NULL,NULL,NULL,NULL,NULL,'2026-06-15 21:18:38','2026-06-15 21:47:02'),(18,1,13,15.00,'completed','ready','8069',14,'2026-06-15 21:47:05',NULL,NULL,NULL,NULL,NULL,'2026-06-15 21:19:23','2026-06-15 21:47:05'),(19,1,13,15.00,'completed','ready','8171',14,'2026-06-15 21:47:12',NULL,NULL,NULL,NULL,NULL,'2026-06-15 21:19:32','2026-06-15 21:47:12'),(20,1,13,150.00,'completed','ready','2892',14,'2026-06-16 19:40:17',NULL,NULL,NULL,NULL,NULL,'2026-06-15 21:19:42','2026-06-16 19:40:17'),(21,1,13,15.00,'completed','delivered','8425',14,'2026-06-15 21:47:18','2026-06-16 19:32:48',NULL,NULL,NULL,NULL,'2026-06-15 21:20:12','2026-06-16 19:32:48'),(22,1,13,60.00,'completed','delivered','3551',14,'2026-06-15 21:46:31','2026-06-16 19:15:23',NULL,NULL,NULL,NULL,'2026-06-15 21:21:31','2026-06-16 19:15:23'),(23,1,13,15.00,'completed','delivered','2302',14,'2026-06-15 21:47:10','2026-06-16 19:32:23',NULL,NULL,NULL,NULL,'2026-06-15 21:22:45','2026-06-16 19:32:23'),(24,1,13,210.00,'completed','delivered','5935',14,'2026-06-15 21:47:07','2026-06-16 19:31:26',NULL,NULL,NULL,NULL,'2026-06-15 21:23:12','2026-06-16 19:31:26'),(25,1,13,15.00,'completed','ready','9385',14,'2026-06-16 19:40:03',NULL,NULL,NULL,NULL,NULL,'2026-06-16 19:15:55','2026-06-16 19:40:03'),(26,1,13,30.00,'completed','ready','4649',14,'2026-06-16 19:39:00',NULL,NULL,NULL,NULL,NULL,'2026-06-16 19:25:09','2026-06-16 19:39:00'),(27,1,13,45.00,'completed','ready','7025',14,'2026-06-16 19:38:47',NULL,NULL,NULL,NULL,NULL,'2026-06-16 19:33:14','2026-06-16 19:38:47'),(28,1,13,15.00,'completed','ready','2443',14,'2026-06-16 19:46:06',NULL,NULL,NULL,NULL,NULL,'2026-06-16 19:42:08','2026-06-16 19:46:06'),(29,1,13,60.00,'completed','ready','2037',14,'2026-06-16 19:53:11',NULL,NULL,NULL,NULL,NULL,'2026-06-16 19:42:18','2026-06-16 19:53:11'),(30,1,13,15.00,'completed','ready','3775',14,'2026-06-16 20:14:44',NULL,NULL,NULL,NULL,NULL,'2026-06-16 20:13:36','2026-06-16 20:14:44'),(31,1,13,15.00,'completed','ready','8017',14,'2026-06-16 20:14:31',NULL,NULL,NULL,NULL,NULL,'2026-06-16 20:13:41','2026-06-16 20:14:31'),(32,1,13,15.00,'completed','ready','8825',14,'2026-06-16 20:13:48',NULL,NULL,NULL,NULL,NULL,'2026-06-16 20:13:45','2026-06-16 20:13:48'),(33,1,13,60.00,'completed','ready','3386',14,'2026-06-16 20:15:17',NULL,NULL,NULL,NULL,NULL,'2026-06-16 20:15:13','2026-06-16 20:15:17'),(34,1,13,15.00,'completed','ready','2542',14,'2026-06-16 20:16:35',NULL,NULL,NULL,NULL,NULL,'2026-06-16 20:16:09','2026-06-16 20:16:35'),(35,1,13,15.00,'completed','delivered','5735',14,'2026-06-16 20:21:17','2026-06-16 20:49:39',NULL,NULL,NULL,NULL,'2026-06-16 20:16:16','2026-06-16 20:49:39'),(36,1,13,15.00,'completed','delivered','8674',14,'2026-06-16 20:21:07','2026-06-16 20:42:52',NULL,NULL,NULL,NULL,'2026-06-16 20:16:21','2026-06-16 20:42:52'),(37,1,13,15.00,'completed','delivered','1534',14,'2026-06-16 20:16:27','2026-06-16 20:42:06',NULL,NULL,NULL,NULL,'2026-06-16 20:16:25','2026-06-16 20:42:06'),(38,1,14,15.00,'completed','completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-16 20:50:19','2026-06-16 20:50:19');
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` int unsigned NOT NULL,
  `role_id` int unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1,'2026-06-15 21:22:31'),(13,4,'2026-06-15 20:47:28'),(14,4,'2026-06-15 20:47:21'),(15,4,'2026-06-15 21:22:18'),(16,5,'2026-06-16 17:53:04'),(17,4,'2026-06-16 18:04:18'),(18,6,'2026-06-16 21:01:05');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seller_type` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_event_id` int unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_username` (`username`),
  KEY `idx_users_seller_type` (`seller_type`),
  KEY `idx_users_assigned_event` (`assigned_event_id`),
  KEY `idx_users_deleted` (`deleted_at`),
  CONSTRAINT `fk_users_assigned_event` FOREIGN KEY (`assigned_event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@adaev.com','$2b$12$4LWekypA3z1jWeg6LUeZAOSYXopCnwI5AIVj6E80hcmebSQxf2fsK','Luis Rafael','Alberto Limachi','bartender',1,1,'2026-06-16 23:01:52','2026-06-10 18:11:34','2026-06-16 23:01:52',NULL),(13,'admin1','sdqwq@gmail.com','$2b$12$iXUZ4XpxvN9rpm7LAZcCxOsfHMp618T3mKnDNeXa9NBviAQiHKIq6','wqewqdqw','qweqweqw','waiter',1,1,'2026-06-16 23:04:19','2026-06-15 20:41:54','2026-06-16 23:04:19',NULL),(14,'admin2','sadqdqwdwq@gmail.com','$2b$12$eJMtulyIcqTtti6FjMMi0.mjwnRNl9iWM4Ub75TwWQGgeWELP5LXa','12312eqwe','qweqweqwdqqdw','bartender',1,1,'2026-06-16 20:49:59','2026-06-15 20:42:18','2026-06-16 20:49:59',NULL),(15,'admin3','wqsdqwqd@gmail.com','$2b$12$K8srshHKF0b2CbTLzpiVwuiSQrYTwpAJ1bxrHhx0jjGB/qz1LXKRu','qeqweq','wqeqweqw','bartender',1,1,NULL,'2026-06-15 21:22:18','2026-06-15 21:22:18',NULL),(16,'admin22','12e31221@gmail.com','$2b$12$Mvwd5l5ij6w2P7uyh3rc7efRkdZbr54lTpL7b0nPT4QBOFPwUxtTm','2112','21eqwqw',NULL,NULL,1,NULL,'2026-06-16 17:53:04','2026-06-16 17:53:04',NULL),(17,'admin12345','wqwqwww@gmail.com','$2b$12$sd7k7b7EhrRzGhpaKeoWMeW3AhppeNg.o3YPjfMijhVblJ5qBH/.6','zcxvb nm','cxv b',NULL,NULL,1,NULL,'2026-06-16 18:04:18','2026-06-16 18:04:18',NULL),(18,'admin4','sadasdas@gmail.com','$2b$12$KF176nguELBvmH1F1Z3ytOHwHOUjia/0C4Hj47CioncjMofy2fdiy','Jazmin','Morales',NULL,1,1,'2026-06-16 22:57:27','2026-06-16 21:01:05','2026-06-16 22:57:27',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-16 23:36:22
