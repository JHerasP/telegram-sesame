import { Response, Router } from "express";
import { ExpressBody } from "../../../TS_tools/request-utility";
import { checkJWT } from "./sesame.middleware";
import { LogInBody } from "./sesame.types";
import { loginApi } from "./login/login.index";

const router = Router();

router.post("/", checkJWT, async (req: ExpressBody<LogInBody>, res: Response) => {
  loginApi
    .logIn(req.body, req.headers.authorization ?? "")
    .then(() => res.status(200).send({}))
    .catch((err) => res.status(200).send(err.message));
});

export default router;
