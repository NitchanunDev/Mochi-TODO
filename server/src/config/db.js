require('dotenv').config();
const mysql = require('mysql2/promise');

// Connection pool — ใช้ pool แทนการเปิด connection ใหม่ทุกครั้ง
// เพื่อประสิทธิภาพที่ดีกว่าและจัดการ connection ให้อัตโนมัติ
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mochi_todo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

// ทดสอบการเชื่อมต่อตอนเริ่มเซิร์ฟเวอร์
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
