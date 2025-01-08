const courseService = require('../services/CourseService');
const { Course } = require('../models/Course');

jest.mock('../models/Course');

describe('courseService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get all courses', async () => {
    const mockCourses = [
      { id: 1, name: 'Course 1', price: 1000 },
      { id: 2, name: 'Course 2', price: 1500 },
    ];
    Course.findAll.mockResolvedValue(mockCourses);

    const courses = await courseService.getAllCourses();
    expect(courses).toEqual(mockCourses);
    expect(Course.findAll).toHaveBeenCalledTimes(1);
  });

  test('should get a course by ID', async () => {
    const mockCourse = { id: 1, name: 'Course 1', price: 1000 };
    Course.findByPk.mockResolvedValue(mockCourse);

    const course = await courseService.getCourseById(1);
    expect(course).toEqual(mockCourse);
    expect(Course.findByPk).toHaveBeenCalledWith(1);
  });

  test('should create a new course', async () => {
    const courseData = { name: 'New Course', price: 1200, user_cource_id: 3 };
    const mockCourse = { id: 1, ...courseData };
    Course.create.mockResolvedValue(mockCourse);

    const course = await courseService.createCourse(courseData);
    expect(course).toEqual(mockCourse);
    expect(Course.create).toHaveBeenCalledWith(courseData);
  });

  test('should update a course', async () => {
    const courseData = { name: 'Updated Course', price: 2000 };
    const mockCourse = { id: 1, update: jest.fn().mockResolvedValue({ ...courseData, id: 1 }) };
    Course.findByPk.mockResolvedValue(mockCourse);

    const updatedCourse = await courseService.updateCourse(1, courseData);
    expect(updatedCourse).toEqual({ ...courseData, id: 1 });
    expect(mockCourse.update).toHaveBeenCalledWith(courseData);
  });

  test('should return null when updating a non-existent course', async () => {
    Course.findByPk.mockResolvedValue(null);

    const updatedCourse = await courseService.updateCourse(999, { name: 'Non-existent Course' });
    expect(updatedCourse).toBeNull();
    expect(Course.findByPk).toHaveBeenCalledWith(999);
  });

  test('should delete a course', async () => {
    const mockCourse = { id: 1, destroy: jest.fn() };
    Course.findByPk.mockResolvedValue(mockCourse);

    const result = await courseService.deleteCourse(1);
    expect(result).toBe(true);
    expect(mockCourse.destroy).toHaveBeenCalled();
  });

  test('should return false when deleting a non-existent course', async () => {
    Course.findByPk.mockResolvedValue(null);

    const result = await courseService.deleteCourse(999);
    expect(result).toBe(false);
    expect(Course.findByPk).toHaveBeenCalledWith(999);
  });
});
