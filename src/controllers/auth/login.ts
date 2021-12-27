import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

import Locals from '../../providers/Locals'
import Log from '../../middlewares/Log';
import {errorResponse,failResponse,successResponse} from '../../helpers/JSend'

import {IUserInstance} from '../../models'
import {userDB} from '../../providers/Database'

export const loginController = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;

        if(!(username && password)) {
            return res.status(400).send(failResponse("All inputs are required"));
        }
        const user: IUserInstance = await userDB.UserModel?.findOne({
            attributes: ['id','username', 'password'],
            where: {Username: username }
        });

        if (user && user.password === password) {            
            const token = jwt.sign(
                {user_id: user.id, username},
                Locals.config().appSecret,
                {expiresIn: '2h'}
            );

            return res.status(200).json(successResponse({
                id: user.id,
                username: user.username,
                accessToken: token 
            }));
        } 
        res.status(400).json(failResponse("Invalid Credentials"));
        
    } catch (e: any) {
        Log.error(e.message);
        res.status(500).json(errorResponse("Internal Server Error", e.message));
    }
    
}

export const getloginController = async (req: Request, res: Response) => {
    res.json(successResponse('Route /auth/login success'));
}