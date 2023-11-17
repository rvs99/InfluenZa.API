enum ContentState {
    DraftCreation = 'DraftCreation',
    DraftSubmitted = 'DraftSubmitted',
    EditorReview = 'EditorReview',
    ChangesRequestedByEditor = 'ChangesRequestedByEditor',
    DraftCorrection = 'DraftCorrection',
    EditorReReview = 'EditorReReview',
    ReviewerApproval = 'ReviewerApproval',
    ChangesRequestedByReviewer = 'ChangesRequestedByReviewer',
    FinalApproval = 'FinalApproval',
    Published = 'Published',
    Archived = 'Archived'
}

export default ContentState;
