const TagModel = require('../models/tagModel');

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

const TagController = {
  // GET /api/tags
  async list(req, res, next) {
    try {
      const tags = await TagModel.findAllByUser(req.userId);
      res.json({ success: true, data: tags });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/tags
  async create(req, res, next) {
    try {
      const { name, colorHex } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'name is required' });
      }
      if (colorHex && !HEX_COLOR.test(colorHex)) {
        return res.status(400).json({ success: false, message: 'colorHex must look like #RRGGBB' });
      }

      const tag = await TagModel.create({
        userId: req.userId,
        name: name.trim(),
        colorHex,
      });
      res.status(201).json({ success: true, data: tag });
    } catch (err) {
      // ชนกับ unique key (user_id, name)
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'tag name already exists' });
      }
      next(err);
    }
  },

  // DELETE /api/tags/:id
  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await TagModel.remove(id, req.userId);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'tag not found' });
      }
      res.json({ success: true, message: 'tag deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = TagController;
