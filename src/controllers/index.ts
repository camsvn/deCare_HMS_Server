import { Router, Request, Response } from "express";
import {successResponse} from '../helpers/JSend'
import authentication from '../middlewares/auth'

const router = Router();

router.use('/', authentication);

export default router.get('/', (req: Request, res: Response) => {
    res.json(successResponse('Route /api success'))
});