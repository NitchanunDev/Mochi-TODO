-- 1. สร้าง Database --
CREATE DATABASE IF NOT EXISTS mochi_todo
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE mochi_todo;

-- 2. ตาราง users --
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50) NOT NULL UNIQUE,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ตาราง tasks (ผูกกับ user) --
CREATE TABLE tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  text        VARCHAR(80) NOT NULL,
  urgency     ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'low',
  done        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Index --
CREATE INDEX idx_tasks_user_id ON tasks(user_id);