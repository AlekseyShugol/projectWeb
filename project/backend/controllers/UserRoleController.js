const userRoleService = require('../services/UserRoleService');

exports.getAllUserRoles = async (req, res) => {
  try {
    const userRoles = await userRoleService.getAllUserRoles();
    res.json(userRoles);
  } catch (error) {
    console.error('Error retrieving user roles:', error);
    res.status(500).json({ message: 'Error retrieving user roles' });
  }
};

exports.getUserRoleById = async (req, res) => {
  try {
    const userRole = await userRoleService.getUserRoleById(req.params.id);
    if (userRole) {
      res.json(userRole);
    } else {
      res.status(404).json({ message: 'UserRole not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user role' });
  }
};

exports.createUserRole = async (req, res) => {
  try {
    const newUserRole = await userRoleService.createUserRole(req.body);
    res.status(201).json(newUserRole);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user role' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const userRole = await userRoleService.updateUserRole(req.params.id, req.body);
    if (userRole) {
      res.json(userRole);
    } else {
      res.status(404).json({ message: 'UserRole not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating user role' });
  }
};

exports.deleteUserRole = async (req, res) => {
  try {
    const success = await userRoleService.deleteUserRole(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'UserRole not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user role ' + error.message });
  }
};