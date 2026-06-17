-- =====================================================
-- Migration 010: Numeración con prefijo por evento
-- =====================================================

USE adaev;

ALTER TABLE events
  ADD COLUMN prefix VARCHAR(10) NULL AFTER name;

ALTER TABLE sales
  ADD COLUMN display_code VARCHAR(20) NULL AFTER id;

ALTER TABLE custody_items
  ADD COLUMN display_code VARCHAR(20) NULL AFTER ticket_code;

ALTER TABLE sales
  ADD INDEX idx_sales_display_code (display_code);

ALTER TABLE custody_items
  ADD INDEX idx_custody_display_code (display_code);