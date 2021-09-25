import { Router, Request, Response } from "express";
import Log from '../middlewares/Log';
import {models} from '../providers/Database'

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({success: 'Route /api success'})
})

router.post('/login', async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;

        if(!(username && password)) {
            res.status(400).send({
                "status" : "fail",
                "data" : { "title" : "All inputs are required" }
            });
        }
        const user = await models.User?.findOne({attributes: ['id','username', 'password'],where: {Username: username }});
        res.status(200).json(user);

    } catch (e: any) {
        Log.error(e.message);
        res.status(500).json(e);
    }
    
})

export default router;