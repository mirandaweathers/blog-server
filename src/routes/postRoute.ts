import { json } from 'body-parser';
import express from 'express';
import { Post } from '../models/Post';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { userRouter } from './userRoute';
import dotenv from 'dotenv';
dotenv.config();
const key = process.env.JWTKEY!.toString();

let postRouter = express.Router();

let postArray:Post[] = [];

// function parseJWT(token:string|JwtPayload) {
//     var baseUrl = token.split(',')[1];
//     var base = decodeURIComponent(atob(baseUrl).split('').map((c) =>{
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));
//     return base;
// }

/**
 * GET /Posts
 * most recent first
 */
postRouter.get('/', (req, res, next) => {
    res.status(200).send(postArray.map(post => Post.PrintPost(post)));
});

/**
 * POST /Posts
 */
postRouter.post('/', (req, res, next) => {
    if(Post.VerifyPost(req.body)) {
        let post = new Post();
        post = {
            postId: Post.id++,
            createdDate: new Date(),
            title: req.body.title,
            content: req.body.content,
            userId: 'idk yet',
            headerImage: req.body.headerImage ?? '',
            lastUpdated: new Date()
        }
        res.status(201).send({message: 'post created'})
    } else {
        res.status(400).send({message: 'error'})
    }

    // // check for authorization header
    // if(req.headers['authorization']) {
    //     try {
    //         let authToken = jwt.verify(req.headers['authorization'].replace('Bearer ',''), key);
        
    //         // validate token
    //         if(authToken) {
    //             // get userId from authToken
    //             let userId = parseJWT(authToken);
    //             console.log(userId);

    //             // create new post with title, content, and optional headerImage
    //             if(Post.VerifyPost(req.body)) {
    //                 let post = new Post();
    //                 post = {
    //                     postId: Post.id++,
    //                     createdDate: new Date(),
    //                     title: req.body.title,
    //                     content: req.body.content,
    //                     userId: userId,
    //                     headerImage: req.body.headerImage ?? '',
    //                     lastUpdated: new Date()
    //                 }
    //             }
    //             // if missing title or content, 406 Unacceptable
    //         } else {
    //             res.status(401).send({message:'Error - Unauthorized - Invalid Token'});
    //         }
    //     } catch(e) {
    //     res.status(401).send({message:'Error - Unauthorized - Invalid Token'});
    //     } 
    // } else {
    //     res.status(401).send({message:'Error - Unauthorized - Invalid Token'});
    // }
});

/**
 * GET /Posts/:postId
 */
postRouter.get('/:postId', (req, res, next) => {

});

/**
 * PATCH /Posts/:postId
 */
 postRouter.patch('/:postId', (req, res, next) => {

});

/**
 * DELETE /Posts/:postId
 */
 postRouter.delete('/:postId', (req, res, next) => {

});

/**
 * GET /Posts/User/:userId
 */
 postRouter.get('/User/:userId', (req, res, next) => {

});

export { postRouter };