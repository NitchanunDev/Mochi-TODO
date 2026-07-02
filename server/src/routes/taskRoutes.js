const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');

router.get('/', TaskController.list);           // แสดงรายการงาน
router.post('/', TaskController.create);        // เพิ่มรายการงาน
router.put('/:id', TaskController.update);       // แก้ไขรายการงาน
router.patch('/:id/toggle', TaskController.toggle); // เสร็จ/ยังไม่เสร็จ
router.delete('/:id', TaskController.remove);    // ลบรายการงาน

module.exports = router;
