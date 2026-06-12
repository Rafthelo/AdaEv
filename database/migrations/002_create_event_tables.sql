-- =====================================================
-- Migration 002: Event and product tables
-- categories, products, events, event_products
-- =====================================================

USE adaev;

-- -----------------------------------------------------
-- Table: categories
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  description VARCHAR(255)  NULL,
  parent_id   INT UNSIGNED  NULL,
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_categories_parent (parent_id),
  INDEX idx_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: products
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id          INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  name        VARCHAR(150)   NOT NULL,
  description VARCHAR(500)   NULL,
  sku         VARCHAR(100)   NULL UNIQUE,
  price       DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  category_id INT UNSIGNED   NULL,
  is_active   TINYINT(1)     NOT NULL DEFAULT 1,
  created_by  INT UNSIGNED   NULL,
  created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (created_by)  REFERENCES users(id)      ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_products_name (name),
  INDEX idx_products_sku (sku),
  INDEX idx_products_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: events
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name        VARCHAR(150)  NOT NULL,
  description VARCHAR(500)  NULL,
  location    VARCHAR(255)  NULL,
  starts_at   DATETIME      NOT NULL,
  ends_at     DATETIME      NULL,
  status      ENUM(
                'draft',
                'active',
                'paused',
                'closed',
                'cancelled'
              )              NOT NULL DEFAULT 'draft',
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  created_by  INT UNSIGNED  NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_events_status (status),
  INDEX idx_events_starts_at (starts_at),
  INDEX idx_events_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: event_products
-- Productos disponibles en cada evento con precio override
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS event_products (
  id          INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  event_id    INT UNSIGNED   NOT NULL,
  product_id  INT UNSIGNED   NOT NULL,
  price       DECIMAL(10,2)  NULL,
  is_active   TINYINT(1)     NOT NULL DEFAULT 1,
  created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_event_product (event_id, product_id),
  FOREIGN KEY (event_id)   REFERENCES events(id)   ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_ep_event (event_id),
  INDEX idx_ep_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;