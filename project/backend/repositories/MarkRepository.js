const { Mark } = require('../models/Mark');

class MarkRepository {
  async findAll() {
    return await Mark.findAll();
  }

  async findById(id) {
    return await Mark.findByPk(id);
  }

  async create(data) {
    return await Mark.create(data);
  }

  async update(id, data) {
    const mark = await Mark.findByPk(id);
    if (mark) {
      return await mark.update(data);
    }
    return null;
  }

  async delete(id) {
    const mark = await Mark.findByPk(id);
    if (mark) {
      await mark.destroy();
      return true;
    }
    return false;
  }

  async deleteByLessonId(lessonId) {
    return await Mark.destroy({ where: { lesson_id: lessonId } });
  }
}

module.exports = new MarkRepository();