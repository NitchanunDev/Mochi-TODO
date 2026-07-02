const { pool } = require('../config/db');

// SELECT กลางที่ join กับ tags เพื่อเอาชื่อ/สีแท็กมาด้วย
// และกรอง soft-deleted (deleted_at IS NULL) ทุกจุดที่ต้องอ่านข้อมูล
const BASE_SELECT = `
  SELECT
    t.id, t.user_id, t.tag_id, t.text, t.done, t.priority, t.due_date,
    t.created_at, t.updated_at,
    tg.name AS tag_name, tg.color_hex AS tag_color
  FROM tasks t
  LEFT JOIN tags tg ON tg.id = t.tag_id
  WHERE t.deleted_at IS NULL
`;

const TaskModel = {
  // แสดงรายการงานทั้งหมดของ user คนเดียว (List Tasks)
  async findAllByUser(userId) {
    const [rows] = await pool.query(
      `${BASE_SELECT} AND t.user_id = ? ORDER BY t.created_at DESC`,
      [userId]
    );
    return rows;
  },

  // หางานตาม id เดียว (ต้องเป็นของ user คนนั้นด้วย กัน user อื่นสวมสิทธิ์แก้)
  async findById(id, userId) {
    const [rows] = await pool.query(
      `${BASE_SELECT} AND t.id = ? AND t.user_id = ?`,
      [id, userId]
    );
    return rows[0] || null;
  },

  // เพิ่มรายการงาน (Create Task)
  async create({ userId, text, tagId, priority, dueDate }) {
    const [result] = await pool.query(
      `INSERT INTO tasks (user_id, tag_id, text, done, priority, due_date)
       VALUES (?, ?, ?, FALSE, ?, ?)`,
      [userId, tagId ?? null, text, priority ?? 2, dueDate ?? null]
    );
    return this.findById(result.insertId, userId);
  },

  // แก้ไขรายการงาน (Edit Task) — แก้เฉพาะ field ที่ส่งมา
  async update(id, userId, { text, tagId, priority, dueDate }) {
    const existing = await this.findById(id, userId);
    if (!existing) return null;

    await pool.query(
      `UPDATE tasks SET
         text = ?, tag_id = ?, priority = ?, due_date = ?
       WHERE id = ? AND user_id = ?`,
      [
        text !== undefined ? text : existing.text,
        tagId !== undefined ? tagId : existing.tag_id,
        priority !== undefined ? priority : existing.priority,
        dueDate !== undefined ? dueDate : existing.due_date,
        id,
        userId,
      ]
    );
    return this.findById(id, userId);
  },

  // สลับสถานะ เสร็จ/ยังไม่เสร็จ (Complete/Incomplete)
  async toggleDone(id, userId) {
    const existing = await this.findById(id, userId);
    if (!existing) return null;

    await pool.query('UPDATE tasks SET done = NOT done WHERE id = ? AND user_id = ?', [
      id,
      userId,
    ]);
    return this.findById(id, userId);
  },

  // ลบรายการงาน (Delete Task) — soft delete แทนการลบจริง
  async remove(id, userId) {
    const [result] = await pool.query(
      'UPDATE tasks SET deleted_at = NOW() WHERE id = ? AND user_id = ? AND deleted_at IS NULL',
      [id, userId]
    );
    return result.affectedRows > 0;
  },
};

module.exports = TaskModel;
