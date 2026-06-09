import express, { type Request, type Response } from "express";

const app = express();

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to elib API" });
});

export default app;
