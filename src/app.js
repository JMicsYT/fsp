const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/user'); //  <--  Импортируем маршруты для Users
const applicationRoutes = require('./routes/applications'); 
const teamRoutes = require('./routes/teams'); //  Новая строка
const authRoutes = require('./routes/auth');

app.use('/events', eventRoutes);
app.use('/user', userRoutes); //  <--  Подключаем маршруты для Users
app.use('/applications', applicationRoutes); //  Новая строка
app.use('/teams', teamRoutes);
app.use('/auth', authRoutes);

//  ... другие маршруты (позже)

module.exports = app;