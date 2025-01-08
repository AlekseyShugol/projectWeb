const userRoleRepository = require('../repositories/UserRoleRepository');

const userRoleService = {
  async getAllUserRoles() {
    return await userRoleRepository.findAll();
  },

  async getUserRoleById(id) {
    return await userRoleRepository.findById(id);
  },

  async createUserRole(data) {
    return await userRoleRepository.create(data);
  },

  async updateUserRole(id, data) {
    return await userRoleRepository.update(id, data);
  },

  async deleteUserRole(id) {
    return await userRoleRepository.delete(id);
  }
};

module.exports = userRoleService;