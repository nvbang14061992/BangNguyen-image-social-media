import express from "express";
import rootRouter from "./src/routers/root.router";
import cors from "cors";

// import { appError } from "./src/common/app-error/app-error.error";

import { createServer } from "http";
import { PORT } from "./src/common/constants/app.constant";
import { appError } from "./src/common/app-error/app-error.error";
import { rateLimiter } from "./src/common/middlewares/rateLimiter.middleware";

// init app
const app = express();

// test server
app.get('/', (req, res) => {
    res.json("Hello From Bang Image Social Media!!!")
});

// add middleware to parse body from Bytestream to json
app.use(express.static("public"));
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3001", "google.com"]
}));

// chat by socketio
const httpServer = createServer(app);

// routing
app.use("/api", rateLimiter);
app.use("/api", rootRouter);

app.use(appError);

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`
)});