import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { container } from '../ioc';
import { UserService } from '../Services/Implementations/UserService';

@injectable()
export class UserController {

    constructor(private readonly userService: UserService) {
        this.userService = container.resolve(UserService);
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            console.error("Login started...");
            const user = req['authenticatedUser'];
            const userService = container.resolve(UserService);
            const token = await userService.login(user?.userId, user?.role);
            console.error("Token returned");
            res.status(200).json({ token });

        } catch (error) {

            res.status(500).json({ message: 'Internal server error:' + error.message });

        }
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            // ... same implementation as before ...
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async registerUserFromFacebook(req: Request, res: Response): Promise<void> {
        const access_token = req.body.token;
        const role = req.body.role;

        try {
            if (this) {
                const userDetails = await this.userService.registerUserAccountFromFacebook(access_token, role);
                console.error("User Details: " + JSON.stringify(userDetails));
                res.status(201).json(userDetails);
            }
            else {
                console.error('User registration failed due to initialization');
                res.status(500).json({ error: 'User registration failed due to initialization' });
            }
        } catch (error) {
            console.error('User registration failed:', error);
            res.status(500).json({ error: 'User registration failed' });
        }
    }

    async getUser(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        try {
            const userDetails = await this.userService.getUser(userId);
            console.error("Fetched user: " + JSON.stringify(userDetails));

            res.status(200).json(userDetails);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default UserController;
