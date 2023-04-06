import { Router} from "express";
import { getOPRegisterController } from './opRegister';
import authentication from '../../middlewares/auth';

const router = Router();

// router.get('/', authentication, getOPRegisterController);
router.get('/', getOPRegisterController);

export default router;