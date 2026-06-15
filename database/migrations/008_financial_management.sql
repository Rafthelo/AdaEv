-- =====================================================
-- Migration 008: Financial Management Module
-- Replaces cash_sessions/cash_registers with
-- a proper financial tracking system per event
-- =====================================================

USE adaev;

-- -----------------------------------------------------
-- Table: organizations
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS organizations (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name         VARCHAR(150)  NOT NULL,
  type         VARCHAR(50)   NULL,
  contact      VARCHAR(100)  NULL,
  phone        VARCHAR(30)   NULL,
  observations VARCHAR(500)  NULL,
  is_active    TINYINT(1)    NOT NULL DEFAULT 1,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_org_name (name),
  INDEX idx_org_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: financial_movements
-- Replaces cash_movements (new structure)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS financial_movements (
  id                  INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  event_id            INT UNSIGNED   NULL,
  user_id             INT UNSIGNED   NULL,
  organization_id     INT UNSIGNED   NULL,
  related_movement_id INT UNSIGNED   NULL,
  category            ENUM(
                        'external_income',
                        'contribution',
                        'expense',
                        'return'
                      )              NOT NULL,
  type                VARCHAR(50)    NOT NULL,
  amount              DECIMAL(10,2)  NOT NULL,
  description         VARCHAR(500)   NULL,
  date                DATE           NOT NULL,
  created_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (event_id)            REFERENCES events(id)               ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (user_id)             REFERENCES users(id)                ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (organization_id)     REFERENCES organizations(id)        ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (related_movement_id) REFERENCES financial_movements(id)  ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_fm_event (event_id),
  INDEX idx_fm_category (category),
  INDEX idx_fm_type (type),
  INDEX idx_fm_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;