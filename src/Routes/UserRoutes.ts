import express from 'express';
import { check } from 'express-validator';
import { UserController } from '../Controllers/UserController';
import { BasicAuthMiddleware } from '../Middlewares/BasicAuthMiddleware';
import { TokenAuthMiddleware } from '../Middlewares/TokenAuthMiddleware';
import { container } from 'tsyringe';

const router = express.Router();

// Resolve all dependencies of UserController
const basicAuthMiddleware = container.resolve(BasicAuthMiddleware);
const tokenAuthMiddleware = container.resolve(TokenAuthMiddleware);
const userController = container.resolve(UserController);

router.post('/register', [
    check('username').notEmpty().isString(),
    check('password').isLength({ min: 6 }),
    check('emailId').notEmpty().isEmail(),
    check('signedUpMethod').notEmpty().isString(),
    check('role').notEmpty().isString()
], userController.register.bind(userController));

router.post('/login', basicAuthMiddleware.authenticate.bind(basicAuthMiddleware), userController.login.bind(userController));

router.post(
    '/register-facebook',
    [
        check('token').notEmpty().withMessage('Token is required.'),
        check('role').notEmpty().withMessage('Role is required.')
    ],
    userController.registerUserFromFacebook.bind(userController)
);

router.get(
    '/:userId', tokenAuthMiddleware.authenticate.bind(tokenAuthMiddleware),
    [
        check('userId').notEmpty().withMessage('userId is required.')
    ],
    userController.getUser.bind(userController)
);

export default router;