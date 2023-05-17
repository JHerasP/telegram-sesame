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
  const messageId = callback.message?.message_id;
  if (!userId) return;
  if (command === "MenuScreen: Info") {
    const user = sesameDatabase.getUser(userId);
    if (!user) return;
    const since = new Intl.DateTimeFormat("es").format(user.logSince);
    const until = new Intl.DateTimeFormat("es").format(user.logUntil);
    const { text, keyboard } = infoScreen(since, until);
    telegramTools.editMessage(telegramBot, userId, text, keyboard, messageId);
  }
}
