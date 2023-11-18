import { autoInjectable } from "tsyringe";
import { DataRepository as DataRepository } from "./DataRepository";
import { Content } from "../../Entities/Content";

@autoInjectable()
export class ContentRepository {

    private readonly dataService: DataRepository;

    constructor(dataService: DataRepository) {
        this.dataService = dataService;
    }

    async create(newContent: Content): Promise<string> {
        return "001";
    }

    async get(contentId: string): Promise<Content> {
        const newContent = new Content('1', 'Sample Content', 'John Doe');
        newContent.items.push({ type: 'text', data: 'This is the text content.' });
        newContent.items.push({ type: 'video', data: 'video.mp4' });
        newContent.items.push({ type: 'image', data: 'image.jpg' });
        return newContent;
    }

    async getAll(userId: string): Promise<Content[]> {
        const newContent = new Content('1', 'Sample Content', 'John Doe');
        newContent.items.push({ type: 'text', data: 'This is the text content.' });
        newContent.items.push({ type: 'video', data: 'video.mp4' });
        newContent.items.push({ type: 'image', data: 'image.jpg' });
        return [newContent];
    }

    async update(contentId: string, updatedContent: Content): Promise<void> {

    }
}