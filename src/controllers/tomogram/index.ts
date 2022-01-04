import { Router} from "express";
import { uploadTomogramController } from './tomogram';
import { uploadFile } from "../../middlewares/multer";

const router = Router();

router.post('/', uploadFile, uploadTomogramController);

export default router;