import TelegramBot from "node-telegram-bot-api";
import { configIndex } from "../../config";
import { telegramButtonsCallbacks } from "../telegram-screens/screens";
import TELEGRAM_COMMANDS from "../tools/telegram-commands";

import { chatHistory } from "../Sesame-database/SesameChatHistory";
import { sendLoggedIn, sendRenewLoggin, sendWelcomeMessage } from "./sesame-callback-actions";
import { commandHandler } from "./sesame-command-helper";

const TOKEN = configIndex.ENV.telegramToken;
const TC = TELEGRAM_COMMANDS;

export class SesameBot {
  private publicBot: TelegramBot;

  constructor() {
    this.publicBot = new TelegramBot(TOKEN, { polling: true });
    this.init();
  }

  init() {
    this.publicBot.onText(TC.start, (message) => {
      sendWelcomeMessage(this.publicBot, message);
    });

    this.publicBot.on("callback_query", (callbackQuery) => {
      const command = callbackQuery.data as telegramButtonsCallbacks;

      commandHandler(this.publicBot, callbackQuery, command);
    });
  }

  public sendLoggedInMessage(chatId: number) {
    if (chatHistory.get(chatId)?.size) chatHistory.deleteChatHistory(this.publicBot, chatId);
    sendLoggedIn(this.publicBot, chatId);
  }

  public sendRenewLogIn(chatId: number, expiration: Date) {
    if (chatHistory.get(chatId)?.size) chatHistory.deleteChatHistory(this.publicBot, chatId);
    sendRenewLoggin(this.publicBot, chatId, expiration);
  }
}
