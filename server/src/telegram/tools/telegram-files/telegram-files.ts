import fs from "fs";
import { ENV } from "../../../config";
import JWT from "jsonwebtoken";

export default function getHtmlFile(): Buffer {
  const file = fs.readFileSync("src/api/tools/telegram-files/html.html", { encoding: "utf-8" });

  const result = file.replace(/SERVER_IP/g, ENV.serverIp).replace(/SERVER_PORT/g, ENV.port);

  return Buffer.from(result, "utf-8");
}

export function createJWT(userId: number) {
  const token = JWT.sign(JSON.stringify({ userId }), ENV.sesameCrypto);

  return token;
}
