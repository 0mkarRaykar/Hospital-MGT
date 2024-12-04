import express from "express";
import serverless from "serverless-http";
import authRouter from "../routes/authRouter.js";

const app = express();

// Middleware
app.use(express.json());

// Use the userRouter for all routes starting with "/users"
app.use("/auths", authRouter);

// Export the handler for serverless deployment
export const handler = serverless(app);
