import { Router, Request, Response } from "express";

import authRouter from '../controllers/auth'
import tomogramRouter from '../controllers/tomogram'
import indexRouter from '../controllers'

const router = Router();

router.use('/auth', authRouter);
router.use('/tomogram', tomogramRouter);

router.use('/', indexRouter);


export default router; 