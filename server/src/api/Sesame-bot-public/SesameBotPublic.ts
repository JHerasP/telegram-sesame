import TelegramBot from "node-telegram-bot-api";
import { configIndex } from "../../config";
import TELEGRAM_COMMANDS from "../tools/telegram-commands";
import { sendWelcomeMessage } from "./sesame-bot-public-helper";

const TOKEN = configIndex.ENV.telegramToken;
const TC = TELEGRAM_COMMANDS;

export class SesameBotPublic {
  private publicBot: TelegramBot;
  constructor() {
    this.publicBot = new TelegramBot(TOKEN, { polling: true });
    this.init();
  }

  init() {
    this.publicBot.onText(TC.start, (message) => sendWelcomeMessage(message, this.publicBot));
  }
}
