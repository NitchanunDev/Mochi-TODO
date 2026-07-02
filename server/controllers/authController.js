// server/controllers/authController.js
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // 1. เช็คว่าส่งข้อมูลมาครบไหม
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'กรุณากรอก username, email และ password ให้ครบ' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'password ต้องมีอย่างน้อย 6 ตัวอักษร' })
    }

    // 2. เช็คว่ามี username หรือ email นี้อยู่แล้วหรือยัง
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    )
    if (existing.length > 0) {
      return res.status(409).json({ message: 'username หรือ email นี้ถูกใช้ไปแล้ว' })
    }

    // 3. เข้ารหัส password ก่อนเก็บ (ห้ามเก็บ password ตรงๆ เด็ดขาด)
    const passwordHash = await bcrypt.hash(password, 10)

    // 4. บันทึกลง database
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    )

    res.status(201).json({
      message: 'สมัครสมาชิกสำเร็จ',
      user: { id: result.insertId, username, email }
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดฝั่ง server' })
  }
}

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body

    // 1. เช็คว่าส่งข้อมูลมาครบไหม
    if (!identifier || !password) {
      return res.status(400).json({ message: 'กรุณากรอก username/email และ password' })
    }

    // 2. หา user จาก username หรือ email อย่างใดอย่างหนึ่ง
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [identifier, identifier]
    )

    if (users.length === 0) {
      return res.status(401).json({ message: 'username/email หรือ password ไม่ถูกต้อง' })
    }

    const user = users[0]

    // 3. เทียบ password ที่กรอกมา กับ hash ที่เก็บไว้
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return res.status(401).json({ message: 'username/email หรือ password ไม่ถูกต้อง' })
    }

    // 4. สร้าง JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    // 5. ส่ง token กลับไปให้ client
    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดฝั่ง server' })
  }
}