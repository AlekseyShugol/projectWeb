const courseRepository = require('../repositories/CourseRepository');

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
  }
};

module.exports = courseService;