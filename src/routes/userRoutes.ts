import express from 'express';
import { check } from 'express-validator';
import { UserController } from '../Controllers/UserController';
import { UserService } from '../Services/Implementations/UserService';
import { BasicAuthMiddleware } from '../Middlewares/BasicAuthMiddleware';
import { TokenAuthMiddleware } from '../Middlewares/TokenAuthMiddleware';
import { container } from '../ioc';

const router = express.Router();

// Create an instance of FacebookService
// const fbRepository = container.resolve(facebookRepository);
// const facebookService = container.resolve(FacebookService);
// const userRepository = container.resolve(UserRepository);
const userService = container.resolve(UserService);

// Inject the FacebookService instance into UserController
const userController = new UserController(userService);

router.post('/register', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
], userController.register);

router.post('/login', BasicAuthMiddleware, userController.login);

router.post(
    '/register-facebook',
    [
        check('token').notEmpty().withMessage('Token is required.'),
        check('role').notEmpty().withMessage('Roel is required.')
    ],
    userController.registerUserFromFacebook.bind(userController.registerUserFromFacebook)
);

router.get(
    '/:userId', TokenAuthMiddleware,
    [
        check('userId').notEmpty().withMessage('userId is required.')
    ],
    userController.getUser.bind(userController.getUser)
);

export default router;