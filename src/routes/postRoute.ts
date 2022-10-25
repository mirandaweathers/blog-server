import { json } from 'body-parser';
import express from 'express';
import { Post } from '../models/Post';
import jwt from 'jsonwebtoken';

let postRouter = express.Router();

let postArray:Post[] = [];

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
    // if authorized, create new post with title, content, headerImage(optional)
    // if unauthorized, 401 Unauthorized
    // if missing title/content, 406 Unacceptable
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