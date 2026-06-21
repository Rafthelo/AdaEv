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

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `action` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int unsigned DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_al_user` (`user_id`),
  KEY `idx_al_entity` (`entity`,`entity_id`),
  KEY `idx_al_action` (`action`),
  KEY `idx_al_created_at` (`created_at`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
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
  `type` enum('open','close','in','out','adjustment') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `status` enum('open','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `opened_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `closed_at` datetime DEFAULT NULL,
  `notes` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `ticket_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_id` int unsigned DEFAULT NULL,
  `operator_id` int unsigned DEFAULT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `observations` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `photo_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','returned','lost') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
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
  KEY `idx_custody_display_code` (`display_code`),
  CONSTRAINT `custody_items_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `custody_items_ibfk_2` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `custody_items_ibfk_3` FOREIGN KEY (`returned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `custody_items`
--

LOCK TABLES `custody_items` WRITE;
/*!40000 ALTER TABLE `custody_items` DISABLE KEYS */;
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
-- Table structure for table `event_summaries`
--

DROP TABLE IF EXISTS `event_summaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_summaries` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `event_id` int unsigned NOT NULL,
  `sales_count` int unsigned NOT NULL DEFAULT '0',
  `sales_revenue` decimal(10,2) NOT NULL DEFAULT '0.00',
  `custody_received` int unsigned NOT NULL DEFAULT '0',
  `custody_returned` int unsigned NOT NULL DEFAULT '0',
  `custody_lost` int unsigned NOT NULL DEFAULT '0',
  `custody_revenue` decimal(10,2) NOT NULL DEFAULT '0.00',
  `seminar_participants` int unsigned NOT NULL DEFAULT '0',
  `seminar_revenue` decimal(10,2) NOT NULL DEFAULT '0.00',
  `external_income` decimal(10,2) NOT NULL DEFAULT '0.00',
  `contributions` decimal(10,2) NOT NULL DEFAULT '0.00',
  `expenses` decimal(10,2) NOT NULL DEFAULT '0.00',
  `returns` decimal(10,2) NOT NULL DEFAULT '0.00',
  `operative_result` decimal(10,2) NOT NULL DEFAULT '0.00',
  `net_result` decimal(10,2) NOT NULL DEFAULT '0.00',
  `participants_count` int unsigned NOT NULL DEFAULT '0',
  `voids_count` int unsigned NOT NULL DEFAULT '0',
  `inventory_adjustments` int unsigned NOT NULL DEFAULT '0',
  `top_products` json DEFAULT NULL,
  `opened_at` datetime DEFAULT NULL,
  `closed_at` datetime DEFAULT NULL,
  `generated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `generated_by` int unsigned DEFAULT NULL,
  `summary_version` int unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_event_summary` (`event_id`),
  KEY `generated_by` (`generated_by`),
  CONSTRAINT `event_summaries_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `event_summaries_ibfk_2` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_summaries`
--

LOCK TABLES `event_summaries` WRITE;
/*!40000 ALTER TABLE `event_summaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_summaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `prefix` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `starts_at` datetime NOT NULL,
  `ends_at` datetime DEFAULT NULL,
  `status` enum('draft','active','paused','closed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
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
  `category` enum('external_income','contribution','expense','return') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financial_movements`
--

LOCK TABLES `financial_movements` WRITE;
/*!40000 ALTER TABLE `financial_movements` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
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
  `type` enum('in','out','adjustment','return') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_im_inventory` (`inventory_id`),
  KEY `idx_im_type` (`type`),
  KEY `idx_im_created_at` (`created_at`),
  CONSTRAINT `inventory_movements_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inventory_movements_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_movements`
--

LOCK TABLES `inventory_movements` WRITE;
/*!40000 ALTER TABLE `inventory_movements` DISABLE KEYS */;
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
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observations` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_org_name` (`name`),
  KEY `idx_org_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
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
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_permissions_code` (`code`),
  KEY `idx_permissions_module` (`module`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'events:read','events','read','Ver listado y detalle de eventos','2026-06-10 13:04:20'),(2,'events:create','events','create','Crear nuevos eventos','2026-06-10 13:04:20'),(3,'events:update','events','update','Editar eventos existentes','2026-06-10 13:04:20'),(4,'events:delete','events','delete','Eliminar o desactivar eventos','2026-06-10 13:04:20'),(5,'categories:read','categories','read','Ver categor├¡as','2026-06-10 13:04:20'),(6,'categories:create','categories','create','Crear categor├¡as','2026-06-10 13:04:20'),(7,'categories:update','categories','update','Editar categor├¡as','2026-06-10 13:04:20'),(8,'categories:delete','categories','delete','Eliminar categor├¡as','2026-06-10 13:04:20'),(9,'products:read','products','read','Ver cat├ílogo de productos','2026-06-10 13:04:20'),(10,'products:create','products','create','Agregar nuevos productos','2026-06-10 13:04:20'),(11,'products:update','products','update','Editar productos existentes','2026-06-10 13:04:20'),(12,'products:delete','products','delete','Eliminar o desactivar productos','2026-06-10 13:04:20'),(13,'inventory:read','inventory','read','Ver stock actual','2026-06-10 13:04:20'),(14,'inventory:adjust','inventory','adjust','Realizar ajustes de inventario','2026-06-10 13:04:20'),(15,'sales:read','sales','read','Ver historial de ventas','2026-06-10 13:04:20'),(16,'sales:create','sales','create','Registrar nuevas ventas','2026-06-10 13:04:20'),(17,'sales:void','sales','void','Anular ventas','2026-06-10 13:04:20'),(22,'audit:read','audit','read','Ver registros de auditor├¡a','2026-06-10 13:04:20'),(23,'users:manage','users','manage','Crear, editar y desactivar usuarios','2026-06-10 13:04:20'),(24,'roles:manage','roles','manage','Gestionar roles y asignar permisos','2026-06-10 13:04:20'),(25,'dashboard:view','dashboard','view','Acceder al panel de control','2026-06-10 13:04:20'),(26,'sales:read_all','sales','read_all','Ver todas las ventas de todos los vendedores','2026-06-12 23:57:45'),(27,'sales:void_all','sales','void_all','Anular cualquier venta','2026-06-12 23:57:45'),(28,'sales:prepare','sales','prepare','Ver cola de pedidos y marcarlos como listos','2026-06-12 23:57:45'),(29,'sales:confirm_delivery','sales','confirm_delivery','Confirmar entrega de pedido con c├│digo','2026-06-12 23:57:45'),(30,'custody:create','custody','create','Registrar objetos en custodia','2026-06-13 19:57:10'),(31,'custody:read','custody','read','Ver registros de custodia','2026-06-13 19:57:10'),(32,'custody:return','custody','return','Marcar objeto como devuelto','2026-06-13 19:57:10'),(33,'custody:manage','custody','manage','Gesti├│n completa de custodia (admin)','2026-06-13 19:57:10'),(34,'finance:read','finance','read','Ver movimientos financieros','2026-06-14 02:20:28'),(35,'finance:create','finance','create','Registrar movimientos financieros','2026-06-14 02:20:28'),(36,'finance:delete','finance','delete','Eliminar movimientos financieros','2026-06-14 02:20:28'),(37,'finance:summary','finance','summary','Ver resumen financiero del evento','2026-06-14 02:20:28'),(38,'organizations:read','finance','org_read','Ver organizaciones','2026-06-14 02:20:28'),(39,'organizations:manage','finance','org_manage','Gestionar organizaciones','2026-06-14 02:20:28'),(40,'events:summary','events','summary','Ver resumen consolidado de un evento cerrado','2026-06-17 01:27:27'),(41,'seminar:read','seminar','read','Ver temas e inscripciones de seminarios','2026-06-20 00:37:46'),(42,'seminar:create','seminar','create','Crear temas y registrar inscripciones','2026-06-20 00:37:46'),(43,'seminar:update','seminar','update','Editar inscripciones y habilitar certificados','2026-06-20 00:37:46'),(44,'seminar:delete','seminar','delete','Eliminar inscripciones','2026-06-20 00:37:46'),(45,'seminar:deliver','seminar','deliver','Registrar entrega de certificados','2026-06-20 00:37:46');
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
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sku` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
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
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL DEFAULT '0',
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_rt_token` (`token`),
  KEY `idx_rt_user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=244 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'1d175bb0-0453-4282-b3e2-968b8b39fefa',0,'2026-06-17 22:29:18','2026-06-10 18:29:18'),(2,1,'0ca5c6f2-830d-402f-a498-c474be45c257',0,'2026-06-17 22:38:36','2026-06-10 18:38:36'),(3,1,'883224a7-82ab-4d9c-b902-5b19a93d1c75',0,'2026-06-17 22:53:32','2026-06-10 18:53:32'),(4,1,'05a43522-ba91-4141-a09b-7ab8e8146cf0',0,'2026-06-18 03:16:56','2026-06-10 23:16:56'),(5,1,'bb9c9a52-0e31-49f2-a6dd-1920254a6549',0,'2026-06-18 03:56:40','2026-06-10 23:56:40'),(6,1,'f19bbf11-0735-43b3-b4be-e375090617ca',0,'2026-06-18 13:00:26','2026-06-11 09:00:26'),(7,1,'c09daa9b-43bb-4c51-8ef7-7b97aa2e840e',0,'2026-06-18 23:44:39','2026-06-11 19:44:39'),(8,1,'5e005df5-c3f9-4ed7-9889-dc5f3abde56b',1,'2026-06-19 04:51:48','2026-06-12 00:51:48'),(9,1,'3616dff8-be77-447f-941c-1828a381f442',0,'2026-06-19 05:08:07','2026-06-12 01:08:06'),(10,1,'900a3666-58ea-4cfa-966c-6de47dcfd824',0,'2026-06-19 05:08:07','2026-06-12 01:08:06'),(11,1,'4fe33bf6-ff70-4ad0-b0d4-20e437e3c752',1,'2026-06-19 16:17:32','2026-06-12 12:17:31'),(12,1,'1840b839-0e85-454e-8d37-82c1db297f4a',1,'2026-06-19 16:33:03','2026-06-12 12:33:02'),(13,1,'6fecd0a1-6cdd-4519-b162-329d9de7d797',1,'2026-06-19 21:38:21','2026-06-12 17:38:21'),(14,1,'1876b013-87c6-4eee-ba79-01cc78bdb361',0,'2026-06-19 21:56:58','2026-06-12 17:56:58'),(15,1,'3451e053-1ec8-4dbf-8ad5-27abdc4d6501',1,'2026-06-19 21:56:58','2026-06-12 17:56:58'),(16,1,'3bbb643d-14a0-47c4-876f-3a2393ccbc1f',1,'2026-06-19 22:14:01','2026-06-12 18:14:00'),(17,1,'59a42605-694d-441b-9704-fa98666a5200',0,'2026-06-19 22:29:02','2026-06-12 18:29:01'),(18,1,'3a4a9af7-6762-43b6-bd74-1851bdb267c9',0,'2026-06-19 22:29:02','2026-06-12 18:29:01'),(19,1,'c449a527-3f0a-4739-83e1-40f19f41bbd9',0,'2026-06-19 22:29:02','2026-06-12 18:29:01'),(20,1,'3e8e0818-87cf-4f4d-8072-ef4399dc95cc',1,'2026-06-19 22:29:02','2026-06-12 18:29:01'),(21,1,'eedf228d-1cd4-4381-bbda-6c0819fd1d68',0,'2026-06-19 22:46:22','2026-06-12 18:46:21'),(22,1,'18f318b1-c906-4f93-828d-8533b13cdaa7',0,'2026-06-19 22:46:22','2026-06-12 18:46:21'),(23,1,'59941c78-716f-40e1-a34d-996747c4c5be',0,'2026-06-19 22:46:22','2026-06-12 18:46:21'),(24,1,'6e8b2070-cac3-4ab7-9838-b7ad2ff99292',0,'2026-06-19 22:46:22','2026-06-12 18:46:21'),(25,1,'09e39f5b-cf23-4d3c-927a-e337fa766ecf',0,'2026-06-19 22:46:22','2026-06-12 18:46:21'),(26,1,'0f8bc087-35a5-4b8d-968d-218f283ac580',0,'2026-06-19 22:46:22','2026-06-12 18:46:21'),(27,1,'e359a97e-4ed1-4f55-881a-b2a68ca71be5',1,'2026-06-20 00:06:11','2026-06-12 20:06:11'),(28,1,'13bb1e37-522b-4fa3-9939-0bd1e428db9a',1,'2026-06-20 00:09:40','2026-06-12 20:09:40'),(30,1,'a7e5a0d5-77fc-45c4-8838-a41df560b505',1,'2026-06-20 00:11:32','2026-06-12 20:11:32'),(33,1,'2bec21f6-590a-4af6-99f2-3502c7792f0c',1,'2026-06-20 00:44:50','2026-06-12 20:44:50'),(36,1,'e3119911-376d-4428-b4d8-0e0140bb9271',1,'2026-06-20 00:48:42','2026-06-12 20:48:41'),(42,1,'938df519-d51c-4faa-b11e-3a8db5e6f32a',1,'2026-06-20 02:59:03','2026-06-12 22:59:03'),(44,1,'1288af52-db4f-43c9-bc7c-3d9f6bdb2caa',1,'2026-06-20 14:00:32','2026-06-13 10:00:31'),(46,1,'1cea2da0-d813-4586-9126-311b850abd1d',1,'2026-06-20 14:02:13','2026-06-13 10:02:12'),(48,1,'2208cdc2-7029-4849-8348-ebe1204706d1',1,'2026-06-20 14:20:43','2026-06-13 10:20:42'),(52,1,'071d28d3-c7cd-4067-9cc8-abbc1b8788dc',1,'2026-06-20 15:10:45','2026-06-13 11:10:44'),(54,1,'db72e25b-c594-47fb-8ee1-242fa6dac207',1,'2026-06-20 15:12:49','2026-06-13 11:12:48'),(70,1,'b109258f-ba39-434d-b433-5f4cc1c71da9',1,'2026-06-20 19:39:33','2026-06-13 15:39:32'),(72,1,'10f70450-7e9a-4bc5-b6d3-e5dd0d18d834',1,'2026-06-20 19:50:59','2026-06-13 15:50:59'),(74,1,'cf6b5a47-f1e2-4309-8de6-8ea0d34b01a7',1,'2026-06-20 19:56:38','2026-06-13 15:56:37'),(76,1,'74e6090b-3417-4cfe-a9a6-642b69bdf471',1,'2026-06-21 00:15:39','2026-06-13 20:15:38'),(77,1,'35a66036-bd3b-4ce2-933f-991e010a8ff5',0,'2026-06-21 00:59:57','2026-06-13 20:59:56'),(78,1,'df3fe174-3d8f-4a34-abae-3a231ff8c279',0,'2026-06-21 00:59:57','2026-06-13 20:59:56'),(79,1,'3c74f727-1877-47d1-9116-1861f236e465',1,'2026-06-21 04:37:08','2026-06-14 00:37:07'),(80,1,'ad3bc079-715c-4a53-b33d-1e69e05ac77f',0,'2026-06-21 04:52:20','2026-06-14 00:52:20'),(81,1,'1508f46d-2642-4c2f-b4ad-11482cbc2e1a',0,'2026-06-21 05:51:31','2026-06-14 01:51:30'),(82,1,'24b57b09-3611-41d4-9598-8c1b222800fd',0,'2026-06-21 16:19:33','2026-06-14 12:19:33'),(83,1,'4d2ce57c-d413-40fe-b24d-a904226a676e',0,'2026-06-21 21:01:40','2026-06-14 17:01:40'),(84,1,'26c1c2e2-deef-4de1-96c1-10d4388985e0',1,'2026-06-21 21:24:36','2026-06-14 17:24:36'),(85,1,'12460955-da5d-4a2a-a40a-c77773af19f9',0,'2026-06-21 21:35:56','2026-06-14 17:35:55'),(86,1,'66b4a6f8-77bd-47db-a0bd-935d361f681b',1,'2026-06-21 21:42:05','2026-06-14 17:42:05'),(87,1,'24f72954-1fe1-4871-8265-58359ca2e1ad',0,'2026-06-21 21:54:00','2026-06-14 17:53:59'),(88,1,'4aff159e-fedd-4527-8304-eba25104dc97',1,'2026-06-22 01:57:28','2026-06-14 21:57:28'),(89,1,'1df5f3ad-5e34-451d-b60b-ad48393103b3',1,'2026-06-22 02:02:54','2026-06-14 22:02:54'),(90,1,'34d67858-c85f-4b53-9fd9-c67dac42f643',0,'2026-06-22 02:18:11','2026-06-14 22:18:10'),(91,1,'e43d7e72-a99a-4c25-9eb0-4bf83a18d469',0,'2026-06-22 02:18:11','2026-06-14 22:18:10'),(92,1,'b7b2acb0-b66a-4a8f-9326-79adff7fc1b8',0,'2026-06-22 02:18:11','2026-06-14 22:18:10'),(93,1,'80387b2f-f4bf-45a0-ac4f-cf38b4093a80',1,'2026-06-22 02:18:11','2026-06-14 22:18:11'),(94,1,'63a0499d-6d10-41b8-a2eb-d245875b3a14',1,'2026-06-22 02:33:41','2026-06-14 22:33:40'),(95,1,'fd393c16-0c78-4e14-98b2-ca070cb93d51',0,'2026-06-22 02:39:40','2026-06-14 22:39:40'),(96,1,'bef681d3-ae1d-4c88-82d8-302095753189',1,'2026-06-22 02:39:47','2026-06-14 22:39:47'),(97,1,'a54cb978-f65e-474f-a5c4-4d8f1bd596f9',1,'2026-06-22 02:54:51','2026-06-14 22:54:51'),(102,1,'17dd7631-caac-44b6-a6ee-079251bcf074',1,'2026-06-22 03:02:48','2026-06-14 23:02:47'),(104,1,'9ee561f1-f1f2-45ef-9a17-109f17b57a73',1,'2026-06-22 03:05:17','2026-06-14 23:05:17'),(108,1,'a28f0154-e327-4307-b004-06e2ca02e405',1,'2026-06-22 03:37:58','2026-06-14 23:37:57'),(110,1,'63f31660-03d1-4354-b9d8-1cb344962080',1,'2026-06-22 03:40:12','2026-06-14 23:40:11'),(112,1,'e6c5bbf4-c867-453f-921f-a4bbfa27d466',1,'2026-06-22 03:42:06','2026-06-14 23:42:05'),(114,1,'af180572-8c12-4b45-8b0f-d95acab144b1',1,'2026-06-22 03:43:03','2026-06-14 23:43:02'),(116,1,'42085d6c-7e6c-4a48-a1f5-3c3de4204cef',1,'2026-06-22 03:44:45','2026-06-14 23:44:44'),(118,1,'ce6aa547-6c9f-424b-9204-3a2819e54276',1,'2026-06-22 03:45:55','2026-06-14 23:45:54'),(120,1,'0ece0219-5295-45c4-ba98-debc85136415',1,'2026-06-22 03:46:47','2026-06-14 23:46:46'),(121,1,'a925bbee-886c-4e2a-8ac2-edef8d3686c9',1,'2026-06-22 03:47:25','2026-06-14 23:47:25'),(123,1,'6ac34cff-7ca6-4862-a7d6-8aefdea6f8af',1,'2026-06-22 03:48:06','2026-06-14 23:48:05'),(128,1,'c0dd1e2c-b689-497a-94b9-ca104a6b99e3',1,'2026-06-22 03:55:25','2026-06-14 23:55:25'),(130,1,'5b4e7179-53f1-46b4-a919-f7afb98f02a6',1,'2026-06-22 03:58:30','2026-06-14 23:58:30'),(132,1,'5279ddeb-0cb7-47a6-aeae-bc2393f05859',1,'2026-06-22 07:26:22','2026-06-15 03:26:21'),(133,1,'edabe025-76ff-45f4-a834-58d6943a432b',0,'2026-06-22 07:28:09','2026-06-15 03:28:09'),(134,1,'5264daf4-2f82-4b8b-8960-6f8fab4610ad',0,'2026-06-22 07:35:41','2026-06-15 03:35:40'),(135,1,'94af4d85-65c8-4aa8-8327-fb41b8ee012d',0,'2026-06-22 15:18:10','2026-06-15 11:18:10'),(136,1,'c65fab7a-c6db-4dbe-b2fa-e0ecf7a25d2a',1,'2026-06-23 00:40:26','2026-06-15 20:40:25'),(139,1,'9da86bea-f231-447b-90ef-99a1478a07b9',0,'2026-06-23 00:44:11','2026-06-15 20:44:10'),(142,1,'3a39b101-259d-40fd-bcb0-a8fa7e11ef58',1,'2026-06-23 00:53:31','2026-06-15 20:53:30'),(143,1,'ace7baba-d75e-4e9e-8883-6def7f5964e9',1,'2026-06-23 01:02:14','2026-06-15 21:02:13'),(144,1,'88201cbd-19dd-490e-bae1-e4fb5875ef57',1,'2026-06-23 01:02:30','2026-06-15 21:02:30'),(154,1,'c679f1f8-2165-4684-b8d2-ca736a3d0769',1,'2026-06-23 01:20:00','2026-06-15 21:20:00'),(155,1,'5b2e9a06-1327-403c-8cc6-ddbffcc7fdcc',1,'2026-06-23 01:22:53','2026-06-15 21:22:52'),(156,1,'d65012d7-ee28-4505-8095-75970b026b3a',0,'2026-06-23 01:39:18','2026-06-15 21:39:17'),(157,1,'d0f43665-7593-4b4c-82e1-9446721cabc2',0,'2026-06-23 01:39:18','2026-06-15 21:39:17'),(158,1,'04747fd9-33e5-45af-b4fe-f7ed751353ea',0,'2026-06-23 01:39:18','2026-06-15 21:39:17'),(159,1,'d913c792-104e-4f32-aaad-2e8c48c08c11',0,'2026-06-23 01:39:18','2026-06-15 21:39:17'),(160,1,'757b8cb5-a704-4fc7-a323-dc042c5fcb2c',1,'2026-06-23 01:39:18','2026-06-15 21:39:17'),(161,1,'9d6f9c9d-69d3-49b5-ab01-f9182794e420',0,'2026-06-23 01:39:18','2026-06-15 21:39:17'),(162,1,'1266d93b-9ce9-4861-ab13-71d2989afc05',0,'2026-06-23 01:39:18','2026-06-15 21:39:18'),(163,1,'c50028fe-2f03-4367-839e-8b8768d2080c',1,'2026-06-23 01:39:18','2026-06-15 21:39:18'),(164,1,'3bc864d7-7a66-4b0c-9f9f-0e6e80e17ecc',0,'2026-06-23 01:39:18','2026-06-15 21:39:18'),(165,1,'80aaa31d-d2ec-433a-a401-bef8da934c22',0,'2026-06-23 01:39:18','2026-06-15 21:39:18'),(166,1,'9eee730f-1437-49a4-8ace-1073536ae32c',0,'2026-06-23 01:39:18','2026-06-15 21:39:18'),(167,1,'6ca14f15-b007-45fd-9f00-7e90422974ca',0,'2026-06-23 01:39:18','2026-06-15 21:39:18'),(168,1,'58ce4a37-1fd8-4255-ab1c-ab6306a108d6',0,'2026-06-23 01:44:21','2026-06-15 21:44:20'),(178,1,'cfd43f34-ef1e-4299-b270-638e19bbb6d5',1,'2026-06-23 21:46:43','2026-06-16 17:46:42'),(179,1,'c78d3375-ce71-49ee-a2ea-f1b388857c02',0,'2026-06-23 21:51:33','2026-06-16 17:51:32'),(180,1,'46d22d83-0b40-4e96-95aa-2ad297fee094',0,'2026-06-23 22:31:34','2026-06-16 18:31:34'),(181,1,'c2440874-7ad4-46a4-8e78-bef1fdf1ed16',0,'2026-06-23 22:32:57','2026-06-16 18:32:57'),(182,1,'b1b868b0-1f60-4e55-9c79-086ff53cae8a',1,'2026-06-23 23:10:05','2026-06-16 19:10:05'),(184,1,'aaa4ab59-13bc-4025-81fc-0d05d618f823',0,'2026-06-23 23:12:32','2026-06-16 19:12:32'),(185,1,'9b28406c-6aa3-4f25-be4f-3b1fc822f759',0,'2026-06-23 23:12:32','2026-06-16 19:12:32'),(196,1,'41ec2782-6591-491e-87e9-686a3992e31b',0,'2026-06-23 23:38:20','2026-06-16 19:38:20'),(210,1,'2b89a0c8-acc6-4c0a-9080-dad775b7e08b',0,'2026-06-24 00:36:14','2026-06-16 20:36:14'),(216,1,'7c9c8ccd-5b6c-4347-ac11-736d3f567786',0,'2026-06-24 00:59:53','2026-06-16 20:59:53'),(223,1,'99c81849-b8dc-4783-ba95-5d27381c0574',1,'2026-06-24 03:01:52','2026-06-16 23:01:52'),(225,1,'7ec867a8-7be2-42ea-a863-fb9f9aa2e59b',0,'2026-06-24 04:23:35','2026-06-17 00:23:35'),(226,1,'864edc42-024c-4ea2-9058-e0debe629740',0,'2026-06-24 04:57:53','2026-06-17 00:57:52'),(227,1,'35570651-f82f-431d-8e68-a350de353d66',0,'2026-06-24 06:01:42','2026-06-17 02:01:41'),(228,1,'a454ebc9-2770-423d-9664-befd3fa31c5d',0,'2026-06-24 06:40:31','2026-06-17 02:40:30'),(229,1,'82c52537-b87c-453e-b2b5-73eb257916b4',0,'2026-06-24 07:02:04','2026-06-17 03:02:04'),(230,1,'5794012a-ae68-4f6f-b44e-bdcb8f97212b',0,'2026-06-24 07:22:30','2026-06-17 03:22:30'),(231,1,'534950c3-9eb2-444c-a4ab-8b796dbf9e5e',1,'2026-06-26 05:01:34','2026-06-19 01:01:34'),(232,1,'f8af947d-7295-4396-b381-8c21d53f7454',1,'2026-06-26 05:18:51','2026-06-19 01:18:51'),(233,1,'46d62f85-7489-4d2f-9913-019a5d51a167',0,'2026-06-26 05:23:31','2026-06-19 01:23:31'),(234,1,'f56a5464-f256-4928-bb2d-d93f93eb1c3d',1,'2026-06-26 14:57:36','2026-06-19 10:57:35'),(235,1,'476e8328-565d-4836-ab72-8ad543ee0901',1,'2026-06-26 15:34:33','2026-06-19 11:34:32'),(236,1,'9e0f9fa5-3afb-450d-919d-e9b723af7d5e',0,'2026-06-26 15:42:48','2026-06-19 11:42:48'),(237,1,'e6e664d9-deeb-4005-8c94-26ea940a6b71',0,'2026-06-26 16:12:24','2026-06-19 12:12:24'),(238,1,'278c6f4d-a787-4f98-97f0-fea95f0c8713',1,'2026-06-27 13:42:24','2026-06-20 09:42:24'),(239,1,'d5ec8479-ba06-4720-a87b-cd4b7f73589e',0,'2026-06-27 13:56:48','2026-06-20 09:56:47'),(240,1,'388c2492-6212-4ad1-a849-8c48b3c9b9f5',1,'2026-06-27 18:16:01','2026-06-20 14:16:00'),(241,1,'b7e881bc-0ada-41d0-b59e-daabe5bf2931',1,'2026-06-27 18:51:40','2026-06-20 14:51:39'),(242,1,'6f75d2b6-1955-49dc-b396-4d9a5e21323b',0,'2026-06-27 19:12:20','2026-06-20 15:12:19'),(243,1,'6892cc68-63b1-472d-9875-fb69c1636865',0,'2026-06-28 00:24:28','2026-06-20 20:24:27');
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
INSERT INTO `role_permissions` VALUES (1,1,'2026-06-10 18:11:44'),(1,2,'2026-06-10 18:11:44'),(1,3,'2026-06-10 18:11:44'),(1,4,'2026-06-10 18:11:44'),(1,5,'2026-06-10 18:11:44'),(1,6,'2026-06-10 18:11:44'),(1,7,'2026-06-10 18:11:44'),(1,8,'2026-06-10 18:11:44'),(1,9,'2026-06-10 18:11:44'),(1,10,'2026-06-10 18:11:44'),(1,11,'2026-06-10 18:11:44'),(1,12,'2026-06-10 18:11:44'),(1,13,'2026-06-10 18:11:44'),(1,14,'2026-06-10 18:11:44'),(1,15,'2026-06-10 18:11:44'),(1,16,'2026-06-10 18:11:44'),(1,17,'2026-06-10 18:11:44'),(1,22,'2026-06-10 18:11:44'),(1,23,'2026-06-10 18:11:44'),(1,24,'2026-06-10 18:11:44'),(1,25,'2026-06-10 18:11:44'),(1,26,'2026-06-12 23:57:45'),(1,27,'2026-06-12 23:57:45'),(1,28,'2026-06-12 23:57:45'),(1,29,'2026-06-12 23:57:45'),(1,30,'2026-06-13 19:57:10'),(1,31,'2026-06-13 19:57:10'),(1,32,'2026-06-13 19:57:10'),(1,33,'2026-06-13 19:57:10'),(1,34,'2026-06-14 02:20:28'),(1,35,'2026-06-14 02:20:28'),(1,36,'2026-06-14 02:20:28'),(1,37,'2026-06-14 02:20:28'),(1,38,'2026-06-14 02:20:28'),(1,39,'2026-06-14 02:20:28'),(1,40,'2026-06-17 01:27:28'),(1,41,'2026-06-20 00:37:46'),(1,42,'2026-06-20 00:37:46'),(1,43,'2026-06-20 00:37:46'),(1,44,'2026-06-20 00:37:46'),(1,45,'2026-06-20 00:37:46'),(2,1,'2026-06-14 22:48:23'),(2,2,'2026-06-14 22:48:22'),(2,3,'2026-06-14 22:48:23'),(2,4,'2026-06-14 22:48:23'),(2,5,'2026-06-14 22:48:22'),(2,6,'2026-06-14 22:48:22'),(2,7,'2026-06-14 22:48:22'),(2,8,'2026-06-14 22:48:22'),(2,9,'2026-06-14 22:48:23'),(2,10,'2026-06-14 22:48:23'),(2,11,'2026-06-14 22:48:23'),(2,12,'2026-06-14 22:48:23'),(2,13,'2026-06-14 22:48:23'),(2,14,'2026-06-14 22:48:23'),(2,15,'2026-06-14 22:48:24'),(2,16,'2026-06-14 22:48:24'),(2,17,'2026-06-14 22:48:24'),(2,24,'2026-06-14 22:48:23'),(2,25,'2026-06-14 22:48:22'),(2,26,'2026-06-14 22:48:24'),(2,27,'2026-06-14 22:48:24'),(2,28,'2026-06-14 22:48:24'),(2,29,'2026-06-14 22:48:23'),(2,30,'2026-06-14 22:48:22'),(2,31,'2026-06-14 22:48:22'),(2,32,'2026-06-14 22:48:22'),(2,33,'2026-06-14 22:48:22'),(2,34,'2026-06-14 22:48:23'),(2,35,'2026-06-14 22:48:23'),(2,36,'2026-06-14 22:48:23'),(2,37,'2026-06-14 22:48:23'),(2,38,'2026-06-14 22:48:23'),(2,39,'2026-06-14 22:48:23'),(2,40,'2026-06-17 01:27:28'),(2,41,'2026-06-20 00:37:46'),(2,42,'2026-06-20 00:37:46'),(2,43,'2026-06-20 00:37:46'),(2,44,'2026-06-20 00:37:46'),(2,45,'2026-06-20 00:37:46'),(3,1,'2026-06-14 22:46:49'),(3,5,'2026-06-14 22:46:49'),(3,9,'2026-06-14 22:46:50'),(3,10,'2026-06-14 22:46:50'),(3,11,'2026-06-14 22:46:50'),(3,13,'2026-06-14 22:46:50'),(3,14,'2026-06-14 22:46:50'),(3,15,'2026-06-14 22:46:50'),(3,25,'2026-06-14 22:46:49'),(3,26,'2026-06-14 22:46:50'),(3,31,'2026-06-14 22:46:49'),(3,32,'2026-06-14 22:46:49'),(3,33,'2026-06-14 22:46:49'),(3,34,'2026-06-14 22:46:50'),(3,37,'2026-06-14 22:46:50'),(3,38,'2026-06-14 22:46:50'),(3,40,'2026-06-17 01:27:28'),(3,41,'2026-06-20 00:37:46'),(3,45,'2026-06-20 00:37:46'),(4,9,'2026-06-14 23:48:18'),(4,13,'2026-06-14 23:48:18'),(4,15,'2026-06-14 23:48:18'),(4,16,'2026-06-14 23:48:18'),(4,17,'2026-06-14 23:48:18'),(4,28,'2026-06-14 23:48:18'),(4,29,'2026-06-14 23:48:18'),(5,5,'2026-06-14 22:41:58'),(5,13,'2026-06-14 22:41:58'),(5,15,'2026-06-14 22:41:58'),(5,25,'2026-06-14 22:41:58'),(5,31,'2026-06-14 22:41:58'),(6,30,'2026-06-14 23:05:49'),(6,31,'2026-06-14 23:05:49'),(6,32,'2026-06-14 23:05:49');
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
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_items`
--

LOCK TABLES `sale_items` WRITE;
/*!40000 ALTER TABLE `sale_items` DISABLE KEYS */;
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
  `display_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_id` int unsigned DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` enum('completed','voided','pending') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
  `order_status` enum('completed','pending','ready','delivered') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
  `confirmation_code` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prepared_by` int unsigned DEFAULT NULL,
  `ready_at` datetime DEFAULT NULL,
  `delivered_at` datetime DEFAULT NULL,
  `notes` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `voided_by` int unsigned DEFAULT NULL,
  `voided_at` datetime DEFAULT NULL,
  `void_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  KEY `idx_sales_display_code` (`display_code`),
  CONSTRAINT `fk_sales_prepared_by` FOREIGN KEY (`prepared_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sales_ibfk_3` FOREIGN KEY (`voided_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seminar_enrollments`
--

DROP TABLE IF EXISTS `seminar_enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seminar_enrollments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `topic_id` int unsigned NOT NULL,
  `ru_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `career` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount_paid` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` enum('registered','delivered') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'registered',
  `delivered_at` datetime DEFAULT NULL,
  `delivered_by` int unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_topic_ru` (`topic_id`,`ru_code`),
  KEY `delivered_by` (`delivered_by`),
  KEY `idx_enroll_ru` (`ru_code`),
  KEY `idx_enroll_status` (`status`),
  CONSTRAINT `seminar_enrollments_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `seminar_topics` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `seminar_enrollments_ibfk_2` FOREIGN KEY (`delivered_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seminar_enrollments`
--

LOCK TABLES `seminar_enrollments` WRITE;
/*!40000 ALTER TABLE `seminar_enrollments` DISABLE KEYS */;
/*!40000 ALTER TABLE `seminar_enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seminar_topics`
--

DROP TABLE IF EXISTS `seminar_topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seminar_topics` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `event_id` int unsigned NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `certificates_available` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` int unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_topics_event` (`event_id`),
  CONSTRAINT `seminar_topics_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `seminar_topics_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seminar_topics`
--

LOCK TABLES `seminar_topics` WRITE;
/*!40000 ALTER TABLE `seminar_topics` DISABLE KEYS */;
/*!40000 ALTER TABLE `seminar_topics` ENABLE KEYS */;
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
INSERT INTO `user_roles` VALUES (1,1,'2026-06-17 00:25:05');
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
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `seller_type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
INSERT INTO `users` VALUES (1,'admin','admin@adaev.com','$2b$12$4LWekypA3z1jWeg6LUeZAOSYXopCnwI5AIVj6E80hcmebSQxf2fsK','Luis Rafael','Alberto Limachi',NULL,NULL,1,'2026-06-20 20:24:28','2026-06-10 18:11:34','2026-06-20 20:24:28',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-20 20:54:16
