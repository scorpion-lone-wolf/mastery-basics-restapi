import express, { type Request, type Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.ts";

const app = express();

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to elib API" });
});

// Global error Handler (must be at last)
app.use(globalErrorHandler);
export default app;
