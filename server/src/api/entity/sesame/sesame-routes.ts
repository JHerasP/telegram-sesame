import { Response, Router } from "express";
import { ExpressBody } from "../../../../../TS_tools/request-utility";
import { logIn } from "./sesame-service";

const router = Router();

router.post("/", async (req: ExpressBody<{ email: string; password: string }>, res: Response) => {
  logIn(req.body);
  res.status(200).send();
});

export default router;
