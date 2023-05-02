import { Response, Router } from "express";
import { logIn } from "./sesame-service";
import { ExpressBody } from "../../../TS_tools/request-utility";

const router = Router();

router.post("/", async (req: ExpressBody<any>, res: Response) => {
  logIn(req.body)
    .then(() => res.status(200).send({}))
    .catch((err) => res.status(200).send(err.message));
});

export default router;
