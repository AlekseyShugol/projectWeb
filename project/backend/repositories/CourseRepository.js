const { Course } = require('../models/Course');

class CourseRepository {
  async findAll() {
    return await Course.findAll();
  }

  async findById(id) {
    return await Course.findByPk(id);
  }

  async create(data) {
    return await Course.create(data);
  }

  async update(id, data) {
    const course = await Course.findByPk(id);
    if (course) {
      return await course.update(data);
    }
    return null;
  }

  async delete(id) {
    const course = await Course.findByPk(id);
    if (course) {
      await course.destroy();
      return true;
    }
    return false;
  }
}

module.exports = new CourseRepository();