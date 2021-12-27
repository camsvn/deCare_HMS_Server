import { Router} from "express";
import {getloginController, loginController, uploadTomogramController} from './tomogram';
import { uploadFile } from "../../middlewares/multer";

// import multer from 'multer';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, './uploads/')
//   },
  
//   filename: function (req: any, file: any, cb: any) {
//       cb(null, file.originalname)
//   }
// });

// const fileFilter = (req: any,file: any,cb: any) => {
//   if (file.mimetype === "image/jpg"  || 
//      file.mimetype ==="image/jpeg"  || 
//      file.mimetype ===  "image/png") {   
//     cb(null, true);
//  } else {
//     cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false);
//   }
// }

// const upload = multer({storage: storage, fileFilter : fileFilter});

// var upload = multer({ dest: 'uploads/' }); //setting the default folder for multer


const router = Router();

router.post('/login', loginController);
router.get('/login', getloginController);
// router.post('/', upload.array('images', 2), uploadTomogramController);
router.post('/', uploadFile, uploadTomogramController);

export default router;