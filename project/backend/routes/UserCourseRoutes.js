const express = require('express');
const router = express.Router();
const userCourseController = require('../controllers/UserCourseController');
const { validateUserCourse } = require('../middlewares/validationMiddleware');
const { authenticate } = require('../middlewares/authMiddleware'); 

/**
 * @swagger
 * /api/user-courses:
 *   get:
 *     summary: Get all user courses
 *     description: Returns a list of all courses assigned to users.
 *     responses:
 *       200:
 *         description: List of user courses
 */
router.get('/', userCourseController.getAllUserCourses);

/**
 * @swagger
 * /api/user-courses/{id}:
 *   get:
 *     summary: Get user course by ID
 *     description: Returns a specific user course by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user course to fetch
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A user course object
 *       404:
 *         description: User course not found
 */
router.get('/:id', userCourseController.getUserCourseById);

/**
 * @swagger
 * /api/user-courses:
 *   post:
 *     summary: Create a new user course
 *     description: Creates a new user-course relationship and returns the created user course object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               courseId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: User course created
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticate, validateUserCourse, userCourseController.createUserCourse);

/**
 * @swagger
 * /api/user-courses/{id}:
 *   put:
 *     summary: Update a user course
 *     description: Updates an existing user course by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user course to update
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
 *               courseId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: User course updated
 *       404:
 *         description: User course not found
 */
router.put('/:id', validateUserCourse, authenticate, userCourseController.updateUserCourse);

/**
 * @swagger
 * /api/user-courses/{id}:
 *   delete:
 *     summary: Delete a user course
 *     description: Deletes a user course by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user course to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User course deleted
 *       404:
 *         description: User course not found
 */
router.delete('/:id', authenticate, userCourseController.deleteUserCourse);

module.exports = router;
