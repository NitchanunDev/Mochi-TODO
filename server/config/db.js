// server/config/db.js
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true, // สำคัญ: ให้คอลัมน์ DATE/DATETIME ส่งกลับเป็น string "YYYY-MM-DD" ธรรมดา
                      // แทนที่จะเป็น JS Date object ซึ่งพอแปลงเป็น JSON จะกลายเป็น ISO timestamp
                      // ยาวๆ ("2026-07-05T00:00:00.000Z") ทำให้ <input type="date"> อ่านค่าไม่ได้
})

export default pool