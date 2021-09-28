import { Router, Request, Response } from "express";

import authRouter from '../controllers/auth'
import indexRouter from '../controllers'

const router = Router();

router.use('/', indexRouter)

router.use('/login', authRouter);

export default router; 