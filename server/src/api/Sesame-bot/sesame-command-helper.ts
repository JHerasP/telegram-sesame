import TelegramBot from "node-telegram-bot-api";
import { telegramButtonsCallbacks } from "../telegram-screens/screens";
import { handleMenu, sendLoggin, sendMenu, sendLogInFile, toogleAutoclose, logOut } from "./sesame-callback-actions";
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
    case "optionsScreen: Back":
      return sendMenu(telegramBot, callbackQuery);
    case "MenuScreen: Info":
    case "MenuScreen: Check in":
    case "MenuScreen: Check out":
    case "MenuScreen: Options":
      return handleMenu(telegramBot, callbackQuery, command);
    case "optionsScreen: renew session":
      return sendLogInFile(telegramBot, callbackQuery);
    case "optionsScreen: Toogle autoclose":
      return toogleAutoclose(telegramBot, callbackQuery);
    case "optionsScreen: remove session":
      return logOut(telegramBot, callbackQuery);
    default:
      if (command) caseGuard(command);
      break;
  }
}
