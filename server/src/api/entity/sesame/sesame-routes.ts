import { Response, Router } from "express";

const router = Router();

router.get("/", async (_req, res: Response) => {
  res.send("Hey");
});

export default router;
