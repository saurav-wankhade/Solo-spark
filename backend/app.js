const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quests', require('./routes/questRoutes'));
app.use('/api/reflections', require('./routes/reflectionRoutes')); 
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/points', require('./routes/pointsRoutes'));
app.use('/api/rewards', require('./routes/rewardRoutes'));
app.use('/api/user', require('./routes/userRoutes'));



module.exports = app;
