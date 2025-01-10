const userCourseService = require('../services/UserCourseService');
const { UserCourse } = require('../models/UserCourse');

jest.mock('../models/UserCourse');

describe('userCourseService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get all user courses', async () => {
    const mockUserCourses = [{ id: 1, course_id: 2 }, { id: 2, course_id: 3 }];
    UserCourse.findAll.mockResolvedValue(mockUserCourses);

    const userCourses = await userCourseService.getAllUserCourses();
    expect(userCourses).toEqual(mockUserCourses);
    expect(UserCourse.findAll).toHaveBeenCalledTimes(1);
  });

  test('should get a user course by ID', async () => {
    const mockUserCourse = { id: 1, course_id: 2 };
    UserCourse.findByPk.mockResolvedValue(mockUserCourse);

    const userCourse = await userCourseService.getUserCourseById(1);
    expect(userCourse).toEqual(mockUserCourse);
    expect(UserCourse.findByPk).toHaveBeenCalledWith(1);
  });

  test('should create a new user course', async () => {
    const userCourseData = { course_id: 2 };
    const mockUserCourse = { id: 1, ...userCourseData };
    UserCourse.create.mockResolvedValue(mockUserCourse);

    const userCourse = await userCourseService.createUserCourse(userCourseData);
    expect(userCourse).toEqual(mockUserCourse);
    expect(UserCourse.create).toHaveBeenCalledWith(userCourseData);
  });

  test('should update a user course', async () => {
    const userCourseData = { course_id: 3 };
    const mockUserCourse = { id: 1, update: jest.fn().mockResolvedValue({ ...userCourseData, id: 1 }) };
    UserCourse.findByPk.mockResolvedValue(mockUserCourse);

    const updatedUserCourse = await userCourseService.updateUserCourse(1, userCourseData);
    expect(updatedUserCourse).toEqual({ ...userCourseData, id: 1 });
    expect(mockUserCourse.update).toHaveBeenCalledWith(userCourseData);
  });

  test('should return null when updating a non-existent user course', async () => {
    UserCourse.findByPk.mockResolvedValue(null);

    const updatedUserCourse = await userCourseService.updateUserCourse(999, { course_id: 5 });
    expect(updatedUserCourse).toBeNull();
    expect(UserCourse.findByPk).toHaveBeenCalledWith(999);
  });

  test('should delete a user course', async () => {
    const mockUserCourse = { id: 1, destroy: jest.fn() };
    UserCourse.findByPk.mockResolvedValue(mockUserCourse);

    const result = await userCourseService.deleteUserCourse(1);
    expect(result).toBe(true);
    expect(mockUserCourse.destroy).toHaveBeenCalled();
  });

  test('should return false when deleting a non-existent user course', async () => {
    UserCourse.findByPk.mockResolvedValue(null);

    const result = await userCourseService.deleteUserCourse(999);
    expect(result).toBe(false);
    expect(UserCourse.findByPk).toHaveBeenCalledWith(999);
  });
});
