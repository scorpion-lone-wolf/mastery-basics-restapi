import { type Request, type Response } from "express";

async function createUser(req: Request, res: Response) {
  const body = req.body;
  console.log("body", body);
  res.json({
    message: "user created",
  });
}

export { createUser };
