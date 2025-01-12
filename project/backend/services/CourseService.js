const courseRepository = require('../repositories/CourseRepository');
const lessonRepository = require('../repositories/LessonRepository'); // Импортируем репозиторий уроков

const courseService = {
  async getAllCourses() {
    return await courseRepository.findAll();
  },

  async getCourseById(id) {
    return await courseRepository.findById(id);
  },

  async createCourse(data) {
    return await courseRepository.create(data);
  },

  async updateCourse(id, data) {
    return await courseRepository.update(id, data);
  },

  async deleteCourse(id) {
    return await courseRepository.delete(id);
  },

  // Новый метод для удаления курса и связанных с ним уроков
  async deleteCourseWithLessons(courseId) {
    // Удаление всех уроков, связанных с курсом, вместе с их оценками
    const lessons = await lessonRepository.findAllByCourseId(courseId);
    for (const lesson of lessons) {
      await lessonRepository.deleteLessonWithMarks(lesson.id);
    }

    // Удаление курса
    const course = await courseRepository.findById(courseId);
    if (course) {
      await courseRepository.delete(courseId);
      return true;
    }
    return false;
  }
};

module.exports = courseService;