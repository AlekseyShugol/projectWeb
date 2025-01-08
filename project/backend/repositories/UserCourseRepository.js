const { UserCourse } = require('../models/UserCourse');

class UserCourseRepository {
  async findAll() {
    return await UserCourse.findAll();
  }

  async findById(id) {
    return await UserCourse.findByPk(id);
  }

  async create(data) {
    return await UserCourse.create(data);
  }

  async update(id, data) {
    const userCourse = await UserCourse.findByPk(id);
    if (userCourse) {
      return await userCourse.update(data);
    }
    return null;
  }

  async delete(id) {
    const userCourse = await UserCourse.findByPk(id);
    if (userCourse) {
      await userCourse.destroy();
      return true;
    }
    return false;
  }
}

module.exports = new UserCourseRepository();