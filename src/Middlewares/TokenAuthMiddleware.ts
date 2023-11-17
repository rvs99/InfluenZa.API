import { Request, Response, NextFunction } from 'express';
import { container } from '../ioc';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserService } from '../Services/Implementations/UserService';
import path from 'path';
const fs = require('fs');

export const TokenAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.error("tokenAuthMiddleware working");

        const token: any = req.headers['authorization'];

        if (token == null) {
            return res.status(401).send('Unauthorized');
        }

        console.error("Token recieved: " + token);

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

        const decoded: any = jwt.verify(token, publicKEY, verifyOptions);

        const userDetails = JSON.parse(JSON.stringify(decoded));

        const userService = container.resolve(UserService);
        const user = await userService.getUser(userDetails?.userId);

        req.headers["userDetails"] = JSON.stringify(user);

        console.error("header user: " + req.headers["userDetails"])

        if (user == null) {
            return res.status(401).send('Unauthorized');
        }

        // Attach user object to request for later use
        req['loggedInUser'] = user;

        // Call next() to continue the middleware chain
        next();
    }
    catch (err) {
        console.error("Error:" + err);
        // Call next() with an error to continue the middleware chain
        next(err);
    }
};
