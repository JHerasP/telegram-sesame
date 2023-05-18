import JWT from "jsonwebtoken";
import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import { ENV } from "../../config";
import {
  infoScreen,
  loggedScreen,
  firstStepsScreen as logginScreen,
  menuScreen,
  welcomeScreen,
} from "../telegram-screens/public/screens-public";
import { telegramTools } from "../tools";
import getHtmlFile from "../tools/telegram-files/telegram-files";
import { sesameDatabase } from "../Sesame-database/SesameDatabase";
import { checkIn, checkout } from "../entity/sesame/sesame-service";

export function sendWelcomeMessage(telegramBot: TelegramBot, msg: Message): void {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  if (!userId) return;
  const { text, keyboard } = welcomeScreen();

  telegramTools.sendMessage(telegramBot, chatId, text, keyboard);
}

export function sendLoggin(telegramBot: TelegramBot, callback: CallbackQuery) {
  const userId = callback.from?.id;
  const messageId = callback.message?.message_id;
  if (!userId) return;
  const { text, keyboard } = logginScreen();

  const jwt = createJWT(callback.from.id);
  const file = getHtmlFile(jwt);
  telegramTools.editMessage(telegramBot, userId, text, keyboard, messageId);
  telegramTools.sendFile(telegramBot, userId, file);
}

function createJWT(userId: number) {
  const token = JWT.sign(JSON.stringify({ userId }), ENV.sesameCrypto);

  return token;
}

export function sendLoggedIn(telegramBot: TelegramBot, userId: number) {
  if (!userId) return;
  const { text, keyboard } = loggedScreen();

  telegramTools.sendMessage(telegramBot, userId, text, keyboard);
}

export function sendMenu(telegramBot: TelegramBot, callback: CallbackQuery) {
  const userId = callback.from?.id;
  const messageId = callback.message?.message_id;
  if (!userId) return;
  const { text, keyboard } = menuScreen();

  telegramTools.editMessage(telegramBot, userId, text, keyboard, messageId);
}

export function handleMenu(
  telegramBot: TelegramBot,
  callback: CallbackQuery,
  command: ReturnType<typeof menuScreen>["callbacks"][number]
) {
  const userId = callback.from?.id;
  const user = sesameDatabase.getUser(userId);
  if (!userId || !user) return;

  const messageId = callback.message?.message_id;
  const callbackId = callback.id;

  if (command === "MenuScreen: Info") {
    const since = new Intl.DateTimeFormat("es").format(user.logSince);
    const until = new Intl.DateTimeFormat("es").format(user.logUntil);
    const { text, keyboard } = infoScreen(since, until);
    telegramTools.editMessage(telegramBot, userId, text, keyboard, messageId);
  } else if (command === "MenuScreen: Check in")
    checkIn(user.cookie)
      .then(() => asnwerCallback(telegramBot, callbackId))
      .catch(() => rejectCallback(telegramBot, callbackId));
  else if (command === "MenuScreen: Check out")
    checkout(user.cookie)
      .then(() => asnwerCallback(telegramBot, callbackId))
      .catch(() => rejectCallback(telegramBot, callbackId));
}

export function sendRenewLoggin(telegramBot: TelegramBot, callback: CallbackQuery) {
  const userId = callback.from?.id;
  // const messageId = callback.message?.message_id;
  if (!userId) return;
  // const { text, keyboard } = logginScreen();

  const jwt = createJWT(callback.from.id);
  const file = getHtmlFile(jwt);
  // telegramTools.editMessage(telegramBot, userId, text, keyboard, messageId);
  telegramTools.sendFile(telegramBot, userId, file);
}

function asnwerCallback(telegramBot: TelegramBot, callbackId: string) {
  telegramBot.answerCallbackQuery(callbackId, { text: "Operation done (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧" }).catch(() => undefined);
}

function rejectCallback(telegramBot: TelegramBot, callbackId: string) {
  telegramBot
    .answerCallbackQuery(callbackId, { text: "Welp, something went wrong", show_alert: true })
    .catch(() => undefined);
}
