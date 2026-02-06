require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes');
const orgRoutes = require('./routes/org.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');



const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));


app.use('/api/auth', authRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);



app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});



module.exports = app;
