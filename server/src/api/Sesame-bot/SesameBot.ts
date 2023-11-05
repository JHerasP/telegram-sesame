import TelegramBot from "node-telegram-bot-api";
import { configIndex } from "../../config";
import { TelegramButtonsCallbacks } from "../telegram-screens/telegramScreens.types";
import TELEGRAM_COMMANDS from "../tools/telegram-commands";
import { publicScreens } from "../telegram-screens";
import { commandHandler } from "./command/command";

const TOKEN = configIndex.ENV.telegramToken;
const TC = TELEGRAM_COMMANDS;

export class SesameBot {
  telegramBot: TelegramBot;

  constructor() {
    this.telegramBot = new TelegramBot(TOKEN, { polling: true });
    this.init();
  }

  init() {
    this.telegramBot.onText(TC.start, (message) => publicScreens.sendWelcomeMessage(message));

    this.telegramBot.on("callback_query", (callbackQuery) => {
      const command = callbackQuery.data as TelegramButtonsCallbacks;

      commandHandler(callbackQuery, command);
    });
  }
}

export const sesameBot = new SesameBot();
