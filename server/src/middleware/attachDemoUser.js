// ยังไม่มีระบบ login จริง — ไฟล์นี้ mock req.userId = 1 (ตรงกับ seed data ใน schema.sql)
// เมื่อทำระบบ auth จริง (เช่น JWT) ให้แทนที่ middleware นี้ด้วยตัวที่ decode token
// แล้วเซ็ต req.userId จาก payload แทน

function attachDemoUser(req, res, next) {
  req.userId = 1;
  next();
}

module.exports = attachDemoUser;
