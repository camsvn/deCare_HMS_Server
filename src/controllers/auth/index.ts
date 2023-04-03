import { Router} from "express";
import {getloginController, loginController, getHealthCheckController} from './login'

const router = Router();

router.post('/login', loginController);
router.get('/login', getloginController);
router.get('/healthcheck', getHealthCheckController);

export default router;