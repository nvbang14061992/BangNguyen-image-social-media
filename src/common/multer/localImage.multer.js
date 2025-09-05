
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// recursive đảm bảo luôn có folder images
fs.mkdirSync("public/images/", { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, "image_local" + '-' + uniqueSuffix + extName)
  }
})

export const uploadImageLocal = multer({ storage: storage })