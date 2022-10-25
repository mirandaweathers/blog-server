export class Post {
    postId:number = 0;
    createdDate:Date = new Date();
    title:string = '';
    content:string = '';
    userId:string = '';
    headerImage:string = '';
    lastUpdated:Date = new Date();

    constructor(title:string, content:string, headerImage:string) {

    }

    static PrintPost(post:Post){

    }
}