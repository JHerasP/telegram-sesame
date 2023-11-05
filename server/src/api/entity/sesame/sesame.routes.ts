import { Response, Router } from "express";
import { ExpressBody } from "../../../TS_tools/request-utility";
import getHtmlFile from "../../tools/telegram-files/telegram-files";
import { loginApi } from "./login/login.index";
import { checkJWT } from "./sesame.middleware";
import { LogInBody } from "./sesame.types";

const router = Router();

router.get("/", (_, res: Response) => {
  const htmlContent = getHtmlFile();

  res.setHeader("Content-Type", "text/html");
  res.send(htmlContent);
});

router.post("/", checkJWT, async (req: ExpressBody<LogInBody>, res: Response) => {
  loginApi
    .logIn(req.body, req.headers.authorization ?? "")
    .then(() => res.status(200).send({}))
    .catch((err) => res.status(200).send(err.message));
});

export default router;
