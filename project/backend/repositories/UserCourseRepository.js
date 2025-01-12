const { UserCourse } = require('../models');

class UserCourseRepository {
  async findAll() {
    try {
      return await UserCourse.findAll();
    } catch (error) {
      throw new Error('Ошибка при получении всех курсов: ' + error.message);
    }
  }

  async findById(id) {
    try {
      const userCourse = await UserCourse.findByPk(id);
      if (!userCourse) {
        throw new Error('Курс не найден');
      }
      return userCourse;
    } catch (error) {
      throw new Error('Ошибка при получении курса по ID: ' + error.message);
    }
  }

  async create(data) {
    try {
      return await UserCourse.create(data);
    } catch (error) {
      throw new Error('Ошибка при создании курса: ' + error.message);
    }
  }

  async update(id, data) {
    try {
      const userCourse = await UserCourse.findByPk(id);
      if (!userCourse) {
        throw new Error('Курс не найден для обновления');
      }
      return await userCourse.update(data);
    } catch (error) {
      throw new Error('Ошибка при обновлении курса: ' + error.message);
    }
  }

  async delete(id) {
    try {
      const userCourse = await UserCourse.findByPk(id);
      if (!userCourse) {
        throw new Error('Курс не найден для удаления');
      }
      await userCourse.destroy();
      return true;
    } catch (error) {
      throw new Error('Ошибка при удалении курса: ' + error.message);
    }
  }

  // Метод для удаления всех курсов по userId
  async deleteByUserId(userId) {
    try {
      return await UserCourse.destroy({ where: { user_id: userId } });
    } catch (error) {
      throw new Error('Ошибка при удалении курсов пользователя: ' + error.message);
    }
  }
}

module.exports = new UserCourseRepository();