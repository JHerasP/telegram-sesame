import TelegramBot from "node-telegram-bot-api";
import { configIndex } from "../../config";
import { welcomeScreen } from "../telegram-screens/public/screens-public";
import TELEGRAM_COMMANDS from "../tools/telegram-commands";
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
  }
}
