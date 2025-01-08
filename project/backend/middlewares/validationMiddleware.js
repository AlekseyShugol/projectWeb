const validateCourse = require('../validators/CourseValidator');
const validateLesson = require('../validators/LessonValidator');
const validateMark = require('../validators/MarkValidator');
const validateUser = require('../validators/UserValidator');
const validateUserCourse = require('../validators/UserCourseValidator');
const validateUserRole = require('../validators/UserRoleValidator');

module.exports = {
  validateCourse,
  validateLesson,
  validateMark,
  validateUser,
  validateUserCourse,
  validateUserRole,
};