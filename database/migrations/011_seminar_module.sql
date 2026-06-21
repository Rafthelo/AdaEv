-- =====================================================
-- Migration 011: Módulo de Seminarios/Temas
-- =====================================================

USE adaev;

CREATE TABLE IF NOT EXISTS seminar_topics (
  id                      INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  event_id                INT UNSIGNED  NOT NULL,
  name                    VARCHAR(150)  NOT NULL,
  certificates_available  TINYINT(1)    NOT NULL DEFAULT 0,
  created_by              INT UNSIGNED  NULL,
  created_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (event_id)   REFERENCES events(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)  ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_topics_event (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS seminar_enrollments (
  id            INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  topic_id      INT UNSIGNED   NOT NULL,
  ru_code       VARCHAR(50)    NOT NULL,
  full_name     VARCHAR(150)   NOT NULL,
  career        VARCHAR(150)   NULL,
  amount_paid   DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  status        ENUM('registered', 'delivered') NOT NULL DEFAULT 'registered',
  delivered_at  DATETIME       NULL,
  delivered_by  INT UNSIGNED   NULL,
  created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_topic_ru (topic_id, ru_code),
  FOREIGN KEY (topic_id)      REFERENCES seminar_topics(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (delivered_by)  REFERENCES users(id)          ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_enroll_ru (ru_code),
  INDEX idx_enroll_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;