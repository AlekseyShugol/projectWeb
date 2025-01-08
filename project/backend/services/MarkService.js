const markRepository = require('../repositories/MarkRepository');

const markService = {
  async getAllMarks() {
    return await markRepository.findAll();
  },

  async getMarkById(id) {
    return await markRepository.findById(id);
  },

  async createMark(userId, data, roleId) {
    if (!data) throw new Error('Data is required to create a mark.');

    const teacherId = roleId === 3 ? data.teacher_id : userId;

    if (!teacherId) throw new Error('Teacher ID could not be determined.');
    if (!data.lesson_id) throw new Error('Lesson ID is required.');

    return await markRepository.create({ ...data, teacher_id: teacherId });
  },

  async updateMark(id, data) {
    return await markRepository.update(id, data);
  },

  async deleteMark(id) {
    return await markRepository.delete(id);
  }
};

module.exports = markService;