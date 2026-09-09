import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

import Locals from '../../providers/Locals'
import Log from '../../middlewares/Log';
import {errorResponse,failResponse,successResponse} from '../../helpers/JSend'
import {IUserJWT} from '../../interfaces/vendors/IRequest'

import {userDB} from '../../providers/Database'

const signAccessToken = (userId: number, username: string) =>
    jwt.sign({ user_id: userId, username, token_type: "access" }, Locals.config().appSecret, { expiresIn: '2h' });

export const loginController = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;

        if(!(username && password)) {
            return res.status(400).send(failResponse("All inputs are required"));
        }
        // Note: the Sequelize connection is configured with `query: { raw: true }`
        // (see src/providers/Database.ts), so findOne returns a plain object here,
        // not a Model instance -- there is no .get() at runtime despite the typing.
        const user = await userDB.UserModel?.findOne({
            attributes: ['ID', 'Username', 'Password'],
            where: { Username: username }
        }) as unknown as { ID: number; Username: string; Password: string } | null | undefined;

        if (user && user.Password === password) {
            const userId = user.ID;
            const accessToken = signAccessToken(userId, username);
            const refreshToken = jwt.sign(
                { user_id: userId, username, token_type: "refresh" },
                Locals.config().appSecret + '_refresh',
                { expiresIn: '5 days' }
            );
            return res.status(200).json(successResponse({ id: userId, username, accessToken, refreshToken }));
        }
        res.status(404).json(failResponse("Invalid Credentials"));

    } catch (e: any) {
        Log.error(e.message);
        res.status(500).json(errorResponse("Internal Server Error", e.message));
    }

}

export const refreshController = async (req: Request, res: Response) => {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken || typeof refreshToken !== 'string') {
        return res.status(400).json(failResponse("refreshToken is required"));
    }
    try {
        const decoded = jwt.verify(refreshToken, Locals.config().appSecret + '_refresh') as IUserJWT;
        if (decoded.token_type !== 'refresh') throw new Error('wrong token type');
        return res.status(200).json(successResponse({ accessToken: signAccessToken(decoded.user_id, decoded.username) }));
    } catch (e) {
        return res.status(401).json(failResponse("Invalid or expired refresh token"));
    }
};

export const getloginController = async (req: Request, res: Response) => {
    res.json(successResponse('Route /auth/login success'));
}

export const getHealthCheckController = async (req: Request, res: Response) => {
    // Check if the request is coming from a valid IP address
    // const validIps = ['127.0.0.1', '::1'];
    // console.log(req.ip)
    // if (!validIps.includes(req.ip)) {
    //     return res.status(403).json(failResponse("Forbidden"));
    // }

    // // Check if the request includes a valid API key
    // const apiKey = req.query.api_key;
    // if (!apiKey || apiKey !== 'abc123') {
    //     return res.status(401).json(failResponse("Unauthorized"));
    // }

    res.status(200).json(successResponse({
        message: 'API is running!',
        uptime: Math.floor(process.uptime())
    }));
}