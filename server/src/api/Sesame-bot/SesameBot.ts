import TelegramBot from "node-telegram-bot-api";
import { configIndex } from "../../config";

const TOKEN = configIndex.ENV.telegramToken;

export class SesameBot {
  constructor() {
    new TelegramBot(TOKEN, { polling: true });
  }
}
