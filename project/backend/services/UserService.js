const userRepository = require('../repositories/UserRepository');
const userCourseRepository = require('../repositories/UserCourseRepository'); // Импортируйте репозиторий курсов

const userService = {
  async getAllUsers() {
    return await userRepository.findAll();
  },

  async getUserById(id) {
    return await userRepository.findById(id);
  },

  async createUser(data) {
    return await userRepository.create(data);
  },

  async updateUser(id, data) {
    return await userRepository.update(id, data);
  },

  async deleteUser(userId) {
    // Сначала удаляем все связанные курсы
    await userCourseRepository.deleteByUserId(userId); // Метод для удаления курсов

    // Затем удаляем пользователя
    return await userRepository.delete(userId);
  }
};

module.exports = userService;