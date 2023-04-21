import { Response, Router } from "express";
import { ExpressBody } from "../../../../../TS_tools/request-utility";

const router = Router();

router.post("/", async (req: ExpressBody<{ email: string; password: string }>, res: Response) => {
  console.log(req.body);
  res.send("Hey");
});

export default router;
