import { Router} from "express";
import { getOPRegisterController } from './opRegister';

const router = Router();

router.get('/', getOPRegisterController);

export default router;