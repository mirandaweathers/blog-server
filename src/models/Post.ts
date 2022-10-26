export class Post {
    static id:number = 0;
    postId:number = 0;
    createdDate:Date = new Date();
    title:string = '';
    content:string = '';
    userId:string = '';
    headerImage:string = '';
    lastUpdated:Date = new Date();

    // constructor(title:string, content:string, headerImage?:string) {
    //     this.postId = Post.id++;
    //     this.createdDate = new Date();
    //     this.title = title;
    //     this.content = content;
    //     this.userId = '';
    //     if(headerImage) this.headerImage = headerImage;
    //     this.lastUpdated = new Date();
    // }

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