const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagController');

router.get('/', TagController.list);      // แสดงแท็กทั้งหมดของ user
router.post('/', TagController.create);   // สร้างแท็กใหม่
router.delete('/:id', TagController.remove); // ลบแท็ก

module.exports = router;
