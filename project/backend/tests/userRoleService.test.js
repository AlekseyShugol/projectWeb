const userRoleService = require('../services/UserRoleService');
const { UserRole } = require('../models/UserRole');

jest.mock('../models/UserRole');

describe('userRoleService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get all user roles', async () => {
    const mockUserRoles = [{ id: 1, name: 'Admin' }, { id: 2, name: 'User' }];
    UserRole.findAll.mockResolvedValue(mockUserRoles);

    const userRoles = await userRoleService.getAllUserRoles();
    expect(userRoles).toEqual(mockUserRoles);
    expect(UserRole.findAll).toHaveBeenCalledTimes(1);
  });

  test('should get a user role by ID', async () => {
    const mockUserRole = { id: 1, name: 'Admin' };
    UserRole.findByPk.mockResolvedValue(mockUserRole);

    const userRole = await userRoleService.getUserRoleById(1);
    expect(userRole).toEqual(mockUserRole);
    expect(UserRole.findByPk).toHaveBeenCalledWith(1);
  });

  test('should create a new user role', async () => {
    const userRoleData = { name: 'Admin' };
    const mockUserRole = { id: 1, ...userRoleData };
    UserRole.create.mockResolvedValue(mockUserRole);

    const userRole = await userRoleService.createUserRole(userRoleData);
    expect(userRole).toEqual(mockUserRole);
    expect(UserRole.create).toHaveBeenCalledWith(userRoleData);
  });

  test('should update a user role', async () => {
    const userRoleData = { name: 'Moderator' };
    const mockUserRole = { id: 1, update: jest.fn().mockResolvedValue({ ...userRoleData, id: 1 }) };
    UserRole.findByPk.mockResolvedValue(mockUserRole);

    const updatedUserRole = await userRoleService.updateUserRole(1, userRoleData);
    expect(updatedUserRole).toEqual({ ...userRoleData, id: 1 });
    expect(mockUserRole.update).toHaveBeenCalledWith(userRoleData);
  });

  test('should return null when updating a non-existent user role', async () => {
    UserRole.findByPk.mockResolvedValue(null);

    const updatedUserRole = await userRoleService.updateUserRole(999, { name: 'Guest' });
    expect(updatedUserRole).toBeNull();
    expect(UserRole.findByPk).toHaveBeenCalledWith(999);
  });

  test('should delete a user role', async () => {
    const mockUserRole = { id: 1, destroy: jest.fn() };
    UserRole.findByPk.mockResolvedValue(mockUserRole);

    const result = await userRoleService.deleteUserRole(1);
    expect(result).toBe(true);
    expect(mockUserRole.destroy).toHaveBeenCalled();
  });

  test('should return false when deleting a non-existent user role', async () => {
    UserRole.findByPk.mockResolvedValue(null);

    const result = await userRoleService.deleteUserRole(999);
    expect(result).toBe(false);
    expect(UserRole.findByPk).toHaveBeenCalledWith(999);
  });
});
