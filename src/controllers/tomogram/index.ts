import { Router} from "express";
import { uploadTomogramController } from './tomogram';
import { uploadFile } from "../../middlewares/multer";
import authentication from '../../middlewares/auth';

const router = Router();

router.post('/', authentication, uploadFile, uploadTomogramController);

export default router;