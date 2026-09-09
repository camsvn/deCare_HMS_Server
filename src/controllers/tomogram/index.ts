import { Router} from "express";
import { uploadTomogramController, listTomogramsController } from './tomogram';
import { uploadFile } from "../../middlewares/multer";
import authentication from '../../middlewares/auth';

const router = Router();

router.get('/', authentication, listTomogramsController);
router.post('/', authentication, uploadFile, uploadTomogramController);

export default router;