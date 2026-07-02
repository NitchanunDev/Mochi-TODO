import pool from './config/db.js'

async function testConnection() {
  try {
    console.log('กำลังทดสอบเชื่อมต่อ MySQL...')
    
    const [rows] = await pool.query('SELECT 1 + 1 AS result')
    console.log('✅ เชื่อมต่อสำเร็จ! ผลลัพธ์ทดสอบ:', rows[0].result)

    const [users] = await pool.query('SELECT * FROM users')
    console.log('✅ ดึงข้อมูล users สำเร็จ จำนวน:', users.length, 'คน')
    console.log(users)

    const [tasks] = await pool.query('SELECT * FROM tasks')
    console.log('✅ ดึงข้อมูล tasks สำเร็จ จำนวน:', tasks.length, 'รายการ')
    console.log(tasks)

    process.exit(0)
  } catch (err) {
    console.error('❌ เชื่อมต่อไม่สำเร็จ:', err.message)
    process.exit(1)
  }
}

testConnection()