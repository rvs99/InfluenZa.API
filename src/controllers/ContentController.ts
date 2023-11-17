import { container, injectable } from "tsyringe";
import { ContentManagementService } from "../Services/Implementations/ContentManagementService";
import { Request, Response } from 'express';
import { Content } from "../Entities/Content";

@injectable()
export class ContentController {

    constructor(private readonly contentManagementService: ContentManagementService) {
        this.contentManagementService = container.resolve(ContentManagementService);
    }

    async createContent(req: Request, res: Response): Promise<void> {
        try {

            var content: Content | null = req.body.content;

            const createdContent = await this.contentManagementService.createContent(content);

            if (createdContent) {
                res.status(200).json("Content created!");
            }
            else {
                res.status(500).json("Failed to create ccontent!");
            }
        } catch (error) {
            console.error('Failed to connect Facebook profile:', error);
            res.status(500).json({ error: 'Failed to connect Facebook profile' });
        }
    }
}