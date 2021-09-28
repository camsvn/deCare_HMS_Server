import { Router} from "express";
import {loginController} from './login'

const router = Router();

export default router.post('/', loginController);