import TelegramBot from "node-telegram-bot-api";
import { configIndex } from "../../config";
import { telegramButtonsCallbacks } from "../telegram-screens/screens";
import TELEGRAM_COMMANDS from "../tools/telegram-commands";

import { sendWelcomeMessage } from "./sesame-callback-actions";
import { commandHandler } from "./sesame-command-helper";

const TOKEN = configIndex.ENV.telegramToken;
const TC = TELEGRAM_COMMANDS;

export class SesameBot {
  telegramBot: TelegramBot;

  constructor() {
    this.telegramBot = new TelegramBot(TOKEN, { polling: true });
    this.init();
  }

  init() {
    this.telegramBot.onText(TC.start, (message) => {
      sendWelcomeMessage(message);
    });

    this.telegramBot.on("callback_query", (callbackQuery) => {
      const command = callbackQuery.data as telegramButtonsCallbacks;

      commandHandler(callbackQuery, command);
    });
  }
}

export const sesameBot = new SesameBot();
