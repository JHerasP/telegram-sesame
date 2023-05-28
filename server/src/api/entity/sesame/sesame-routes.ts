import { Response, Router } from "express";
import { logIn } from "./sesame-service";
import { ExpressBody } from "../../../TS_tools/request-utility";
import JWT from "jsonwebtoken";
import { ENV } from "../../../config";
const router = Router();

type logInBody = {
  email: string;
  password: string;
};

const checkJWT = (req: ExpressBody<logInBody>, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(200).send("Where is my token?");

  const noBearer = token.split(" ")[1];

  const decodedToken = JWT.verify(noBearer, ENV.sesameCrypto);

  if (decodedToken) next();
  else res.status(200).send("ಠ▃ಠ");
};

router.post("/", checkJWT, async (req: ExpressBody<logInBody>, res: Response) => {
  logIn(req.body, req.headers.authorization ?? "")
    .then(() => res.status(200).send({}))
    .catch((err) => res.status(200).send(err.message));
});

export default router;
