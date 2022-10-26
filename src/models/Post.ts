export class Post {
    static id:number = 0;
    postId:number = 0;
    createdDate:Date = new Date();
    title:string = '';
    content:string = '';
    userId:string = '';
    headerImage:string = '';
    lastUpdated:Date = new Date();

    static VerifyPost(newPost:any) {
        if(newPost.title != '' && newPost.content != '') {
            return newPost.title && newPost.content;
        }
    }

    static PrintPost(post:Post){
        return {
            postId: post.postId,
            createdDate: post.createdDate,
            title: post.title,
            content: post.content,
            userId: post.userId,
            headerImage: post.headerImage,
            lastUpdated: post.lastUpdated
        }
    }
}