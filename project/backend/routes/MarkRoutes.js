const express = require('express');
const router = express.Router();
const markController = require('../controllers/MarkController');
const { validateMark } = require('../middlewares/validationMiddleware');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/marks:
 *   get:
 *     summary: Get all marks
 *     description: Returns a list of all available marks.
 *     responses:
 *       200:
 *         description: List of marks
 */
router.get('/', markController.getAllMarks);

/**
 * @swagger
 * /api/marks/{id}:
 *   get:
 *     summary: Get mark by ID
 *     description: Returns a specific mark by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the mark to fetch
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A mark object
 *       404:
 *         description: Mark not found
 */
router.get('/:id', markController.getMarkById);

/**
 * @swagger
 * /api/marks:
 *   post:
 *     summary: Create a new mark
 *     description: Creates a new mark and returns the created mark object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: integer
 *                 example: 95
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Mark created
 *       400:
 *         description: Invalid input
 */
router.post('/', validateMark, authenticate, authorize([2, 3]), markController.createMark);

/**
 * @swagger
 * /api/marks/{id}:
 *   put:
 *     summary: Update a mark
 *     description: Updates an existing mark by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the mark to update
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
 *               value:
 *                 type: integer
 *                 example: 98
 *     responses:
 *       200:
 *         description: Mark updated
 *       404:
 *         description: Mark not found
 */
router.put('/:id', validateMark, authenticate, authorize([2, 3]), markController.updateMark);

/**
 * @swagger
 * /api/marks/{id}:
 *   delete:
 *     summary: Delete a mark
 *     description: Deletes a mark by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the mark to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Mark deleted
 *       404:
 *         description: Mark not found
 */
router.delete('/:id', authenticate, authorize([2, 3]), markController.deleteMark);

module.exports = router;