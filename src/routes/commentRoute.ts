import { json } from 'body-parser';
import express from 'express';
import { Comment } from '../models/Comment';
import jwt from 'jsonwebtoken';

let commentRouter = express.Router();

let commentArray:Comment[] = [];

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
});

/**
 * DELETE /Comments
 */
 commentRouter.delete('/:postId/:commentId', (req, res, next) => {
    // if authorized, delete comment + 204 removed
    // if unauthorized, 401 Unauthorized
    // if comment/post not found, 404 Not Found
});