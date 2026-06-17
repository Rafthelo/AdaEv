-- =====================================================
-- Migration 009: Event Summaries (snapshot al cierre)
-- =====================================================

USE adaev;

CREATE TABLE IF NOT EXISTS event_summaries (
  id                      INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  event_id                INT UNSIGNED   NOT NULL,

  sales_count             INT UNSIGNED   NOT NULL DEFAULT 0,
  sales_revenue           DECIMAL(10,2)  NOT NULL DEFAULT 0.00,

  custody_received        INT UNSIGNED   NOT NULL DEFAULT 0,
  custody_returned        INT UNSIGNED   NOT NULL DEFAULT 0,
  custody_lost            INT UNSIGNED   NOT NULL DEFAULT 0,
  custody_revenue         DECIMAL(10,2)  NOT NULL DEFAULT 0.00,

  external_income         DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  contributions           DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  expenses                DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  returns                 DECIMAL(10,2)  NOT NULL DEFAULT 0.00,

  operative_result        DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  net_result               DECIMAL(10,2)  NOT NULL DEFAULT 0.00,

  participants_count      INT UNSIGNED   NOT NULL DEFAULT 0,
  voids_count             INT UNSIGNED   NOT NULL DEFAULT 0,
  inventory_adjustments   INT UNSIGNED   NOT NULL DEFAULT 0,

  top_products            JSON           NULL,

  opened_at               DATETIME       NULL,
  closed_at               DATETIME       NULL,

  generated_at            DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  generated_by            INT UNSIGNED   NULL,

  summary_version         INT UNSIGNED   NOT NULL DEFAULT 1,

  PRIMARY KEY (id),
  UNIQUE KEY uq_event_summary (event_id),
  FOREIGN KEY (event_id)      REFERENCES events(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (generated_by)  REFERENCES users(id)  ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;