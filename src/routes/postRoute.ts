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
        res.status(406).send({status: '406', message: 'Error - Missing post title or content'})
    }
});

/**
 * GET /Posts/:postId
 */
postRouter.get('/:postId', (req, res, next) => {
    let postId = parseInt(req.params.postId);
    let post = postArray.find(p => p.postId == postId);
    if(post) {
        res.status(200).send(post);
    } else {
        res.status(404).send({status: '404', message: 'Error - Post Not Found'})
    }
});

/**
 * PATCH /Posts/:postId
 */
 postRouter.patch('/:postId', (req, res, next) => {
    // verify if post exists
    let postId = parseInt(req.params.postId);
    let post = postArray.find(p => p.postId == postId);

    if(post) {
        // verify if userId's match
        let postUserId = post?.userId;
        let jwtObject = parseJWT(req.headers['authorization']!.replace('Bearer ', ''));
        let currUserId = jwtObject.data.authUserId;

        // if match, update post; if no match, 401 Unauthorized
        if (postUserId == currUserId) {
            if(req.body.title)
                post.title = req.body.title;
            if(req.body.content)
                post.content = req.body.content;
            if(req.body.headerImage)
                post.headerImage = req.body.headerImage;

            res.status(200).send(post);
        } else {
            res.status(401).send({status: '401', message: 'Error - Unauthorized to edit this post'})
        }
    } else {
        res.status(404).send({status: '404', message: 'Error - Post Not Found'})
    }
});

/**
 * DELETE /Posts/:postId
 */
 postRouter.delete('/:postId', (req, res, next) => {
    // verify if post exists
    let postId = parseInt(req.params.postId);
    let post = postArray.find(p => p.postId == postId);

    if(post) {
        // verify if userId's match
        let postUserId = post?.userId;
        let jwtObject = parseJWT(req.headers['authorization']!.replace('Bearer ', ''));
        let currUserId = jwtObject.data.authUserId;

        // if match, delete post; if no match, 401 Unauthorized
        if (postUserId == currUserId) {
            postArray.splice(postArray.indexOf(post), 1);
            res.status(204).send();
        } else {
            res.status(401).send({status: '401', message: 'Error - Unauthorized to delete this post'})
        }
    } else {
        res.status(404).send({status: '404', message: 'Error - Post Not Found'})
    }
});

/**
 * GET /Posts/User/:userId
 * return list of all posts by given userId, most recent first
 * if none found, status 404 No Posts Found
 */
 postRouter.get('/User/:userId', (req, res, next) => {
    let postUserId = req.params.userId;
    let posts = postArray.filter(p => p.userId == postUserId);
    if(posts.length > 0) {
        res.status(200).send(posts.sort((a,b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()));
    } else {
        res.status(404).send({status: '404', message: 'No Posts Found'})
    }
});

export { postRouter };