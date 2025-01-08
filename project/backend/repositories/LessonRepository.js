const { Lesson } = require('../models/Lesson');

class LessonRepository {
  async findAll() {
    return await Lesson.findAll();
  }

  async findById(id) {
    return await Lesson.findByPk(id);
  }

  async create(data) {
    return await Lesson.create(data);
  }

  async update(id, data) {
    const lesson = await Lesson.findByPk(id);
    if (lesson) {
      return await lesson.update(data);
    }
    return null;
  }

  async delete(id) {
    const lesson = await Lesson.findByPk(id);
    if (lesson) {
      await lesson.destroy();
      return true;
    }
    return false;
  }
}

module.exports = new LessonRepository();