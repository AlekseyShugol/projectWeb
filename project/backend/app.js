require('dotenv').config();
const express = require('express');
const Sequelize = require('sequelize');
const path = require('path');
const cors = require('cors'); // Импортируйте cors
const passport = require('passport');
const initPassport = require('./passport/passport');

const { swaggerUi, swaggerDocs } = require('./swagger/swagger');
const connectDB = require('./mongoDB/mongoConnection');

const PORT = process.env.PORT || 8000;
const app = express();

// Настройка CORS - добавьте это перед другими middleware
app.use(cors({
  origin: '*', // Разрешаем доступ с любого источника
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(passport.initialize());

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, 'config', 'config.json'))[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Инициализация моделей
const { initUserModel } = require('./models/User');
const { initCourseModel } = require('./models/Course');
const { initLessonModel } = require('./models/Lesson');
const { initMarkModel } = require('./models/Mark');
const { initUserCourseModel } = require('./models/UserCourse');
const { initUserRoleModel } = require('./models/UserRole');
const Log = require('./models/Log');

const User = initUserModel(sequelize);
const Course = initCourseModel(sequelize);
const Lesson = initLessonModel(sequelize);
const Mark = initMarkModel(sequelize);
const UserCourse = initUserCourseModel(sequelize);
const UserRole = initUserRoleModel(sequelize);

// Middleware для логирования
app.use(async (req, res, next) => {
  const log = new Log({
    message: `${req.method} ${req.url}`,
    level: 'info',
    requestBody: req.body,
    responseBody: null,
  });

  const originalSend = res.send.bind(res);
  let responseSent = false;

  res.send = function (body) {
    responseSent = true;
    log.responseBody = body;
    return originalSend(body);
  };

  try {
    await next();
    if (!responseSent) {
      log.responseBody = {};
    }
    await log.save();
  } catch (error) {
    console.error('Error saving log:', error.message);
    next();
  }
});

// Настройка маршрутов
const userRoutes = require('./routes/UserRoutes');
const courseRoutes = require('./routes/CourseRoutes');
const lessonRoutes = require('./routes/LessonRoutes');
const markRoutes = require('./routes/MarkRoutes');
const userCourseRoutes = require('./routes/UserCourseRoutes');
const userRoleRoutes = require('./routes/UserRoleRoutes');
const authRoutes = require('./routes/AuthRoutes');

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/user-courses', userCourseRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/swagger-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/api/logs', async (req, res) => {
  try {
    const logs = await Log.find();
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    res.status(500).json({ error: 'Failed to fetch logs', details: error.message });
  }
});

// Обработка ошибок
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  const log = new Log({ message: `Error: ${err.message}`, level: 'error' });
  await log.save();
  res.status(500).json({ error: 'Something went wrong!' });
});

// Обработка 404 ошибок
app.use(async (req, res) => {
  const log = new Log({ message: `404 Not Found: ${req.originalUrl}`, level: 'warn' });
  await log.save();
  res.status(404).json({ error: 'Not Found' });
});

// Подключение к базе данных
connectDB();

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api/swagger-docs`);

  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных успешно.');

  } catch (error) {
    console.error('Ошибка при получении данных:', error.message);
  }
});

// Инициализация Passport
initPassport(passport);