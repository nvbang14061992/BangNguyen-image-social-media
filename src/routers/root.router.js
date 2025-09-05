import express from "express";
import authRouter from "./auth.router";
import imageRouter from "./image.router";
import saveImageRouter from "./save-image.router";
import detailImageRouter from "./detailImage.router";
import userRouter from "./user.router";
// import swaggerUi from "swagger-ui-express"
// import { swaggerDocument } from "../common/swagger/init.swagger";
// import userRouter from "./user.router";


const rootRouter = express.Router();

// rootRouter.use('/docs', swaggerUi.serve);
// rootRouter.get('/docs', swaggerUi.setup(swaggerDocument));

rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/image", imageRouter);
rootRouter.use("/save-image", saveImageRouter);
rootRouter.use("/detail-image", detailImageRouter);
// rootRouter.use("/user", userRouter);

export default rootRouter;