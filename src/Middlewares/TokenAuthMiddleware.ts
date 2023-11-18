import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../Services/Implementations/UserService';
import path from 'path';
import { autoInjectable } from 'tsyringe';
const fs = require('fs');

@autoInjectable()
export class TokenAuthMiddleware {

    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public async authenticate(req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const token: any = req.headers['authorization'];

            if (token == null) {
                return res.status(401).send('Unauthorized');
            }

            //ToDo: get public key from KeyVault
            const publicKEY = fs.readFileSync(path.join(__dirname, 'public.key'), 'utf8');

            const i = 'InfluenZa';          // Issuer 
            const s = 'rvs@influenza.com';        // Subject 
            const a = 'http://influenza.com'; // Audience

            const verifyOptions = {
                issuer: i,
                subject: s,
                audience: a,
                expiresIn: "12h",
                algorithm: ["RS512"]
            };

            console.error("Token recieved: " + token);

            const decoded: any = jwt.verify(token, publicKEY, verifyOptions);

            const userDetails = JSON.parse(JSON.stringify(decoded));

            console.error("User from Token: " + JSON.stringify(decoded));

            const user = await this.userService.getUser(userDetails?.userId);

            if (user == null) {
                return res.status(401).send('Unauthorized');
            }

            // Attach user object to request for later use
            req.headers['X-LoggedIn-User'] = JSON.stringify(user);

            console.error('Authenticated User: ' + (req.headers['X-LoggedIn-User']).toString());

            // Call next() to continue the middleware chain
            next();
        }
        catch (err) {
            console.error("Error:" + err);
            // Call next() with an error to continue the middleware chain
            next(err);
        }
    }
};
