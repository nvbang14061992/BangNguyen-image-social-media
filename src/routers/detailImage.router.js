import express from 'express';
import { detailImageController } from '../controllers/detailImage.controller';
import { protect } from '../common/middlewares/protect.middleware';

const detailImageRouter = express.Router();

// Tạo route CRUD
detailImageRouter.get('/save', protect, detailImageController.save);
detailImageRouter.get('/comments', protect, detailImageController.comments);
detailImageRouter.get('/image', protect, detailImageController.image);

export default detailImageRouter;