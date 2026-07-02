//server/controllers/taskController.js
import pool from '../config/db.js'

// GET /api/tasks - ดึง task ทั้งหมดของ user ที่ login อยู่
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id
    const [tasks] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    )
    res.json(tasks)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดฝั่ง server' })
  }
}

// POST /api/tasks - สร้าง task ใหม่
export const createTask = async (req, res) => {
  try {
    const userId = req.user.id
    const { text, urgency } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'กรุณากรอกข้อความ task' })
    }
    if (text.length > 80) {
      return res.status(400).json({ message: 'ข้อความ task ต้องไม่เกิน 80 ตัวอักษร' })
    }

    const validUrgency = ['low', 'medium', 'high']
    const finalUrgency = validUrgency.includes(urgency) ? urgency : 'low'

    const [result] = await pool.query(
      'INSERT INTO tasks (user_id, text, urgency, done) VALUES (?, ?, ?, FALSE)',
      [userId, text.trim(), finalUrgency]
    )

    const [newTask] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId])

    res.status(201).json(newTask[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดฝั่ง server' })
  }
}

// PUT /api/tasks/:id - แก้ไขข้อความ/urgency ของ task
export const updateTask = async (req, res) => {
  try {
    const userId = req.user.id
    const taskId = req.params.id
    const { text, urgency } = req.body

    // เช็คก่อนว่า task นี้มีอยู่จริง และเป็นของ user คนนี้จริง
    const [existing] = await pool.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    )
    if (existing.length === 0) {
      return res.status(404).json({ message: 'ไม่พบ task นี้ หรือไม่ใช่ของคุณ' })
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'กรุณากรอกข้อความ task' })
    }

    const validUrgency = ['low', 'medium', 'high']
    const finalUrgency = validUrgency.includes(urgency) ? urgency : existing[0].urgency

    await pool.query(
      'UPDATE tasks SET text = ?, urgency = ? WHERE id = ? AND user_id = ?',
      [text.trim(), finalUrgency, taskId, userId]
    )

    const [updated] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId])
    res.json(updated[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดฝั่ง server' })
  }
}

// PATCH /api/tasks/:id/toggle - สลับสถานะ done/not done
export const toggleTask = async (req, res) => {
  try {
    const userId = req.user.id
    const taskId = req.params.id

    const [existing] = await pool.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    )
    if (existing.length === 0) {
      return res.status(404).json({ message: 'ไม่พบ task นี้ หรือไม่ใช่ของคุณ' })
    }

    const newDoneStatus = !existing[0].done

    await pool.query(
      'UPDATE tasks SET done = ? WHERE id = ? AND user_id = ?',
      [newDoneStatus, taskId, userId]
    )

    const [updated] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId])
    res.json(updated[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดฝั่ง server' })
  }
}

// DELETE /api/tasks/:id - ลบ task
export const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id
    const taskId = req.params.id

    const [existing] = await pool.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    )
    if (existing.length === 0) {
      return res.status(404).json({ message: 'ไม่พบ task นี้ หรือไม่ใช่ของคุณ' })
    }

    await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId])

    res.json({ message: 'ลบ task สำเร็จ' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดฝั่ง server' })
  }
}