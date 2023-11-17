import { container, injectable } from "tsyringe";
import { FacebookService } from "../Services/Implementations/FacebookService";
import { Request, Response } from 'express';

@injectable()
export class FacebookController {

    constructor(private readonly facebookService: FacebookService) {
        this.facebookService = container.resolve(FacebookService);
    }

    async connectProfile(req: Request, res: Response): Promise<void> {
        try {
            const token = req.body.facebookToken;
            const userDetails = JSON.parse(req.headers['userDetails'] as string);
            console.error("header user : " + JSON.stringify(userDetails));
            const connected = await this.facebookService.connectProfile(userDetails.userId, userDetails.role, token);

            if (connected) {
                res.status(200).json("Facebook profile attached to Influencer!");
            }
            else {
                res.status(500).json("Failed to attach Facebook profile to Influencer!");
            }
        } catch (error) {
            console.error('Failed to connect Facebook profile:', error);
            res.status(500).json({ error: 'Failed to connect Facebook profile' });
        }
    }
}