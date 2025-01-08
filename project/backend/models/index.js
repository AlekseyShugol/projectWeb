'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const { initUserRoleModel } = require('./UserRole');
const { initUserModel } = require('./User');
const { initUserCourseModel } = require('./UserCourse');
const { initCourseModel } = require('./Course');
const { initLessonModel } = require('./Lesson');
const { initMarkModel } = require('./Mark');

const UserRole = initUserRoleModel(sequelize);
const User = initUserModel(sequelize);
const UserCourse = initUserCourseModel(sequelize);
const Course = initCourseModel(sequelize);
const Lesson = initLessonModel(sequelize);
const Mark = initMarkModel(sequelize);

db.UserRole = UserRole;
db.User = User;
db.UserCourse = UserCourse;
db.Course = Course;
db.Lesson = Lesson;
db.Mark = Mark;

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;