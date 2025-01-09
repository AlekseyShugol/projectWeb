const { User } = require('../models/User');

class UserRepository {
  async findAll() {
    return await User.findAll();
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async create(data) {
    return await User.create(data);
  }

  async update(id, data) {
    // Отклоняем обновление пользователя с ID 1
    if (id === "1") {
      return false;
    }

    const user = await User.findByPk(id);
    if (user) {
      return await user.update(data);
    }
    return null;
  }

  async delete(id) {
    // Отклоняем удаление пользователя с ID 1
    if (id === 1) {
      return false;
    }

    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      return true;
    }
    return false;
  }
}

module.exports = new UserRepository();