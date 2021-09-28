import { Router, Request, Response } from "express";

import {successResponse} from '../common/JSend'
import {loginController} from '../controllers/auth'

export const apiRouter = Router();
export const authRouter = Router();

apiRouter.get('/', (req: Request, res: Response) => {
    res.json(successResponse('Route /api success'))
})

authRouter.post('/login', loginController)