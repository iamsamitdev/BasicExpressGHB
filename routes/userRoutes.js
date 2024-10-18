const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()
/**
 * @swagger
 * tags:
 *  name: Users
 *  description: API for user authentication
 */

// POST: /users/register
/**
 * @swagger
 * /users/register:
 *  post:
 *    summary: Register a new user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *              fullname:
 *                type: string
 *              email:
 *                type: string
 *              tel:
 *                type: string
 *    responses:
 *      201:
 *        description: User registered successfully
 */
router.post('/register', userController.registerUser)

// POST: /users/login
/**
 * @swagger
 * /users/login:
 *  post:
 *    summary: Register a new user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      201:
 *        description: User logged in successfully
 *        content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New access token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
router.post('/login', userController.loginUser)

module.exports = router