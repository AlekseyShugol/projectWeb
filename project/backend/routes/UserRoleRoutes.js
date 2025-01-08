const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/UserRoleController');
const { validateUserRole } = require('../middlewares/validationMiddleware');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/user-roles:
 *   get:
 *     summary: Get all user roles
 *     description: Returns a list of all user roles in the system.
 *     responses:
 *       200:
 *         description: List of user roles
 */
router.get('/', authenticate, userRoleController.getAllUserRoles);

/**
 * @swagger
 * /api/user-roles/{id}:
 *   get:
 *     summary: Get user role by ID
 *     description: Returns a specific user role by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user role to fetch
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A user role object
 *       404:
 *         description: User role not found
 */
router.get('/:id', authenticate, userRoleController.getUserRoleById);

/**
 * @swagger
 * /api/user-roles:
 *   post:
 *     summary: Create a new user role
 *     description: Creates a new user role and returns the created user role object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: Admin
 *     responses:
 *       201:
 *         description: User role created
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticate, authorize([3]), validateUserRole, userRoleController.createUserRole);

/**
 * @swagger
 * /api/user-roles/{id}:
 *   put:
 *     summary: Update a user role
 *     description: Updates an existing user role by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user role to update
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
 *               roleName:
 *                 type: string
 *                 example: Super Admin
 *     responses:
 *       200:
 *         description: User role updated
 *       404:
 *         description: User role not found
 */
router.put('/:id', authenticate, authorize([3]), validateUserRole, userRoleController.updateUserRole);

/**
 * @swagger
 * /api/user-roles/{id}:
 *   delete:
 *     summary: Delete a user role
 *     description: Deletes a user role by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user role to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User role deleted
 *       404:
 *         description: User role not found
 */
router.delete('/:id', authenticate, authorize([3]), userRoleController.deleteUserRole);

module.exports = router;