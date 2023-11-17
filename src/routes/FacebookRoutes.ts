import express from 'express';
import { container } from '../ioc';
import { FacebookController } from '../Controllers/FacebookController';
import { FacebookService } from '../Services/Implementations/FacebookService';
import { check } from 'express-validator';
import { TokenAuthMiddleware } from '../Middlewares/TokenAuthMiddleware';

const router = express.Router();

const facebookService = container.resolve(FacebookService);

// Inject the FacebookService instance into UserController
const facebookController = new FacebookController(facebookService);

router.post(
    '/connect-profile', TokenAuthMiddleware,
    [
        check('facebookToken').notEmpty().withMessage('Facebook token is required.'),
    ],
    facebookController.connectProfile.bind(facebookController.connectProfile)
);

export default router;