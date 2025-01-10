const lessonService = require('../services/LessonService');
const { Lesson } = require('../models/Lesson');

jest.mock('../models/Lesson');

describe('lessonService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get all lessons', async () => {
    const mockLessons = [{ id: 1, title: 'Lesson 1' }, { id: 2, title: 'Lesson 2' }];
    Lesson.findAll.mockResolvedValue(mockLessons);

    const lessons = await lessonService.getAllLessons();
    expect(lessons).toEqual(mockLessons);
    expect(Lesson.findAll).toHaveBeenCalledTimes(1);
  });

  test('should get a lesson by ID', async () => {
    const mockLesson = { id: 1, title: 'Lesson 1' };
    Lesson.findByPk.mockResolvedValue(mockLesson);

    const lesson = await lessonService.getLessonById(1);
    expect(lesson).toEqual(mockLesson);
    expect(Lesson.findByPk).toHaveBeenCalledWith(1);
  });

  test('should create a new lesson', async () => {
    const lessonData = { title: 'Lesson 1' };
    const mockLesson = { id: 1, ...lessonData };
    Lesson.create.mockResolvedValue(mockLesson);

    const lesson = await lessonService.createLesson(lessonData);
    expect(lesson).toEqual(mockLesson);
    expect(Lesson.create).toHaveBeenCalledWith(lessonData);
  });

  test('should update a lesson', async () => {
    const lessonData = { title: 'Updated Lesson' };
    const mockLesson = { id: 1, update: jest.fn().mockResolvedValue({ ...lessonData, id: 1 }) };
    Lesson.findByPk.mockResolvedValue(mockLesson);

    const updatedLesson = await lessonService.updateLesson(1, lessonData);
    expect(updatedLesson).toEqual({ ...lessonData, id: 1 });
    expect(mockLesson.update).toHaveBeenCalledWith(lessonData);
  });

  test('should return null when updating a non-existent lesson', async () => {
    Lesson.findByPk.mockResolvedValue(null);

    const updatedLesson = await lessonService.updateLesson(999, { title: 'Updated Lesson' });
    expect(updatedLesson).toBeNull();
    expect(Lesson.findByPk).toHaveBeenCalledWith(999);
  });

  test('should delete a lesson', async () => {
    const mockLesson = { id: 1, destroy: jest.fn() };
    Lesson.findByPk.mockResolvedValue(mockLesson);

    const result = await lessonService.deleteLesson(1);
    expect(result).toBe(true);
    expect(mockLesson.destroy).toHaveBeenCalled();
  });

  test('should return false when deleting a non-existent lesson', async () => {
    Lesson.findByPk.mockResolvedValue(null);

    const result = await lessonService.deleteLesson(999);
    expect(result).toBe(false);
    expect(Lesson.findByPk).toHaveBeenCalledWith(999);
  });
});
