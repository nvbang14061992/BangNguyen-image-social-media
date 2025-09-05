import express from 'express';
import { userController } from '../controllers/user.controller';
import { protect } from '../common/middlewares/protect.middleware';
import { uploadAvatarLocal } from '../common/multer/localAvatar.multer';

const userRouter = express.Router();

// Tạo route CRUD
userRouter.get('/',protect, userController.getInfo);
userRouter.post('/avatar-local', protect, uploadAvatarLocal.single("image"), userController.uploadAvatarLocal);
userRouter.get('/uploads',protect, userController.findImages);
userRouter.get('/saves',protect, userController.findSavedImages);
userRouter.patch('/profile', protect, userController.update);
userRouter.delete('/delete-image/:id', protect, userController.removeImage);

export default userRouter;