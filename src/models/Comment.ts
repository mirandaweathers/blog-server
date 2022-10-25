export class Comment {
    commentId:number = 0;
    comment:string = '';
    userId:string = '';
    postId:number = 0;
    commentDate:Date = new Date();

    constructor(comment:string) {

    }

    static PrintComment(comment:Comment) {

    }
}