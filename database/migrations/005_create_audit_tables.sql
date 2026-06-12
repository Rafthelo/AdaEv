-- =====================================================
-- Migration 005: Audit tables
-- audit_logs
-- =====================================================

USE adaev;

-- -----------------------------------------------------
-- Table: audit_logs
-- Inmutable — no se actualiza ni elimina
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED     NULL,
  action      VARCHAR(100)     NOT NULL,
  entity      VARCHAR(50)      NOT NULL,
  entity_id   INT UNSIGNED     NULL,
  old_values  JSON             NULL,
  new_values  JSON             NULL,
  ip_address  VARCHAR(45)      NULL,
  user_agent  VARCHAR(500)     NULL,
  metadata    JSON             NULL,
  created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_al_user (user_id),
  INDEX idx_al_entity (entity, entity_id),
  INDEX idx_al_action (action),
  INDEX idx_al_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;