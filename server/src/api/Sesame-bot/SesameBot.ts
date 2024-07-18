import TelegramBot from "node-telegram-bot-api";
import { ENV, configIndex } from "../../config";
import { TelegramButtonsCallbacks } from "../telegram-screens/telegramScreens.types";
import TELEGRAM_COMMANDS from "../tools/telegram-commands";
import { privateScreens, publicScreens } from "../telegram-screens";
import { commandHandler } from "./command/command";
import { sesameUserRequestDatabase } from "../sesame-database/SesameUserRequest";
import logConsole from "../tools/log";

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
      const user = sesameUserRequestDatabase.getUser(message.chat.id);

      if (
        message.chat.id === parseInt(ENV.adminId) ||
        user?.accepted ||
        ENV.secretBoyBandMembers.includes(message.chat.id.toString())
      )
        return publicScreens.sendWelcomeMessage(message.chat.id);

      publicScreens.waitingForAccessMessage(message);

      if (!user) {
        logConsole({
          user: { chatId: message.chat.id, employeeName: message.chat.first_name || "Unknown" },
          action: "requestedAccess",
        });

        privateScreens.requestAcessMessage(message);

        sesameUserRequestDatabase.setUser(message.chat.id, {
          chatId: message.chat.id,
          employeeName: message.chat.first_name || "Unknown",
          accepted: false,
        });
      }
    });

    this.telegramBot.on("callback_query", (callbackQuery) => {
      const command = callbackQuery.data as TelegramButtonsCallbacks;

      commandHandler(callbackQuery, command);
    });
  }
}

export const sesameBot = new SesameBot();
