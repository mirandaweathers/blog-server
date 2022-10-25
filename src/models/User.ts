export class User {
    userId:string = "";
    firstName:string = "";
    lastName:string = "";
    emailAddress:string = "";
    password:string = "";

    static VerifyUser(newUser:any) {
        if(newUser.emailAddress != '' && /.+@.+\..+/.test(newUser.emailAddress) == true) {
            return newUser.userId && newUser.firstName && newUser.lastName && newUser.emailAddress && newUser.password;
        }
    }

    static PrintUser(user:User) {
        return {
            userId: user.userId, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            emailAddress: user.emailAddress
        };
    }
}