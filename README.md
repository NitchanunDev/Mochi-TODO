# Mochi To-Do List

แอปพลิเคชันจัดการรายการงาน (To-Do List) ธีม "Mochi" พัฒนาด้วย Vue 3 (Vite) ฝั่ง Frontend และ Node.js (Express) + MySQL ฝั่ง Backend รองรับระบบสมาชิกหลายผู้ใช้ (Multi-user) พร้อมจัดระดับความเร่งด่วนของงาน (Urgency) และแดชบอร์ดสรุปภาพรวม

---

## สารบัญ

1. [Tech Stack](#tech-stack)
2. [ฟีเจอร์หลัก](#ฟีเจอร์หลัก)
3. [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
4. [ข้อกำหนดเบื้องต้น](#ข้อกำหนดเบื้องต้น-prerequisites)
5. [ขั้นตอนการติดตั้ง](#ขั้นตอนการติดตั้ง-installation)
6. [การตั้งค่า Environment Variables](#การตั้งค่า-environment-variables)
7. [การตั้งค่าฐานข้อมูล](#การตั้งค่าฐานข้อมูล)
8. [วิธีรันโปรเจกต์](#วิธีรันโปรเจกต์)
9. [API Endpoints](#api-endpoints)
10. [ปัญหาที่พบบ่อยและวิธีแก้ไข](#ปัญหาที่พบบ่อยและวิธีแก้ไข-troubleshooting)

---

## Tech Stack

| ส่วน | เทคโนโลยีที่ใช้ |
|---|---|
| Frontend | Vue 3 (Composition API), Vite, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Database | MySQL / MariaDB |
| Authentication | JWT (jsonwebtoken), bcrypt |
| Dev Tools | nodemon, dotenv |

---

## ฟีเจอร์หลัก

- ระบบสมัครสมาชิกและเข้าสู่ระบบ (Register / Login) รองรับ login ด้วย username หรือ email
- เข้ารหัสรหัสผ่านด้วย bcrypt และยืนยันตัวตนด้วย JWT (อายุ token 7 วัน)
- เพิ่ม / แก้ไข / ลบ / ทำเครื่องหมายเสร็จสิ้น รายการงาน (CRUD ครบถ้วน)
- จัดระดับความเร่งด่วนของงาน 3 ระดับ: **High / Medium / Low**
- มุมมองแดชบอร์ด (All) แสดงงานแบ่งเป็น 3 คอลัมน์ตามความเร่งด่วน
- ตัวกรองงาน: **All / Un-complete / Complete** พร้อมตัวกรองย่อยตามความเร่งด่วน
- ข้อมูลของแต่ละผู้ใช้แยกจากกันโดยสมบูรณ์ (ผูกกับ `user_id`)

---

## โครงสร้างโปรเจกต์

```
Mochi-TODO/
├── client/                     # Frontend (Vue + Vite + Tailwind)
│   ├── src/
│   │   ├── api/                # ฟังก์ชันเรียก API (http.js, auth.js, tasks.js)
│   │   ├── components/         # Vue components (AuthScreen, TaskCard, TaskBoard)
│   │   ├── composables/        # State management (useAuth.js, useTasks.js)
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                     # Backend (Node.js + Express + MySQL)
    ├── config/
    │   └── db.js                # การเชื่อมต่อฐานข้อมูล
    ├── controllers/
    │   ├── authController.js    # Logic register/login
    │   └── taskController.js    # Logic CRUD tasks
    ├── middleware/
    │   └── authMiddleware.js    # ตรวจสอบ JWT token
    ├── routes/
    │   ├── authRoutes.js
    │   └── taskRoutes.js
    ├── database/
    │   ├── schema.sql           # โครงสร้างฐานข้อมูล
    │   └── seed.sql             # ข้อมูลตัวอย่าง
    ├── .env                     # ค่าตั้งค่าลับ (ไม่ commit ขึ้น Git)
    ├── index.js                 # จุดเริ่มต้นของ server
    └── package.json
```

---

## ข้อกำหนดเบื้องต้น (Prerequisites)

ก่อนติดตั้งโปรเจกต์ ต้องมีโปรแกรมต่อไปนี้ในเครื่องก่อน:

| โปรแกรม | เวอร์ชันแนะนำ | ตรวจสอบด้วยคำสั่ง |
|---|---|---|
| Node.js | 18.x ขึ้นไป | `node -v` |
| npm | มาพร้อม Node.js | `npm -v` |
| MySQL หรือ MariaDB | 8.x / 10.4 ขึ้นไป | `mysql --version` |

> หากใช้ **XAMPP** สามารถใช้ MySQL/MariaDB ที่มากับ XAMPP ได้เลย โดยต้องเปิด XAMPP Control Panel แล้วกด **Start** ที่ service MySQL ก่อนเริ่มใช้งานเสมอ

---

## ขั้นตอนการติดตั้ง (Installation)

### 1. ติดตั้ง Dependencies ฝั่ง Server

```bash
cd server
npm install
```

### 2. ติดตั้ง Dependencies ฝั่ง Client

```bash
cd client
npm install
```

> ไม่ต้องติดตั้งไลบรารีเรียก API เพิ่มเติม (เช่น axios) เนื่องจากใช้ `fetch` มาตรฐานของเบราว์เซอร์อยู่แล้ว

---

## การตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ `server/` (ไฟล์นี้ **ห้าม commit ขึ้น Git**) โดยมีเนื้อหาดังนี้:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mochi_todo
DB_PORT=3306

# Server
PORT=3000

# JWT
JWT_SECRET=<ค่าสุ่มความยาวอย่างน้อย 32 ตัวอักษร>
JWT_EXPIRES_IN=7d
```

### วิธีสร้างค่า `JWT_SECRET` ที่ปลอดภัย

รันคำสั่งนี้ในเทอร์มินัลเพื่อสุ่มค่าที่ปลอดภัย แล้วนำผลลัพธ์ไปวางแทนค่าตัวอย่างด้านบน:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

| ตัวแปร | คำอธิบาย |
|---|---|
| `DB_HOST` | ที่อยู่ของฐานข้อมูล (ปกติคือ `localhost`) |
| `DB_USER` | ชื่อผู้ใช้ MySQL (ค่าเริ่มต้นของ XAMPP คือ `root`) |
| `DB_PASSWORD` | รหัสผ่าน MySQL (XAMPP เริ่มต้นไม่มีรหัสผ่าน เว้นว่างไว้) |
| `DB_NAME` | ชื่อฐานข้อมูลที่ใช้ |
| `DB_PORT` | พอร์ตของ MySQL (ค่าเริ่มต้นคือ `3306`) |
| `PORT` | พอร์ตที่ Express server จะรัน |
| `JWT_SECRET` | กุญแจลับสำหรับเซ็นรับรอง JWT token ห้ามเปิดเผย |
| `JWT_EXPIRES_IN` | อายุการใช้งานของ token ก่อนต้องเข้าสู่ระบบใหม่ |

---

## การตั้งค่าฐานข้อมูล

### 1. เปิดใช้งาน MySQL/MariaDB

ตรวจสอบให้แน่ใจว่า service ของฐานข้อมูลเปิดทำงานอยู่ (ผ่าน XAMPP Control Panel หรือคำสั่งของระบบปฏิบัติการ)

### 2. รันสคริปต์สร้างฐานข้อมูล

จากโฟลเดอร์ `server/database/` รันคำสั่งต่อไปนี้:

```bash
mysql -u root < schema.sql
mysql -u root mochi_todo < seed.sql
```

> คำสั่งข้างต้นจะสร้างฐานข้อมูล `mochi_todo` ตาราง `users` และ `tasks` พร้อมข้อมูลตัวอย่างให้อัตโนมัติ

### 3. ตรวจสอบผลลัพธ์ (ไม่บังคับ)

```bash
mysql -u root
```
```sql
USE mochi_todo;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM tasks;
```

---

## วิธีรันโปรเจกต์

ต้องรันทั้ง **Server** และ **Client** พร้อมกัน โดยเปิดเทอร์มินัลแยกกัน 2 หน้าต่าง

### เทอร์มินัลที่ 1 — รัน Backend

```bash
cd server
npm run dev
```

เมื่อรันสำเร็จจะแสดงข้อความ:
```
✅ Server running on http://localhost:3000
```

### เทอร์มินัลที่ 2 — รัน Frontend

```bash
cd client
npm run dev
```

เมื่อรันสำเร็จ Vite จะแสดง URL ให้เปิดใช้งาน (ค่าเริ่มต้นคือ `http://localhost:5173`)

### เข้าใช้งาน

เปิดเบราว์เซอร์ไปที่:
```
http://localhost:5173
```

สมัครสมาชิกใหม่ผ่านหน้า **Register** แล้วเข้าสู่ระบบเพื่อเริ่มใช้งาน

---

## API Endpoints

Base URL: `http://localhost:3000/api`

### Authentication

| Method | Endpoint | คำอธิบาย | ต้องใช้ Token |
|---|---|---|---|
| POST | `/auth/register` | สมัครสมาชิกใหม่ | ไม่ต้อง |
| POST | `/auth/login` | เข้าสู่ระบบ (login ด้วย username หรือ email) | ไม่ต้อง |

### Tasks

| Method | Endpoint | คำอธิบาย | ต้องใช้ Token |
|---|---|---|---|
| GET | `/tasks` | ดึงรายการงานทั้งหมดของผู้ใช้ที่ล็อกอินอยู่ | ต้องใช้ |
| POST | `/tasks` | สร้างงานใหม่ | ต้องใช้ |
| PUT | `/tasks/:id` | แก้ไขข้อความ/ความเร่งด่วนของงาน | ต้องใช้ |
| PATCH | `/tasks/:id/toggle` | สลับสถานะเสร็จสิ้น/ยังไม่เสร็จ | ต้องใช้ |
| DELETE | `/tasks/:id` | ลบงาน | ต้องใช้ |

> Endpoint ที่ต้องใช้ Token ต้องแนบ header `Authorization: Bearer <token>` ที่ได้จากการ login

---

## ปัญหาที่พบบ่อยและวิธีแก้ไข (Troubleshooting)

| อาการ | สาเหตุที่เป็นไปได้ | วิธีแก้ |
|---|---|---|
| `ERR_CONNECTION_REFUSED` เมื่อเรียก API | ยังไม่ได้รัน server ฝั่ง Backend | เปิดเทอร์มินัลแยก รัน `cd server && npm run dev` |
| `401 Unauthorized` ตอน login | username/email หรือ password ไม่ถูกต้อง หรือยังไม่เคย register | สมัครสมาชิกผ่านหน้า Register ก่อน |
| Tailwind class ไม่ทำงาน หน้าตาเพี้ยน | ใช้ Tailwind เวอร์ชัน 4 ซึ่งวิธีตั้งค่าต่างจาก v3 | ตรวจสอบว่าใช้ `@tailwindcss/vite` ใน `vite.config.js` และ `@import "tailwindcss";` ใน `style.css` (ไม่ใช้ `tailwind.config.js`/`postcss.config.js` แบบเดิม) |
| `mysql` ไม่รู้จักคำสั่งใน terminal | ยังไม่ได้เพิ่ม path ของ MySQL (เช่นจาก XAMPP) เข้า Environment Variables | เพิ่ม path เช่น `C:\xampp\mysql\bin` เข้า System PATH แล้วเปิดเทอร์มินัลใหม่ |
| `curl` error ใน PowerShell | PowerShell มี `curl` เป็น alias ของ `Invoke-WebRequest` ซึ่งใช้ syntax ต่างจาก curl จริง | ใช้ `curl.exe` แทน หรือใช้ `Invoke-RestMethod` แบบ PowerShell |
| แก้ไขงานแล้วปิดโหมดแก้ไขเองทันที | ปุ่มที่กำลังโฟกัสอยู่ถูกลบออกจาก DOM เมื่อสลับโหมด ทำให้เกิด focus event ที่ตีความผิดเป็นการคลิกออกนอกกล่อง | ใช้ปุ่มยืนยัน (✓) หรือกด Enter เพื่อบันทึกแทนการอาศัย auto-save ตอนคลิกออกนอกกล่อง |

---

## หมายเหตุด้านความปลอดภัย

- ไฟล์ `.env` ต้องอยู่ใน `.gitignore` เสมอ ห้าม commit ค่าลับขึ้น repository สาธารณะ
- รหัสผ่านผู้ใช้ถูกเข้ารหัสด้วย bcrypt ก่อนบันทึกลงฐานข้อมูลทุกครั้ง ไม่มีการเก็บรหัสผ่านแบบข้อความธรรมดา
- ทุก endpoint ของ tasks ตรวจสอบว่า `user_id` ตรงกับเจ้าของข้อมูลก่อนอนุญาตให้แก้ไขหรือลบเสมอ ป้องกันผู้ใช้คนหนึ่งเข้าถึงข้อมูลของอีกคนหนึ่ง
