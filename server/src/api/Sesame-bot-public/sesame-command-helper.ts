import TelegramBot from "node-telegram-bot-api";
import { telegramButtonsCallbacks } from "../telegram-screens/public/screens-public";
import { handleMenu, sendLoggin, sendMenu } from "./sesame-bot-public-helper";

export function commandHandler(
  telegramBot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
  command?: telegramButtonsCallbacks
) {
  switch (command) {
    case "wellcomeScreen: Conditions":
      return sendLoggin(telegramBot, callbackQuery);
    case "LoggedScreen: start":
      return sendMenu(telegramBot, callbackQuery);
    case "MenuScreen: Info":
    case "MenuScreen: Check in":
    case "MenuScreen: Check out":
    case "MenuScreen: Options":
      return handleMenu(telegramBot, callbackQuery, command);
    default:
      break;
  }
}
