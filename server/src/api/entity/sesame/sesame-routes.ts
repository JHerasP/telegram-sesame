import { Response, Router } from "express";
import { logIn } from "./sesame-service";
import { ExpressBody } from "../../../TS_tools/request-utility";

const router = Router();

router.post("/", async (req: ExpressBody<any>, res: Response) => {
  logIn(req.body);
  console.log(req.headers);
  res.status(200).send();
});

export default router;
