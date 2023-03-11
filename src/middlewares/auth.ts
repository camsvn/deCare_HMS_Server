import { Router, Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import Locals from '../providers/Locals';
import {failResponse} from '../helpers/JSend';
import {IUserJWT} from '../interfaces/vendors/IRequest'

const router = Router();

export default router.use((req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.body.token || req.query.token || req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(403)
        .send(failResponse("A token is required for authentication"))
    }

    try {
        const decoded = jwt.verify(token, Locals.config().appSecret) as IUserJWT;
        req.user = decoded.username;
        req.user_id = decoded.user_id;

    } catch (e) {
        res.status(401)
        .json(failResponse("Invalid Token"))
    }
    return next();
})