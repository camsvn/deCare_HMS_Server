import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

import Locals from '../../providers/Locals'
import Log from '../../middlewares/Log';
import {errorResponse,failResponse,successResponse} from '../../helpers/JSend'

import {userDB} from '../../providers/Database'

export const loginController = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;

        if(!(username && password)) {
            return res.status(400).send(failResponse("All inputs are required"));
        }
        const user = await userDB.UserModel?.findOne({
            attributes: ['id','username', 'password'],
            where: {Username: username }
        });

        if (user && user.password === password) {            
            const accessToken = jwt.sign(
                {user_id: user.id, username, token_type: "access"},
                Locals.config().appSecret,
                {expiresIn: '2h'}
            );

            const refreshToken = jwt.sign(
                {user_id: user.id, username, token_type: "refresh"},
                Locals.config().appSecret + '_refresh',
                {expiresIn: '5 days'}
            );

            return res.status(200).json(successResponse({
                id: user.id,
                username: user.username,
                accessToken,
                refreshToken
            }));
        } 
        res.status(404).json(failResponse("Invalid Credentials"));
        
    } catch (e: any) {
        Log.error(e.message);
        res.status(500).json(errorResponse("Internal Server Error", e.message));
    }
    
}

export const getloginController = async (req: Request, res: Response) => {
    res.json(successResponse('Route /auth/login success'));
}

export const getHealthCheckController = async (req: Request, res: Response) => {
    // Check if the request is coming from a valid IP address
    const validIps = ['127.0.0.1', '::1'];
    if (!validIps.includes(req.ip)) {
        return res.status(403).json(failResponse("Forbidden"));
    }

    // Check if the request includes a valid API key
    const apiKey = req.query.api_key;
    if (!apiKey || apiKey !== 'abc123') {
        return res.status(401).json(failResponse("Unauthorized"));
    }

    res.status(200).json(successResponse({
        message: 'API is running!',
        uptime: Math.floor(process.uptime())
    }));
}