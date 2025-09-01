import express from 'express';
import { imageController } from '../controllers/image.controllers';
import { protect } from '../common/middlewares/protect.middleware';
import { uploadLocal } from '../common/multer/local.multer';

const imageRouter = express.Router();

// Tạo route CRUD
imageRouter.post('/', protect, uploadLocal.single("image"), imageController.create);
imageRouter.get('/', protect, imageController.findAll);
imageRouter.get('/:id', protect, imageController.findOne);
imageRouter.patch('/:id', imageController.update);
imageRouter.delete('/:id', imageController.remove);

export default imageRouter;