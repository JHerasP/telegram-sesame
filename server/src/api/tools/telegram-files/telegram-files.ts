import fs from "fs";
import { ENV } from "../../../config";

export default function getHtmlFile(jwt: string): Buffer {
  const file = fs.readFileSync("src/api/tools/telegram-files/html.html", { encoding: "utf-8" });

  const result = file
    .replace(/JWT/g, jwt)
    .replace(/SERVER_IP/g, ENV.serverIp)
    .replace(/SERVER_PORT/g, ENV.port);

  return Buffer.from(result, "utf-8");
}
