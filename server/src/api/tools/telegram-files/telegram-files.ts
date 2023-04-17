import fs from "fs";

export default function getHtmlFile(telegramUserId: number): Buffer {
  const file = fs.readFileSync("src/api/tools/telegram-files/html.html", { encoding: "utf-8" });

  const result = file.replace(/PETETE/g, telegramUserId.toString());

  return Buffer.from(result, "utf-8");
}
