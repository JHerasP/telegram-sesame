import TelegramBot from "node-telegram-bot-api";
import { configIndex } from "../../config";
import { welcomeScreen } from "../telegram-screens/public/screens-public";
import TELEGRAM_COMMANDS from "../tools/telegram-commands";
import fs from "fs";

import { sendLogginInProcess, sendWelcomeMessage } from "./sesame-bot-public-helper";

const TOKEN = configIndex.ENV.telegramToken;
const TC = TELEGRAM_COMMANDS;

export class SesameBotPublic {
  private publicBot: TelegramBot;
  constructor() {
    this.publicBot = new TelegramBot(TOKEN, { polling: true });
    this.init();
  }

  init() {
    this.publicBot.onText(TC.start, (message) => sendWelcomeMessage(this.publicBot, message));

    this.publicBot.on("callback_query", (callbackQuery) => {
      const command = callbackQuery.data as ReturnType<typeof welcomeScreen>["callbacks"][number];
      const { callbacks } = welcomeScreen();

      if (callbacks.includes(command)) sendLogginInProcess(this.publicBot, callbackQuery);
    });

    this.publicBot.on("callback_query", (callbackQuery) => {
      const command = callbackQuery.data as ReturnType<typeof welcomeScreen>["callbacks"][number];
      const { callbacks } = welcomeScreen();

      const file = fs.readFileSync("src/api/Sesame-bot-public/html.html", { encoding: "utf-8" });

      const result = file.replace(/PETETE/g, "replacement");

      const buff = Buffer.from(result, "utf-8");

      if (callbacks.includes(command))
        this.publicBot
          .sendDocument(callbackQuery.from.id, buff, {}, { filename: "Text.html", contentType: "text/html" })
          .catch((er) => console.info("X", er));
    });
  }
}
