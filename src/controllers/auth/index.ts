import { Router} from "express";
import {getloginController, loginController} from './login'

const router = Router();

router.post('/login', loginController);
router.get('/login', getloginController);

export default router;