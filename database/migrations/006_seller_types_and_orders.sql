-- =====================================================
-- Migration 006: Seller types and order flow
-- =====================================================

USE adaev;

-- -----------------------------------------------------
-- users: tipo de vendedor + evento asignado
-- -----------------------------------------------------
ALTER TABLE users
  ADD COLUMN seller_type       VARCHAR(30)  NULL AFTER last_name,
  ADD COLUMN assigned_event_id INT UNSIGNED NULL AFTER seller_type;

ALTER TABLE users
  ADD CONSTRAINT fk_users_assigned_event
  FOREIGN KEY (assigned_event_id) REFERENCES events(id)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE users
  ADD INDEX idx_users_seller_type (seller_type),
  ADD INDEX idx_users_assigned_event (assigned_event_id);

-- -----------------------------------------------------
-- sales: flujo de pedidos (mesero -> bartender)
-- -----------------------------------------------------
ALTER TABLE sales
  ADD COLUMN order_status ENUM('completed', 'pending', 'ready', 'delivered')
              NOT NULL DEFAULT 'completed' AFTER status,
  ADD COLUMN confirmation_code CHAR(4)     NULL AFTER order_status,
  ADD COLUMN prepared_by       INT UNSIGNED NULL AFTER confirmation_code,
  ADD COLUMN ready_at          DATETIME    NULL AFTER prepared_by,
  ADD COLUMN delivered_at      DATETIME    NULL AFTER ready_at;

ALTER TABLE sales
  ADD CONSTRAINT fk_sales_prepared_by
  FOREIGN KEY (prepared_by) REFERENCES users(id)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE sales
  ADD INDEX idx_sales_order_status (order_status);