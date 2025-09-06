import express from "express";
import rootRouter from "./src/routers/root.router";
import cors from "cors";

// import { appError } from "./src/common/app-error/app-error.error";

import { createServer } from "http";
import { PORT } from "./src/common/constants/app.constant";
import { appError } from "./src/common/app-error/app-error.error";
import { rateLimiter } from "./src/common/middlewares/rateLimiter.middleware";
import helmet from "helmet";

// init app
const app = express();

// MIDDLEWARES
// security HTTP headers
app.use(helmet());
// test server

app.use(express.static("public"));
// add middleware to parse body from Bytestream to json
app.use(express.json());
// enable cors to only allow request from frontend
app.use(
  cors({
    origin: ["http://localhost:3001", "google.com"],
  })
);

// chat by socketio
const httpServer = createServer(app);

// routing
// rate limiter
app.use("/api", rateLimiter);

// check server
app.get("/api", (req, res) => {
  res.json("Hello From Bang Image Social Media!!!");
});
// api
app.use("/api", rootRouter);

app.use(appError);

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
