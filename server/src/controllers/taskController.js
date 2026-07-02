const TaskModel = require('../models/taskModel');

const TaskController = {
  // GET /api/tasks
  async list(req, res, next) {
    try {
      const tasks = await TaskModel.findAllByUser(req.userId);
      res.json({ success: true, data: tasks });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/tasks
  async create(req, res, next) {
    try {
      const { text, tagId, priority, dueDate } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({ success: false, message: 'text is required' });
      }
      if (priority !== undefined && ![1, 2, 3].includes(Number(priority))) {
        return res.status(400).json({ success: false, message: 'priority must be 1, 2, or 3' });
      }

      const task = await TaskModel.create({
        userId: req.userId,
        text: text.trim(),
        tagId: tagId ?? null,
        priority: priority ?? 2,
        dueDate: dueDate ?? null,
      });
      res.status(201).json({ success: true, data: task });
    } catch (err) {
      // FK ชี้ไป tag_id ที่ไม่มีอยู่จริง (หรือไม่ใช่ของ user คนนี้)
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ success: false, message: 'invalid tagId' });
      }
      next(err);
    }
  },

  // PUT /api/tasks/:id
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { text, tagId, priority, dueDate } = req.body;

      if (text !== undefined && !text.trim()) {
        return res.status(400).json({ success: false, message: 'text cannot be empty' });
      }
      if (priority !== undefined && ![1, 2, 3].includes(Number(priority))) {
        return res.status(400).json({ success: false, message: 'priority must be 1, 2, or 3' });
      }

      const task = await TaskModel.update(id, req.userId, {
        text: text !== undefined ? text.trim() : undefined,
        tagId,
        priority,
        dueDate,
      });

      if (!task) {
        return res.status(404).json({ success: false, message: 'task not found' });
      }
      res.json({ success: true, data: task });
    } catch (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ success: false, message: 'invalid tagId' });
      }
      next(err);
    }
  },

  // PATCH /api/tasks/:id/toggle
  async toggle(req, res, next) {
    try {
      const { id } = req.params;
      const task = await TaskModel.toggleDone(id, req.userId);

      if (!task) {
        return res.status(404).json({ success: false, message: 'task not found' });
      }
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/tasks/:id  (soft delete)
  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await TaskModel.remove(id, req.userId);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'task not found' });
      }
      res.json({ success: true, message: 'task deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = TaskController;
