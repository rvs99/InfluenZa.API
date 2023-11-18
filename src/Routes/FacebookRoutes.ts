import express from 'express';
import { container } from 'tsyringe';
import { FacebookController } from '../Controllers/FacebookController';
import { check } from 'express-validator';
import { TokenAuthMiddleware } from '../Middlewares/TokenAuthMiddleware';

const router = express.Router();

// Resolve all dependencies of FacebookController
const facebookController = container.resolve(FacebookController);
const tokenAuthMiddleware = container.resolve(TokenAuthMiddleware);

router.post(
    '/connect-profile', tokenAuthMiddleware.authenticate,
    [
        check('facebookToken').notEmpty().withMessage('Facebook token is required.'),
    ],
    facebookController.connectProfile.bind(facebookController.connectProfile)
);

export default router;