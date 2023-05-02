import fs from "fs";

export default function getHtmlFile(jwt: string): Buffer {
  const file = fs.readFileSync("src/api/tools/telegram-files/html.html", { encoding: "utf-8" });

  const result = file.replace(/PETETE/g, jwt);

  return Buffer.from(result, "utf-8");
}
