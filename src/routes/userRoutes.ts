import express from 'express';
import { check } from 'express-validator';
import { UserController } from '../controllers/userController';
import { FacebookService } from '../services/facebookService'; // Import FacebookService

const router = express.Router();

// Create an instance of FacebookService
const facebookService = new FacebookService();

// Inject the FacebookService instance into UserController
const userController = new UserController(facebookService);

router.post(
    '/register-facebook',
    [
        check('token').notEmpty().withMessage('Token is required.'),
    ],
    userController.registerUserFromFacebook.bind(userController)
);

export default router;