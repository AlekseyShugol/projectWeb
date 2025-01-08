const userCourseRepository = require('../repositories/UserCourseRepository');

const userCourseService = {
  async getAllUserCourses() {
    return await userCourseRepository.findAll();
  },

  async getUserCourseById(id) {
    return await userCourseRepository.findById(id);
  },

  async createUserCourse(data) {
    return await userCourseRepository.create(data);
  },

  async updateUserCourse(id, data) {
    return await userCourseRepository.update(id, data);
  },

  async deleteUserCourse(id) {
    return await userCourseRepository.delete(id);
  }
};

module.exports = userCourseService;