import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const key = process.env.JWTKEY!.toString();

let authRouter = express.Router();

authRouter.use('/', (req, res, next) => {
    let routes = [
        {
            method: 'GET',
            url: '/Users'
        },
        {
            method: 'PATCH',
            url: '/Users'
        },
        {
            method: 'DELETE',
            url: '/Users'
        },
        {
            method: 'POST',
            url: '/Posts'
        },
        {
            method: 'PATCH',
            url: '/Posts'
        },
        {
            method: 'DELETE',
            url: '/Posts'
        },
        {
            method: 'POST',
            url: '/Comments'
        },
        {
            method: 'DELETE',
            url: '/Comments'
        }
    ];

    let cont = true;
    let regex = '^/[^/]+/[^/]+[a-zA-Z0-9]$';

    for (let route of routes) {
        if (req.url.includes(route.url) && req.method == route.method) {
            if (req.headers['authorization']) {
                try {
                    let verifiedToken = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), key);
                    if (verifiedToken) {
                        continue;
                    }
                    else {
                        cont = false;
                        break;
                    }
                } catch {
                    cont = false;
                    break;
                }
            } else {
                // if route is for generating token (login), let it happen
                if (/^\/[^/]+\/[^/]+\/[^/]+[a-zA-Z0-9]$/.test(req.url)) {
                    cont = true;
                    break;
                } else {
                    cont = false;
                    break;
                }
            }
        }
    }
    if(cont)
       next();
    else
    {
        res.status(401).send({message:'401 - Unauthorized'});
    }
    
});
export { authRouter };