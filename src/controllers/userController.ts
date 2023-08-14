import { Request, Response } from 'express';
import { FacebookService } from '../services/facebookService';

export class UserController {
    private facebookService: FacebookService;

    constructor(facebookService: FacebookService) {
        this.facebookService = facebookService;
    }

    async registerUserFromFacebook(req: Request, res: Response): Promise<void> {
        const access_token = req.body.token;
        try {
            if (this) {
                const userDetails = await this.facebookService.fetchUserAndSave(access_token);
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
}

export default UserController;
