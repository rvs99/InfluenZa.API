import { injectable } from "tsyringe";
import { ContentRepository } from "../../Repositories/Implementations/ContentRepository";
import { Content } from "../../Entities/Content";
import ContentState from "../../Entities/ContentState";

@injectable()
export class ContentManagementService {

    constructor(private readonly contentRepo: ContentRepository) { }

    async createContent(newContent: Content) {
        try {

            newContent.state = ContentState.DraftCreation;
            newContent.author = req['loggedInUser'].userId;

            newContent.createdAt = new Date(Date.now());
            newContent.state = ContentState.DraftCreation;
            const createdId = await this.contentRepo.create(newContent);

            if (createdId != null)
                this.moveToNextState(newContent.id);

            return createdId;
        } catch (error) {
            throw new Error("Failed to create content: " + error.message);
        }
    }

    async approveContent(contentId: string) {
        // Placeholder: Actual logic to approve content
        try {
            const contentToApprove = await this.contentRepo.get(contentId);

            if (!contentToApprove) {
                throw new Error("Content not found");
            }

            // Placeholder: Perform approval logic
            contentToApprove.state = ContentState.ReviewerApproval;
            contentToApprove.reviewer = "John Reviewer";

            // Placeholder: Save the updated content
            await this.contentRepo.update(contentId, contentToApprove);

            return contentToApprove;
        } catch (error) {
            throw new Error("Failed to approve content: " + error.message);
        }
    }

    async requestChangesByEditor(contentId: string) {
        // Placeholder: Actual logic to request changes by editor
        // Similar to the approveContent method, with necessary changes
    }

    async makeCorrections(contentId: string, corrections: string) {
        // Placeholder: Actual logic to make corrections
        // Similar to the approveContent method, with necessary changes
    }

    async reReviewByEditor(contentId: string) {
        // Placeholder: Actual logic to re-review by editor
        // Similar to the approveContent method, with necessary changes
    }

    async requestChangesByReviewer(contentId: string) {
        // Placeholder: Actual logic to request changes by reviewer
        // Similar to the approveContent method, with necessary changes
    }

    async finalApproval(contentId: string) {
        // Placeholder: Actual logic for final approval
        // Similar to the approveContent method, with necessary changes
    }

    async publishContent(contentId: string) {
        // Placeholder: Actual logic to publish content
        // Similar to the approveContent method, with necessary changes
    }

    async archiveContent(contentId: string) {
        // Placeholder: Actual logic to archive content
        // Similar to the approveContent method, with necessary changes
    }

    async submitForReview(contentId: string) {
        // Placeholder: Actual logic to archive content
        // Similar to the approveContent method, with necessary changes
    }

    async moveToNextState(contentId: string) {
        const content = await this.contentRepo.get(contentId);

        if (!content) {
            throw new Error("Content not found");
        }

        switch (content.state) {
            case ContentState.DraftCreation:
                await this.submitForReview(contentId);
                break;
            case ContentState.DraftSubmitted:
                await this.approveContent(contentId);
                break;
            case ContentState.EditorReview:
                await this.requestChangesByEditor(contentId);
                break;
            case ContentState.ChangesRequestedByEditor:
                await this.makeCorrections(contentId, "Corrections made.");
                break;
            case ContentState.DraftCorrection:
                await this.reReviewByEditor(contentId);
                break;
            case ContentState.EditorReReview:
                await this.requestChangesByReviewer(contentId);
                break;
            case ContentState.ChangesRequestedByReviewer:
                await this.makeCorrections(contentId, "More corrections made.");
                break;
            case ContentState.ReviewerApproval:
                await this.finalApproval(contentId);
                break;
            case ContentState.FinalApproval:
                await this.publishContent(contentId);
                break;
            case ContentState.Published:
                await this.archiveContent(contentId);
                break;
            default:
                throw new Error("Invalid content state");
        }
    }
}
