import express, { type Request, type Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.ts";
import userRouter from "./users/users.routes.ts";

const app = express();
// middleware to help express to parse json
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to elib API" });
});
// using users routes
app.use("/api/users", userRouter);

// Global error Handler (must be at last)
app.use(globalErrorHandler);
export default app;
