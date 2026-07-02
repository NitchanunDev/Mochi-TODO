import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  // 1. ดึง token จาก header "Authorization: Bearer xxxxx"
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'ไม่พบ token กรุณา login ก่อน' })
  }

  const token = authHeader.split(' ')[1] // ตัดคำว่า "Bearer " ออก เหลือแค่ตัว token

  try {
    // 2. ตรวจสอบว่า token ถูกต้องและยังไม่หมดอายุไหม
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 3. แนบข้อมูล user ที่ถอดได้จาก token ไว้ใน req เพื่อให้ route ถัดไปเอาไปใช้ได้
    req.user = decoded // จะมี { id, username } ตามที่ตอน login ใส่ไว้

    next() // ผ่านด่านแล้ว ไปต่อที่ route จริง
  } catch (err) {
    return res.status(401).json({ message: 'token ไม่ถูกต้องหรือหมดอายุแล้ว กรุณา login ใหม่' })
  }
}