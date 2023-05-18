import TelegramBot from "node-telegram-bot-api";
import { configIndex } from "../../config";
import { telegramButtonsCallbacks } from "../telegram-screens/public/screens-public";
import TELEGRAM_COMMANDS from "../tools/telegram-commands";

import { chatHistory } from "../Sesame-database/SesameChatHistory";
import { sendLoggedIn, sendWelcomeMessage } from "./sesame-bot-public-helper";
import { commandHandler } from "./sesame-command-helper";

const TOKEN = configIndex.ENV.telegramToken;
const TC = TELEGRAM_COMMANDS;

export class SesameBotPublic {
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

  public sendLoggedInMessage(chatId: string) {
    if (chatHistory.get(parseInt(chatId))?.size) chatHistory.deleteChatHistory(this.publicBot, chatId);
    sendLoggedIn(this.publicBot, parseInt(chatId));
  }
}
