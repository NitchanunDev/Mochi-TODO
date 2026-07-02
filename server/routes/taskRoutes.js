// server/routes/taskRoutes.js
import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from '../controllers/taskController.js'

const router = express.Router()

// ทุก route ในไฟล์นี้ต้องผ่าน verifyToken ก่อนเสมอ
router.use(verifyToken)

router.get('/', getTasks)
router.post('/', createTask)
router.put('/:id', updateTask)
router.patch('/:id/toggle', toggleTask)
router.delete('/:id', deleteTask)

export default router