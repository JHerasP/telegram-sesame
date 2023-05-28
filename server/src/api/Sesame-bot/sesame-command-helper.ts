import TelegramBot from "node-telegram-bot-api";
import { telegramButtonsCallbacks } from "../telegram-screens/screens";
import {
  handleMenu,
  sendLoggin,
  sendMenu,
  sendLogInFile,
  toogleAutoclose,
  logOut,
  toogleRemmemberCheckIn,
} from "./sesame-callback-actions";
import { caseGuard } from "../../TS_tools/general-utility";
import { sesameBot } from "./SesameBot";

export type callbackIds = {
  userId: TelegramBot.CallbackQuery["from"]["id"];
  messageId: number | undefined;
  callbackId?: TelegramBot.CallbackQuery["id"];
};

export function commandHandler(callbackQuery: TelegramBot.CallbackQuery, command?: telegramButtonsCallbacks) {
  const userId = callbackQuery.from?.id;
  const messageId = callbackQuery.message?.message_id;
  const callbackId = callbackQuery.id;

  switch (command) {
    case "wellcomeScreen: Conditions":
      return sendLoggin({ userId, messageId });
    case "LoggedScreen: start":
    case "infoScreen: Back":
    case "optionsScreen: Back":
      return sendMenu({ callbackId, userId, messageId });
    case "MenuScreen: Info":
    case "MenuScreen: Check in":
    case "MenuScreen: Check out":
    case "MenuScreen: Refresh":
    case "MenuScreen: Options":
      return handleMenu({ callbackId, userId, messageId }, command);
    case "optionsScreen: renew session":
      return sendLogInFile({ callbackId, userId, messageId });
    case "optionsScreen: Toogle autoclose":
      return toogleAutoclose({ userId, messageId });
    case "optionsScreen: Toogle remmember check in":
      return toogleRemmemberCheckIn({ userId, messageId });
    case "optionsScreen: remove session":
      return logOut({ callbackId, userId, messageId });
    case "autoCheckOutScreen: checkOut":
    case "remmemberChecInScreen: checkIn":
      if (messageId) return sesameBot.telegramBot.deleteMessage(userId, messageId).catch(() => undefined);
      return;
    default:
      if (command) caseGuard(command);
      break;
  }
}
