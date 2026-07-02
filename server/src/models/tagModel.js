const { pool } = require('../config/db');

const TagModel = {
  // แสดงแท็กทั้งหมดของ user คนนั้น
  async findAllByUser(userId) {
    const [rows] = await pool.query(
      'SELECT id, user_id, name, color_hex, created_at FROM tags WHERE user_id = ? ORDER BY id ASC',
      [userId]
    );
    return rows;
  },

  async findById(id, userId) {
    const [rows] = await pool.query('SELECT * FROM tags WHERE id = ? AND user_id = ?', [
      id,
      userId,
    ]);
    return rows[0] || null;
  },

  // สร้างแท็กใหม่ให้ user คนนั้น (unique key (user_id, name) กันชื่อซ้ำในตัว)
  async create({ userId, name, colorHex }) {
    const [result] = await pool.query(
      'INSERT INTO tags (user_id, name, color_hex) VALUES (?, ?, ?)',
      [userId, name, colorHex || '#E2F0D9']
    );
    return this.findById(result.insertId, userId);
  },

  // ลบแท็ก — task ที่เคยผูกแท็กนี้จะได้ tag_id = NULL อัตโนมัติ (ON DELETE SET NULL)
  async remove(id, userId) {
    const [result] = await pool.query('DELETE FROM tags WHERE id = ? AND user_id = ?', [
      id,
      userId,
    ]);
    return result.affectedRows > 0;
  },
};

module.exports = TagModel;
