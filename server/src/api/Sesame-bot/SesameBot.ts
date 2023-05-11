import TelegramBot from "node-telegram-bot-api";
import { configIndex } from "../../config";
import { telegramTools } from "../tools";

const TOKEN = configIndex.ENV.telegramToken;

export class SesameBot {
  private userId: number;
  private cookie: string;
  private telegramBot: TelegramBot;

  constructor(userId: number, cookie: string) {
    this.userId = userId;
    this.cookie = cookie;
    this.telegramBot = new TelegramBot(TOKEN, { polling: true });
    this.init();
  }

  private init() {
    console.log("IGNORE", this.cookie);
    telegramTools.sendMessage(this.telegramBot, this.userId, "Welp", []);
  }
}
