import { autoInjectable, container } from "tsyringe";
import { ContentManagementService } from "../Services/Implementations/ContentManagementService";
import { Request, Response } from 'express';
import { Content } from "../Entities/Content";
import { StatusCodes } from "http-status-codes";

@autoInjectable()
export class ContentController {

    private readonly contentManagementService: ContentManagementService

    constructor(contentManagementService: ContentManagementService) {
        this.contentManagementService = contentManagementService;
    }

    async createContent(req: Request, res: Response): Promise<void> {
        try {

            var content: Content | null = req.body.content;

            var userId = JSON.parse(req['X-LoggedIn-User']).userId;

            const createdContent = await this.contentManagementService.createContent(userId, content);

            if (createdContent) {
                res.status(200).json("Content created!");
            }
            else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Failed to create ccontent!");
            }
        } catch (error) {
            console.error('Failed to connect Facebook profile:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to connect Facebook profile' });
        }
    }
}