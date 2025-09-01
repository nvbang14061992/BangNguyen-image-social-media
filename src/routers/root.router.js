import express from "express";
import authRouter from "./auth.router";
import imageRouter from "./image.router";
// import swaggerUi from "swagger-ui-express"
// import { swaggerDocument } from "../common/swagger/init.swagger";
// import userRouter from "./user.router";


const rootRouter = express.Router();

// rootRouter.use('/docs', swaggerUi.serve);
// rootRouter.get('/docs', swaggerUi.setup(swaggerDocument));

rootRouter.use("/auth", authRouter);
rootRouter.use("/image", imageRouter);
// rootRouter.use("/user", userRouter);

export default rootRouter;