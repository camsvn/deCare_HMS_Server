import { Router, Request, Response } from "express";
import {successResponse} from '../helpers/JSend'
import authentication from '../middlewares/auth'
import { ITomogramInstance, IUserInstance } from "../models";
import {modelsCollection} from '../providers/Database';

const router = Router();

router.use('/', authentication);

router.get('/', (req: Request, res: Response) => {
    res.json(successResponse('Route /api success'))
});

router.get('/test', async (req: Request, res) => {
    try {
        const tomo: ITomogramInstance = await modelsCollection.main.TomogramTypeModel?.findAll();
        const user: IUserInstance = await modelsCollection.user.UserModel?.findAll();
        
        res.json({tomo:{...tomo}, user:{...user}});
        
    } catch (error) {
        
    }
});

export default router;