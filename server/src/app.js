require('dotenv').config();
const express = require('express');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const tagRoutes = require('./routes/tagRoutes');
const attachDemoUser = require('./middleware/attachDemoUser');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

// health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Mochi API is running 🍡' });
});

// TODO: แทนที่ attachDemoUser ด้วย middleware ตรวจ JWT จริงเมื่อทำระบบ login
app.use('/api/tasks', attachDemoUser, taskRoutes);
app.use('/api/tags', attachDemoUser, tagRoutes);

// route ที่ไม่ตรงกับอะไรเลย
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'route not found' });
});

app.use(errorHandler);

module.exports = app;

