import { Router, Request, Response } from "express";

import authRouter from '../controllers/auth'
import indexRouter from '../controllers'

const router = Router();

router.use('/login', authRouter);

router.use('/', indexRouter);


export default router; 