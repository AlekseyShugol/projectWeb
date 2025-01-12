const userCourseService = require('../services/UserCourseService');

exports.getAllUserCourses = async (req, res) => {
  try {
    const userCourses = await userCourseService.getAllUserCourses();
    res.json(userCourses);
  } catch (error) {
    console.error('Error retrieving user courses:', error);
    res.status(500).json({ message: 'Error retrieving user courses' });
  }
};

exports.getUserCourseById = async (req, res) => {
  try {
    const userCourse = await userCourseService.getUserCourseById(req.params.id);
    if (userCourse) {
      res.json(userCourse);
    } else {
      res.status(404).json({ message: 'UserCourse not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user course' });
  }
};

exports.createUserCourse = async (req, res) => {
  try {
    const newUserCourse = await userCourseService.createUserCourse(req.body);
    res.status(201).json(newUserCourse);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user course' });
  }
};

exports.updateUserCourse = async (req, res) => {
  try {
    const userCourse = await userCourseService.updateUserCourse(req.params.id, req.body);
    if (userCourse) {
      res.json(userCourse);
    } else {
      res.status(404).json({ message: 'UserCourse not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating user course' });
  }
};

exports.deleteUserCourse = async (req, res) => {
  try {
    const success = await userCourseService.deleteUserCourse(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'UserCourse not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user course ' + error});
  }
};