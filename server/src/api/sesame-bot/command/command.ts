import TelegramBot from "node-telegram-bot-api";
import { TelegramButtonsCallbacks } from "../../telegram-screens/telegramScreens.types";
import { caseGuard } from "../../../TS_tools/general-utility";
import { privateScreens, privateScreensMenuHandlers, publicScreens } from "../../telegram-screens";
import { TelegramCommand } from "./command.types";
import { isAdminScreen, isCheckScreen, isRequestAccessScreen, isTaskScreen } from "./command.tools";
import { sesameBot } from "../SesameBot";

export function commandHandler(callbackQuery: TelegramBot.CallbackQuery, command?: TelegramButtonsCallbacks) {
  const chatId = callbackQuery.from.id;
  const messageId = callbackQuery.message?.message_id;
  const callbackId = callbackQuery.id;

  if (!messageId) return;

  const telegramCommand: TelegramCommand = {
    chatId,
    messageId,
    callbackId,
  };

  switch (command) {
    case "wellcomeScreen: Conditions":
      return publicScreens.sendLoggingMessage(telegramCommand);
    case "LoggingWelcomeScreen: start":
    case "taskScreen: back":
    case "OptionsScreen: Back":
      return privateScreens.sendMainMenu(telegramCommand);
    case "InfoScreen: Renew session":
    case "InfoScreen: Back":
      return privateScreensMenuHandlers.handleInfoMenu(telegramCommand, command);
    case "MenuScreen: Check menu":
    case "MenuScreen: Task":
    case "MenuScreen: Refresh":
    case "MenuScreen: Options":
    case "MenuScreen: Admin":
      return privateScreensMenuHandlers.handleMainMenu(telegramCommand, command);
    case "OptionsScreen: Toogle autoclose":
    case "OptionsScreen: Toogle remmember check in":
    case "OptionsScreen: Toogle start task":
    case "OptionsScreen: Remove session":
    case "OptionsScreen: Info":
      return privateScreensMenuHandlers.handleOptionsMenu(telegramCommand, command);
    case "PreviousAutoCheckOutScreen: Freedom":
    case "PreviousAutoCheckOutScreen: Slave":
      return privateScreensMenuHandlers.handleCheckOutWarningMenu(telegramCommand, command);
    case "taskScreen: Open last":
      return privateScreensMenuHandlers.handleTaskMenu(telegramCommand, command);
    case "autoCheckOutScreen: Check Out":
    case "remmemberChecInScreen: Check In":
      return sesameBot.telegramBot.deleteMessage(chatId, messageId).catch(() => undefined);
    case "requestAccessScreen: No way":
      return privateScreensMenuHandlers.handleRequestAcessMenu(telegramCommand, command);
    case "AdminMenu: back":
      return privateScreensMenuHandlers.handleAdminMenu(telegramCommand, command);
    default:
      if (isCheckScreen(command)) return privateScreensMenuHandlers.handleCheckMenu(telegramCommand, command);
      if (isTaskScreen(command)) return privateScreensMenuHandlers.handleTaskMenu(telegramCommand, command);
      if (isRequestAccessScreen(command))
        return privateScreensMenuHandlers.handleRequestAcessMenu(telegramCommand, command);
      if (isAdminScreen(command)) return privateScreensMenuHandlers.handleAdminMenu(telegramCommand, command);
      if (command) caseGuard(command);
      break;
  }
}
