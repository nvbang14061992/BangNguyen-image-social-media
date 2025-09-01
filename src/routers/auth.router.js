import express from 'express';
import { authController } from '../controllers/auth.controller';

const authRouter = express.Router();

// Tạo route CRUD

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/refesh-token', authController.refeshToken);

export default authRouter;