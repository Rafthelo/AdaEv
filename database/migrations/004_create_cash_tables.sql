-- =====================================================
-- Migration 004: Cash register tables
-- cash_registers, cash_sessions, cash_movements
-- =====================================================

USE adaev;

-- -----------------------------------------------------
-- Table: cash_registers
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS cash_registers (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  description VARCHAR(255)  NULL,
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_cash_registers_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: cash_sessions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS cash_sessions (
  id                INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  cash_register_id  INT UNSIGNED   NOT NULL,
  event_id          INT UNSIGNED   NULL,
  opened_by         INT UNSIGNED   NULL,
  closed_by         INT UNSIGNED   NULL,
  opening_amount    DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  closing_amount    DECIMAL(10,2)  NULL,
  expected_amount   DECIMAL(10,2)  NULL,
  difference        DECIMAL(10,2)  NULL,
  status            ENUM(
                      'open',
                      'closed'
                    )              NOT NULL DEFAULT 'open',
  opened_at         DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at         DATETIME       NULL,
  notes             VARCHAR(500)   NULL,
  created_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (cash_register_id) REFERENCES cash_registers(id) ON DELETE CASCADE  ON UPDATE CASCADE,
  FOREIGN KEY (event_id)         REFERENCES events(id)         ON DELETE SET NULL  ON UPDATE CASCADE,
  FOREIGN KEY (opened_by)        REFERENCES users(id)          ON DELETE SET NULL  ON UPDATE CASCADE,
  FOREIGN KEY (closed_by)        REFERENCES users(id)          ON DELETE SET NULL  ON UPDATE CASCADE,
  INDEX idx_cs_register (cash_register_id),
  INDEX idx_cs_event (event_id),
  INDEX idx_cs_status (status),
  INDEX idx_cs_opened_at (opened_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: cash_movements
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS cash_movements (
  id              INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  cash_session_id INT UNSIGNED   NOT NULL,
  type            ENUM(
                    'open',
                    'close',
                    'in',
                    'out',
                    'adjustment'
                  )              NOT NULL,
  amount          DECIMAL(10,2)  NOT NULL,
  reason          VARCHAR(255)   NULL,
  created_by      INT UNSIGNED   NULL,
  created_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (cash_session_id) REFERENCES cash_sessions(id) ON DELETE CASCADE  ON UPDATE CASCADE,
  FOREIGN KEY (created_by)      REFERENCES users(id)         ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_cm_session (cash_session_id),
  INDEX idx_cm_type (type),
  INDEX idx_cm_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;