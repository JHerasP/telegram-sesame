import TelegramBot from "node-telegram-bot-api";
import { telegramButtonsCallbacks } from "../telegram-screens/public/screens-public";
import { handleMenu, sendLoggin, sendMenu, sendRenewLoggin } from "./sesame-bot-public-helper";
import { caseGuard } from "../../TS_tools/general-utility";

export function commandHandler(
  telegramBot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
  command?: telegramButtonsCallbacks
) {
  switch (command) {
    case "wellcomeScreen: Conditions":
      return sendLoggin(telegramBot, callbackQuery);
    case "LoggedScreen: start":
    case "infoScreen: Back":
      return sendMenu(telegramBot, callbackQuery);
    case "MenuScreen: Info":
    case "MenuScreen: Check in":
    case "MenuScreen: Check out":
    case "MenuScreen: Options":
      return handleMenu(telegramBot, callbackQuery, command);

    case "infoScreen: session":
      return sendRenewLoggin(telegramBot, callbackQuery);
    default:
      if (command) caseGuard(command);
      break;
  }
}
