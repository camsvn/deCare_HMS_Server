import { Router} from "express";
import {getloginController, loginController, getHealthCheckController, refreshController} from './login'

const router = Router();

router.post('/login', loginController);
router.get('/login', getloginController);
router.post('/refresh', refreshController);
router.get('/healthcheck', getHealthCheckController);

export default router;