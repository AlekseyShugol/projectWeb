const lessonService = require('../services/LessonService');

exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await lessonService.getAllLessons();
    res.json(lessons);
  } catch (error) {
    console.error('Error retrieving lessons:', error);
    res.status(500).json({ message: 'Error retrieving lessons' });
  }
};

exports.getLessonById = async (req, res) => {
  try {
    const lesson = await lessonService.getLessonById(req.params.id);
    if (lesson) {
      res.json(lesson);
    } else {
      res.status(404).json({ message: 'Lesson not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving lesson' });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const newLesson = await lessonService.createLesson(req.body);
    res.status(201).json(newLesson);
  } catch (error) {
    res.status(400).json({ message: 'Error creating lesson' });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lesson = await lessonService.updateLesson(req.params.id, req.body);
    if (lesson) {
      res.json(lesson);
    } else {
      res.status(404).json({ message: 'Lesson not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating lesson' });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const success = await lessonService.deleteLesson(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Lesson not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lesson' });
  }
};