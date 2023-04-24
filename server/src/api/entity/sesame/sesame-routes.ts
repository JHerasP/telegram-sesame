import { Response, Router } from "express";
import { logIn } from "./sesame-service";

const router = Router();

router.post("/", async (req: any, res: Response) => {
  logIn(req.body);
  console.log(req.headers);
  res.status(200).send();
});

export default router;
