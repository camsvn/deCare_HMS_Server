import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import Locals from '../providers/Locals';
import { failResponse } from '../helpers/JSend';
import { IUserJWT } from '../interfaces/vendors/IRequest';

/**
 * Bearer-token guard. Reads `Authorization: Bearer <accessToken>` (also
 * `req.body.token` / `req.query.token` for backwards compatibility) and
 * puts `user` / `user_id` on the request. Always 401 on failure.
 */
export default function authentication(req: Request, res: Response, next: NextFunction) {
    const authHeader = (req.headers['authorization'] as string | undefined) || req.body?.token || req.query?.token;
    const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length).trim()
        : (typeof authHeader === 'string' ? authHeader : undefined);

    if (!token) {
        return res.status(401).json(failResponse("Authentication required"));
    }

    try {
        const decoded = jwt.verify(token, Locals.config().appSecret) as IUserJWT;
        if (decoded.token_type && decoded.token_type !== 'access') {
            return res.status(401).json(failResponse("Invalid or expired token"));
        }
        req.user = decoded.username;
        req.user_id = decoded.user_id;
        return next();
    } catch (e) {
        return res.status(401).json(failResponse("Invalid or expired token"));
    }
}
