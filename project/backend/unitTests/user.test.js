const userService = require('../services/UserService');
const { User } = require('../models/User');

jest.mock('../models/User');

describe('userService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get all users', async () => {
    const mockUsers = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
    User.findAll.mockResolvedValue(mockUsers);

    const users = await userService.getAllUsers();
    expect(users).toEqual(mockUsers);
    expect(User.findAll).toHaveBeenCalledTimes(1);
  });

  test('should get a user by ID', async () => {
    const mockUser = { id: 1, name: 'John' };
    User.findByPk.mockResolvedValue(mockUser);

    const user = await userService.getUserById(1);
    expect(user).toEqual(mockUser);
    expect(User.findByPk).toHaveBeenCalledWith(1);
  });

  test('should create a new user', async () => {
    const userData = { name: 'John' };
    const mockUser = { id: 1, ...userData };
    User.create.mockResolvedValue(mockUser);

    const user = await userService.createUser(userData);
    expect(user).toEqual(mockUser);
    expect(User.create).toHaveBeenCalledWith(userData);
  });

  test('should update a user', async () => {
    const userData = { name: 'John Updated' };
    const mockUser = { id: 1, update: jest.fn().mockResolvedValue({ ...userData, id: 1 }) };
    User.findByPk.mockResolvedValue(mockUser);

    const updatedUser = await userService.updateUser(1, userData);
    expect(updatedUser).toEqual({ ...userData, id: 1 });
    expect(mockUser.update).toHaveBeenCalledWith(userData);
  });

  test('should return null when updating a non-existent user', async () => {
    User.findByPk.mockResolvedValue(null);

    const updatedUser = await userService.updateUser(999, { name: 'Non Existent' });
    expect(updatedUser).toBeNull();
    expect(User.findByPk).toHaveBeenCalledWith(999);
  });



  test('should return false when deleting a non-existent user', async () => {
    User.findByPk.mockResolvedValue(null);

    const result = await userService.deleteUser(999);
    expect(result).toBe(false);
    expect(User.findByPk).toHaveBeenCalledWith(999);
  });
});
