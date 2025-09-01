import express from 'express';
import { saveImageController } from '../controllers/save-image.controller';
import { protect } from '../common/middlewares/protect.middleware';

const saveImageRouter = express.Router();

// Tạo route CRUD
saveImageRouter.post('/',protect, saveImageController.create);
saveImageRouter.get('/', saveImageController.findAll);
saveImageRouter.get('/:id', saveImageController.findOne);
saveImageRouter.patch('/:id', saveImageController.update);
saveImageRouter.delete('/:id', saveImageController.remove);

export default saveImageRouter;