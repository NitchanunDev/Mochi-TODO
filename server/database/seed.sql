INSERT INTO users (username, email, password_hash) VALUES
  ('mochi_user', 'mochi@example.com', '$2b$10$examplehashedpasswordvalue');

INSERT INTO tasks (user_id, text, urgency, done) VALUES
  (1, 'Sip warm hōjicha tea', 'low', TRUE),
  (1, 'Water the tiny succulents', 'medium', FALSE),
  (1, 'Write in the gratitude journal', 'high', FALSE);