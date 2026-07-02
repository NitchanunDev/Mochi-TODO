import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// ทดสอบ route ง่ายๆ ก่อน
app.get('/', (req, res) => {
  res.send('Server ทำงานแล้วจ้า')
})

// Auth routes
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})