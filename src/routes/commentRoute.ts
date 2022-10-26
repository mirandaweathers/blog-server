import { json } from 'body-parser';
import express from 'express';
import { Comment } from '../models/Comment';
import jwt from 'jsonwebtoken';
import { postArray } from './postRoute';
import dotenv from 'dotenv';
dotenv.config();
const key = process.env.JWTKEY!.toString();

let commentRouter = express.Router();

let commentArray:Comment[] = [];

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
 * GET /Comments
 * most recent first
 */
commentRouter.get('/:postId', (req, res, next) => {
    res.status(200).send(commentArray.map(comment => Comment.PrintComment(comment)));
});

/**
 * POST /Comments
 */
commentRouter.post('/:postId', (req, res, next) => {
    // if authorized, create new comment
    // if unauthorized, 401 Unauthorized
    // if post not found, 404 Not Found
    let jwtObject = parseJWT(req.headers['authorization']!.replace('Bearer ', ''));
    let userId = jwtObject.data.authUserId;

    if(postArray.find(p => p.postId == parseInt(req.params.postId))) {
        if(Comment.VerifyComment(req.body)) {
            let comment = new Comment();
            comment = {
                commentId: Comment.id++,
                comment: req.body.comment,
                userId: userId,
                postId: parseInt(req.params.postId),
                commentDate: new Date()
            }
            commentArray.push(comment);
            res.status(201).send(comment);
        } else {
            res.status(400).send({status: '401', message: 'Error - Invalid comment'});
        }
    } else {
        res.status(404).send({status: '404', message: 'Error - Post not found'});
    }
});

/**
 * DELETE /Comments
 * if authorized, delete comment + 204 removed
 * if unauthorized, 401 Unauthorized
 * if comment/post not found, 404 Not Found
 */
 commentRouter.delete('/:postId/:commentId', (req, res, next) => {
    let jwtObject = parseJWT(req.headers['authorization']!.replace('Bearer ', ''));
    let userId = jwtObject.data.authUserId;
    let comment = commentArray.find(c => c.commentId == parseInt(req.params.commentId));

    if(postArray.find(p => p.postId == parseInt(req.params.postId))) {
        if(comment) {
            let commentUserId = comment?.userId;
            if (commentUserId == userId) {
                commentArray.splice(commentArray.indexOf(comment),1);
                res.status(204).send();
            } else {
                res.status(401).send({status: '401', message: 'Error - Unauthorized to delete this comment'});
            }
        } else {
            res.status(404).send({status: '404', message: 'Error - Comment not found'});
        }
    } else {
        res.status(404).send({status: '404', message: 'Error - Post not found'});
    }
});

export { commentRouter };