import { Request, Response, NextFunction } from 'express';
import basicAuth from 'basic-auth';
import { UserService } from '../Services/Implementations/UserService';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export class BasicAuthMiddleware {

    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public async authenticate(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const credentials = basicAuth(req);
            if (!credentials) {
                res.status(401).send('Unauthorized');
                return; // Terminate the middleware execution after sending the response
            }

            const { name, pass } = credentials;
            const user = await this.userService.verifyCredentials(name, pass);

            if (user == null) {
                res.status(401).send('Unauthorized');
                return; // Terminate the middleware execution after sending the response
            }

            // Attach user object to request for later use
            req.headers['X-LoggedIn-User'] = JSON.stringify(user);

            console.error('Authenticated User: ' + (req.headers['X-LoggedIn-User']).toString());

            // Call next() to continue the middleware chain
            next();
        } catch (err) {
            console.error('Error:' + err);
            // Call next() with an error to continue the middleware chain
            next(err);
        }
    }
}
