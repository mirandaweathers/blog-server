import { json } from 'body-parser';
import express from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

let userRouter = express.Router();

let userArray:User[] = [];

/**
 * GET /Users/
 * display JSON array of users currently in memory, hiding passwords
 * if no users have been added, returns blank array
 */
userRouter.get('/', (req, res, next) => {
    if(req.headers['authorization']) {
        try {
            let authToken = jwt.verify(req.headers['authorization'].replace('Bearer ',''), 'k3y$tr1n9');
        
            if(authToken) {
                res.status(200).send(userArray.map(user => User.PrintUser(user)));
            } else {
                res.status(401).send({message:'Error - Unauthorized - Invalid Token'});
            }
        } catch(e) {
        res.status(401).send({message:'Error - Unauthorized - Invalid Token'});
        } 
    } else {
        res.status(401).send({message:'Error - Unauthorized - Invalid Token'});
    }
});

/**
 * POST /Users/
 * ensure all user info is present - if not, respond with 406 Unacceptable + message
 * ensure no 2 users share same user ID - if so, respond with 409 Conflict + message
 * success - push new user to array and respond with 201 created
 */
userRouter.post('/', (req, res, next) => {
    let userExists = userArray.some(u => u.userId === req.body.userId);

    if(User.VerifyUser(req.body) && !userExists) {
        let user = new User();
        Object.assign(user,req.body);

        // encrypt password
        bcrypt.hash(user.password, 10, function(err, hash) {
            user.password = hash;
            userArray.push(user);
            res.status(201).send(User.PrintUser(user));
        });
    } else {
        switch(userExists) {
            case true: res.status(409).send({message:'Error: Conflict - userId already exists'});
                break;
            default: res.status(406).send({message:'Error: Unacceptable - user information incomplete/invalid'});
        }
    }
});

/**
 * GET /Users/:userId
 * get userId from request URL
 * if found, return user object (password hidden) + 200 status
 * if not found, return 404 status + error message
 */
userRouter.get('/:userId', (req, res, next) => {
    let userId = req.params.userId;
    let user = userArray.find(u => u.userId == userId);
    if(user) {
        res.status(200).send({
            userId:user.userId, 
            firstName:user.firstName, 
            lastName:user.lastName, 
            emailAddress:user.emailAddress});
    } else {
        res.status(404).send({message: 'Error: User Not Found'})
    }
});

/**
 * PATCH /Users/:userId
 * given userId in request URL, update corresponding user with req body values 
 * (except for any change to userId)
 * if user not found, respond with 404 status + error message
 * if user exists, update all necessary fields and respond with 200 status
 * plus updated user fields
 */
userRouter.patch('/:userId', (req, res, next) => {
    let userId = req.params.userId;
    let user = userArray.find(u => u.userId == userId);

    if(user) {
        if(req.body.firstName)
            user.firstName = req.body.firstName;
        if(req.body.lastName)
            user.lastName = req.body.lastName;
        if(req.body.emailAddress)
            user.emailAddress = req.body.emailAddress;
        if(req.body.password)
            user.password = req.body.password;

        res.status(200).send({
            userId:user.userId, 
            firstName:user.firstName, 
            lastName:user.lastName, 
            emailAddress:user.emailAddress});
    } else {
        res.status(404).send({message: 'Error: User Not Found'})
    }
});

/**
 * DELETE /Users/:userId
 * given userId in request URL, remove user from user array in memory
 * if user exists, delete and respond with 204 status
 * if user doesn't exist, respond with 404 status + error message
 */
userRouter.delete('/:userId', (req, res, next) => {
    let userId = req.params.userId;
    let user = userArray.find(u => u.userId == userId);

    if(user) {
        userArray.splice(userArray.indexOf(user), 1);
        res.status(204).send();
    } else {
        res.status(404).send({message: 'Error: User Not Found'})
    }
});

/**
 * GET /Users/:userId/:password
 * return valid JSON Web Token if username and password are valid
 * return 401 Unauthroized otherwise
 */
userRouter.get('/:userId/:password', (req, res, next) => {
    let userId = req.params.userId;
    let user = userArray.find(u => u.userId == userId);
    
    // verify username exists
    if(user) {
        // compare given pw with stored encrypted pw
        bcrypt.compare(req.params.password, user.password, function(err, result) {
            if(result == true) {
                // generate JWT
                let token = jwt.sign({
                    data:'Authorized'
                }, 'k3y$tr1n9');

                res.send({token:token});
            } else {
                res.status(401).send({message: 'Error: Invalid Username/Password Combination'});
            }
        });
    } else {
        res.status(401).send({message: 'Error: Invalid Username/Password Combination'});
    }
});

export { userRouter };