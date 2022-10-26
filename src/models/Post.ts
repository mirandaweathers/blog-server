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
            if(newPost.headerImage != '') {
                return newPost.title && newPost.content && newPost.headerImage;
            } else {
                return newPost.title && newPost.content;
            }
        }
    }

    static PrintPost(post:Post){

    }
}