import { Router, Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import Locals from '../providers/Locals';
import {failResponse} from '../common/JSend'

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(!token) {
        return res.status(403)
        .send(failResponse("A token is required for authentication"))
    }

    try {
        const decoded = jwt.verify(token, Locals.config().appSecret);
        req.user = decoded;

    } catch (e) {
        res.status(401)
        .json(failResponse("Invalid Token"))
    }
    return next();
}

export {verifyToken};