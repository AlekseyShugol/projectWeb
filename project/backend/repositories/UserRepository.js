const { User } = require('../models');

class UserRepository {
  async findAll() {
    try {
      return await User.findAll();
    } catch (error) {
      throw new Error('Ошибка при получении всех пользователей: ' + error.message);
    }
  }

  async findById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Пользователь не найден');
      }
      return user;
    } catch (error) {
      throw new Error('Ошибка при получении пользователя по ID: ' + error.message);
    }
  }

  async create(data) {
    try {
      return await User.create(data);
    } catch (error) {
      throw new Error('Ошибка при создании пользователя: ' + error.message);
    }
  }

  async update(id, data) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Пользователь не найден для обновления');
      }
      return await user.update(data);
    } catch (error) {
      throw new Error('Ошибка при обновлении пользователя: ' + error.message);
    }
  }

  async delete(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Пользователь не найден для удаления');
      }
      await user.destroy();
      return true; // Возвращаем true, если удаление прошло успешно
    } catch (error) {
      throw new Error('Ошибка при удалении пользователя: ' + error.message);
    }
  }
}

module.exports = new UserRepository();