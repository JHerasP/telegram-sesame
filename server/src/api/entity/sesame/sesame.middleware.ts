import { ExpressBody } from "../../../TS_tools/request-utility";
import { LogInBody } from "./sesame.types";
import JWT from "jsonwebtoken";
import { ENV } from "../../../config";

export function checkJWT(req: ExpressBody<LogInBody>, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(200).send("Where is my token?");

  const noBearer = token.split(" ")[1];

  const decodedToken = JWT.verify(noBearer, ENV.sesameCrypto);

  if (decodedToken) next();
  else res.status(200).send("ಠ▃ಠ");
}
