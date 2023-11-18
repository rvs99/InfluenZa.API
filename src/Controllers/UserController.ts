import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { UserService } from '../Services/Implementations/UserService';
import UserAccount from '../Entities/UserAccount';
import HttpStatusCodes, { StatusCodes } from 'http-status-codes';

@autoInjectable()
export class UserController {

    private userService: UserService

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const user = req['authenticatedUser'];
            const token = await this.userService.login(user?.userId, user?.role);
            res.status(StatusCodes.OK).json({ token });

        } catch (error) {

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error:' + error.message });

        }
    }

    async register(req: Request, res: Response): Promise<void> {
        try {

            const userAccount: UserAccount = JSON.parse(req.body.userAccount);

            const userDetails = await this.userService.registerUserAccountWithBasicDetails(userAccount);

            res.status(StatusCodes.CREATED).json(userDetails);

        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }

    async registerUserFromFacebook(req: Request, res: Response): Promise<void> {
        const access_token = req.body.token;
        const role = req.body.role;

        try {

            const userDetails = await this.userService.registerUserAccountFromFacebook(access_token, role);
            console.error("User Details: " + JSON.stringify(userDetails));
            res.status(StatusCodes.CREATED).json(userDetails);

        } catch (error) {
            console.error('User registration failed:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'User registration failed' });
        }
    }

    async getUser(req: Request, res: Response): Promise<void> {
        console.error("User Controller.getUser");
        const userId = req.params.userId;
        try {
            const userDetails = await this.userService.getUser(userId);
            console.error("Fetched user: " + JSON.stringify(userDetails));

            res.status(200).json(userDetails);
        }
        catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}

export default UserController;
