const { UserRole } = require('../models/UserRole');

class UserRoleRepository {
  async findAll() {
    return await UserRole.findAll();
  }

  async findById(id) {
    return await UserRole.findByPk(id);
  }

  async create(data) {
    return await UserRole.create(data);
  }

  async update(id, data) {
    const userRole = await UserRole.findByPk(id);
    if (userRole) {
      return await userRole.update(data);
    }
    return null;
  }

  async delete(id) {
    const userRole = await UserRole.findByPk(id);
    if (userRole) {
      await userRole.destroy();
      return true;
    }
    return false;
  }
}

module.exports = new UserRoleRepository();