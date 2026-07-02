-- Mochi To-Do — schema v2
-- ลำดับการรัน: database -> users -> tags -> tasks -> indexes
-- (ต้องเรียงแบบนี้เพราะ MySQL ต้องมีตารางปลายทางของ Foreign Key อยู่ก่อน)

CREATE DATABASE IF NOT EXISTS mochi_todo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mochi_todo;

-- ลบตารางเก่าถ้ามี (เรียงจากลูกไปหาแม่ เพื่อไม่ชน FK)
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS users;

-- ============ users ============
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============ tags ============
CREATE TABLE tags (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  name       VARCHAR(50) NOT NULL,
  color_hex  VARCHAR(7) NOT NULL DEFAULT '#E2F0D9',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_tags_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,

  UNIQUE KEY uq_tags_user_name (user_id, name)
) ENGINE=InnoDB;

-- ============ tasks ============
CREATE TABLE tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  tag_id      INT NULL,
  text        VARCHAR(255) NOT NULL,
  done        BOOLEAN NOT NULL DEFAULT FALSE,
  priority    TINYINT NOT NULL DEFAULT 2,   -- 1=low 2=medium 3=high
  due_date    DATE NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMP NULL,               -- soft delete: NULL = ยังไม่ลบ

  CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_tasks_tag
    FOREIGN KEY (tag_id) REFERENCES tags(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============ indexes ============
-- query ที่ใช้บ่อยที่สุด: "task ของ user คนนี้ ที่ done = false"
CREATE INDEX idx_tasks_user_done ON tasks (user_id, done);
CREATE INDEX idx_tasks_user_tag  ON tasks (user_id, tag_id);

-- ============ seed data (ตัวอย่าง 1 user เดียว ไว้ทดสอบ) ============
INSERT INTO users (name, email, password_hash) VALUES
  ('Mochi Demo', 'demo@mochi.app', '$2b$10$replace_with_real_bcrypt_hash');

INSERT INTO tags (user_id, name, color_hex) VALUES
  (1, 'matcha',   '#E2F0D9'),
  (1, 'sakura',   '#FCE4E6'),
  (1, 'lavender', '#E8DAEF');

INSERT INTO tasks (user_id, tag_id, text, done, priority) VALUES
  (1, 1, 'Sip warm hōjicha tea', TRUE, 1),
  (1, 2, 'Water the tiny succulents', FALSE, 2),
  (1, 3, 'Write in the gratitude journal', FALSE, 2);
