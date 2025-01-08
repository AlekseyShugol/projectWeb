const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/LessonController');
const { validateLesson } = require('../middlewares/validationMiddleware');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: Get all lessons
 *     description: Returns a list of all lessons in the system.
 *     responses:
 *       200:
 *         description: List of lessons
 */
router.get('/', lessonController.getAllLessons);

/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: Get lesson by ID
 *     description: Returns a specific lesson by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the lesson to fetch
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A lesson object
 *       404:
 *         description: Lesson not found
 */
router.get('/:id', lessonController.getLessonById);

/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson
 *     description: Creates a new lesson and returns the created lesson object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Node.js
 *               description:
 *                 type: string
 *                 example: A basic overview of Node.js and its features.
 *               courseId:
 *                 type: integer
 *                 example: 2
 *               duration:
 *                 type: string
 *                 example: "45 minutes"
 *     responses:
 *       201:
 *         description: Lesson created
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticate, authorize([2, 3]), validateLesson, lessonController.createLesson);

/**
 * @swagger
 * /api/lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     description: Updates an existing lesson by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the lesson to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Advanced Node.js
 *               description:
 *                 type: string
 *                 example: In-depth look at Node.js and its advanced concepts.
 *               duration:
 *                 type: string
 *                 example: "90 minutes"
 *     responses:
 *       200:
 *         description: Lesson updated
 *       404:
 *         description: Lesson not found
 */
router.put('/:id', authenticate, authorize([2, 3]), validateLesson, lessonController.updateLesson);

/**
 * @swagger
 * /api/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     description: Deletes a lesson by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the lesson to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lesson deleted
 *       404:
 *         description: Lesson not found
 */
router.delete('/:id', authenticate, authorize([2, 3]), lessonController.deleteLesson);

module.exports = router;