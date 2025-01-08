const lessonRepository = require('../repositories/LessonRepository');

const lessonService = {
  async getAllLessons() {
    return await lessonRepository.findAll();
  },

  async getLessonById(id) {
    return await lessonRepository.findById(id);
  },

  async createLesson(data) {
    return await lessonRepository.create(data);
  },

  async updateLesson(id, data) {
    return await lessonRepository.update(id, data);
  },

  async deleteLesson(id) {
    return await lessonRepository.delete(id);
  }
};

module.exports = lessonService;