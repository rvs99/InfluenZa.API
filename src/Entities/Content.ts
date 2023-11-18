import ContentState from "./ContentState";

export class Content {
    id: string;
    title: string;
    items: ContentItem[];
    state: ContentState;
    author: string;
    editor: string;
    reviewer: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, title: string, author: string) {
        this.id = id;
        this.title = title;
        this.items = [];
        this.state = ContentState.DraftCreation;
        this.author = author;
        this.editor = '';
        this.reviewer = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

interface ContentItem {
    type: string;
    data: any; // Store data specific to the content type
}