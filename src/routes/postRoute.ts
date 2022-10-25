import { json } from 'body-parser';
import express from 'express';
import { Post } from '../models/Post';
import jwt from 'jsonwebtoken';

let postRouter = express.Router();

let postArray:Post[] = [];



export { postRouter };