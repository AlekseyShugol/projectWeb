const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const { validateCourse } = require('../middlewares/validationMiddleware');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     description: Returns a list of all available courses.
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/', courseController.getAllCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     description: Returns a specific course by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to fetch
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A course object
 *       404:
 *         description: Course not found
 */
router.get('/:id', courseController.getCourseById);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     description: Creates a new course and returns the created course object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Course Name
 *               price:
 *                 type: integer
 *                 example: 1000
 *               user_course_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Course created
 *       400:
 *         description: Invalid input
 */
router.post('/', validateCourse, authenticate, authorize([2, 3]), courseController.createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     description: Updates an existing course by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to update
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
 *               name:
 *                 type: string
 *                 example: Updated Course Name
 *               price:
 *                 type: integer
 *                 example: 2000
 *     responses:
 *       200:
 *         description: Course updated
 *       404:
 *         description: Course not found
 */
router.put('/:id', validateCourse, authenticate, authorize([2, 3]), courseController.updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Deletes a course by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Course deleted
 *       404:
 *         description: Course not found
 */
router.delete('/:id', authenticate, authorize([2, 3]), courseController.deleteCourse);

module.exports = router;