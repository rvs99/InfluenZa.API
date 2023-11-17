import { Request, Response, NextFunction } from 'express';
import basicAuth from 'basic-auth';
import { container } from '../ioc';
import { UserService } from '../Services/Implementations/UserService';

export const BasicAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.error("middleware working");
        const credentials = basicAuth(req);
        if (!credentials) {
            return res.status(401).send('Unauthorized');
        }

        const { name, pass } = credentials;
        const userService = container.resolve(UserService);
        const user = await userService.verifyCredentials(name, pass);

        if (user == null) {
            return res.status(401).send('Unauthorized');
        }
        else {

            // Attach user object to request for later use
            req['authenticatedUser'] = user;
            console.error("Authenticated User: " + JSON.stringify(user));
        }


        // Call next() to continue the middleware chain
        next();
    }
    catch (err) {
        console.error("Error:" + err);
        // Call next() with an error to continue the middleware chain
        next(err);
    }
};
