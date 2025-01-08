const markService = require('../services/MarkService');
const { Mark } = require('../models/Mark');

jest.mock('../models/Mark');

describe('markService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get all marks', async () => {
    const mockMarks = [{ id: 1, value: 5 }, { id: 2, value: 4 }];
    Mark.findAll.mockResolvedValue(mockMarks);

    const marks = await markService.getAllMarks();
    expect(marks).toEqual(mockMarks);
    expect(Mark.findAll).toHaveBeenCalledTimes(1);
  });

  test('should get a mark by ID', async () => {
    const mockMark = { id: 1, value: 5 };
    Mark.findByPk.mockResolvedValue(mockMark);

    const mark = await markService.getMarkById(1);
    expect(mark).toEqual(mockMark);
    expect(Mark.findByPk).toHaveBeenCalledWith(1);
  });

  test('should create a new mark', async () => {
    const markData = { value: 5 };
    const mockMark = { id: 1, ...markData };
    Mark.create.mockResolvedValue(mockMark);

    const mark = await markService.createMark(markData);
    expect(mark).toEqual(mockMark);
    expect(Mark.create).toHaveBeenCalledWith(markData);
  });

  test('should update a mark', async () => {
    const markData = { value: 4 };
    const mockMark = { id: 1, update: jest.fn().mockResolvedValue({ ...markData, id: 1 }) };
    Mark.findByPk.mockResolvedValue(mockMark);

    const updatedMark = await markService.updateMark(1, markData);
    expect(updatedMark).toEqual({ ...markData, id: 1 });
    expect(mockMark.update).toHaveBeenCalledWith(markData);
  });

  test('should return null when updating a non-existent mark', async () => {
    Mark.findByPk.mockResolvedValue(null);

    const updatedMark = await markService.updateMark(999, { value: 3 });
    expect(updatedMark).toBeNull();
    expect(Mark.findByPk).toHaveBeenCalledWith(999);
  });

  test('should delete a mark', async () => {
    const mockMark = { id: 1, destroy: jest.fn() };
    Mark.findByPk.mockResolvedValue(mockMark);

    const result = await markService.deleteMark(1);
    expect(result).toBe(true);
    expect(mockMark.destroy).toHaveBeenCalled();
  });

  test('should return false when deleting a non-existent mark', async () => {
    Mark.findByPk.mockResolvedValue(null);

    const result = await markService.deleteMark(999);
    expect(result).toBe(false);
    expect(Mark.findByPk).toHaveBeenCalledWith(999);
  });
});
