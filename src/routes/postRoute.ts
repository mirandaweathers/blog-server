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

/**
 * take in JWT and return decoded JWT json object
 */
function parseJWT(token:any) {
    var base64Url = token.split('.')[1];
    var base64 = decodeURIComponent(atob(base64Url).split('').map((c) =>{
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(base64);
}

/**
 * GET /Posts
 * most recent first
 */
postRouter.get('/', (req, res, next) => {
    // sort posts in descending order based on time last updated (most recent first)
    postArray.sort((a,b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());

    // return list of sorted posts in postArray
    res.status(200).send(postArray.map(post => Post.PrintPost(post)));
});

/**
 * POST /Posts
 */
postRouter.post('/', (req, res, next) => {
    // get userId from JWT token
    let jwtObject = parseJWT(req.headers['authorization']!.replace('Bearer ', ''));
    // console.log(jwtObject);
    let userId = jwtObject.data.authUserId;
    // console.log(userId);

    if(Post.VerifyPost(req.body)) {
        let post = new Post();
        
        post = {
            postId: Post.id++,
            createdDate: new Date(),
            title: req.body.title,
            content: req.body.content,
            userId: userId,
            headerImage: req.body.headerImage ?? '',
            lastUpdated: new Date()
        }

        postArray.push(post);

        res.status(201).send(post)
    } else {
        res.status(400).send({message: 'error'})
    }
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