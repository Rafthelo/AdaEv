-- =====================================================
-- Migration 003: Inventory and sales tables
-- inventory, inventory_movements, sales, sale_items
-- =====================================================

USE adaev;

-- -----------------------------------------------------
-- Table: inventory
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  product_id  INT UNSIGNED  NOT NULL,
  event_id    INT UNSIGNED  NULL,
  quantity    INT           NOT NULL DEFAULT 0,
  min_stock   INT           NOT NULL DEFAULT 0,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_inventory_product_event (product_id, event_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (event_id)   REFERENCES events(id)   ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_inventory_product (product_id),
  INDEX idx_inventory_event (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: inventory_movements
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory_movements (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  inventory_id INT UNSIGNED NOT NULL,
  type        ENUM(
                'in',
                'out',
                'adjustment',
                'return'
              )             NOT NULL,
  quantity    INT           NOT NULL,
  reason      VARCHAR(255)  NULL,
  reference   VARCHAR(100)  NULL,
  created_by  INT UNSIGNED  NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (created_by)   REFERENCES users(id)     ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_im_inventory (inventory_id),
  INDEX idx_im_type (type),
  INDEX idx_im_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: sales
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS sales (
  id            INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  event_id      INT UNSIGNED   NULL,
  user_id       INT UNSIGNED   NULL,
  total         DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  status        ENUM(
                  'completed',
                  'voided',
                  'pending'
                )              NOT NULL DEFAULT 'completed',
  notes         VARCHAR(500)   NULL,
  voided_by     INT UNSIGNED   NULL,
  voided_at     DATETIME       NULL,
  void_reason   VARCHAR(255)   NULL,
  created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (event_id)  REFERENCES events(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (user_id)   REFERENCES users(id)  ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (voided_by) REFERENCES users(id)  ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_sales_event (event_id),
  INDEX idx_sales_user (user_id),
  INDEX idx_sales_status (status),
  INDEX idx_sales_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: sale_items
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS sale_items (
  id          INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  sale_id     INT UNSIGNED   NOT NULL,
  product_id  INT UNSIGNED   NULL,
  quantity    INT            NOT NULL,
  unit_price  DECIMAL(10,2)  NOT NULL,
  subtotal    DECIMAL(10,2)  NOT NULL,
  created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (sale_id)   REFERENCES sales(id)    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_si_sale (sale_id),
  INDEX idx_si_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;