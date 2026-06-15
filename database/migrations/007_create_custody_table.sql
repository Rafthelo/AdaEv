-- =====================================================
-- Migration 007: Custody module
-- custody_items
-- =====================================================

USE adaev;

CREATE TABLE IF NOT EXISTS custody_items (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  ticket_code  VARCHAR(100)  NOT NULL,
  event_id     INT UNSIGNED  NULL,
  operator_id  INT UNSIGNED  NULL,
  description  VARCHAR(500)  NOT NULL,
  observations VARCHAR(500)  NULL,
  photo_url    VARCHAR(255)  NULL,
  status       ENUM(
                 'active',
                 'returned',
                 'lost'
               )             NOT NULL DEFAULT 'active',
  received_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  returned_at  DATETIME      NULL,
  returned_by  INT UNSIGNED  NULL,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (event_id)   REFERENCES events(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (operator_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (returned_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_custody_ticket (ticket_code),
  INDEX idx_custody_event (event_id),
  INDEX idx_custody_status (status),
  INDEX idx_custody_received (received_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;