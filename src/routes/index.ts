import { Router, Request, Response } from "express";

import authRouter from '../controllers/auth'
import tomogramRouter from '../controllers/tomogram'
import indexRouter from '../controllers'
import { successResponse } from "../helpers/JSend";

const router = Router();

router.use('/auth', authRouter);
router.use('/tomogram', tomogramRouter);
router.use('/test', indexRouter);
router.get('/', (req, res) => {
  res.json(successResponse('Route /api works'))
})



export default router; 