
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// recursive đảm bảo luôn có folder images
fs.mkdirSync("public/avatars/", { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatars/')
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, "avatar_local" + '-' + uniqueSuffix + extName)
  }
})

export const uploadAvatarLocal = multer({ storage: storage })