import { Request, Response, NextFunction } from "express";
import multer from 'multer';
import {FileTypeException} from '../helpers/errors';
import fs from 'fs'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
      cb(null, './uploads/')
  },
  
  filename: function (req: any, file: any, cb: any) {
    const originalname = file.originalname;
    const extension = originalname.split('.').pop();
    const filename = originalname.replace("." + extension, "").replace(/[.\s]/g, '_') + '.' + extension;
      cb(null, filename)
  }
});

const fileFilter = (req: any,file: any,cb: any) => {
  if (file.mimetype === "image/jpg"  || 
     file.mimetype ==="image/jpeg") {   
    cb(null, true);
 } else {
    cb(new FileTypeException("Image uploaded is not of type jpg/jpeg"),false);
  }
}

const upload = multer({storage: storage, fileFilter : fileFilter}).array('images');
// var upload = multer({ dest: 'uploads/' }); //setting the default folder for multer
export function uploadFile(req: Request, res: Response, next: NextFunction) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError || err instanceof FileTypeException) {
        return res.status(500).json({code: err.code, name: err.name, message: err.message})
    } else if (err) {
      return res.status(500).json({name: err.name, message: err.message})
    }
    next()
  })
}