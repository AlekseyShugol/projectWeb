const jwt = require('jsonwebtoken');
const markService = require('../services/MarkService');

const SECRET_KEY = 'secret'; // ключ для декодирования токенов


const getUserFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return { id: decoded.id, role: decoded.role };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

exports.getAllMarks = async (req, res) => {
  try {
    const marks = await markService.getAllMarks();
    res.json(marks);
  } catch (error) {
    console.error('Error retrieving marks:', error);
    res.status(500).json({ message: 'Error retrieving marks' });
  }
};

exports.getMarkById = async (req, res) => {
  try {
    const mark = await markService.getMarkById(req.params.id);
    if (mark) {
      res.json(mark);
    } else {
      res.status(404).json({ message: 'Mark not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving mark' });
  }
};

exports.createMark = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { id: userId, role: userRole } = getUserFromToken(token);

    console.log(`User ID: ${userId}, Role ID: ${userRole}`);

    const newMark = await markService.createMark(userId, req.body, userRole);
    res.status(201).json(newMark);
  } catch (error) {
    console.error('Error creating mark:', error);
    res.status(400).json({ message: `Error creating mark: ${error.message}` });
  }
};

exports.updateMark = async (req, res) => {
  try {
    const mark = await markService.updateMark(req.params.id, req.body);
    if (mark) {
      res.json(mark);
    } else {
      res.status(404).json({ message: 'Mark not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating mark' });
  }
};

exports.deleteMark = async (req, res) => {
  try {
    const success = await markService.deleteMark(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Mark not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting mark' });
  }
};
