export class Comment {
    static id:number = 0;
    commentId:number = 0;
    comment:string = '';
    userId:string = '';
    postId:number = 0;
    commentDate:Date = new Date();

    static VerifyComment(newComment:Comment) {
        if(newComment.comment != '')
            return newComment.comment;
    }

    static PrintComment(comment:Comment) {
        return {
            commentId: comment.commentId,
            comment: comment.comment,
            userId: comment.userId,
            postId: comment.postId,
            commentDate: comment.commentDate
        }
    }
}