import { Router} from "express";
import { getOPRegisterController } from './opRegister';
import authentication from '../../middlewares/auth';

const router = Router();

router.get('/', authentication, getOPRegisterController);

export default router;