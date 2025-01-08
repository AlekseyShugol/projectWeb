const userRepository = require('../repositories/UserRepository');

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

  async deleteUser(id) {
    return await userRepository.delete(id);
  }
};

module.exports = userService;