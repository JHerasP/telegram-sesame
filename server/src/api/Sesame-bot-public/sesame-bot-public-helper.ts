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

export function sendWelcomeMessage(telegramBot: TelegramBot, msg: Message): void {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  if (!userId) return;
  const { text, keyboard } = welcomeScreen();

  telegramTools.sendMessage(telegramBot, chatId, text, keyboard);
}

export function sendLoggin(telegramBot: TelegramBot, callback: CallbackQuery): void {
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

export function sendLoggedIn(telegramBot: TelegramBot, userId: number): void {
  if (!userId) return;
  const { text, keyboard } = loggedScreen();

  telegramTools.sendMessage(telegramBot, userId, text, keyboard);
}

export function sendMenu(telegramBot: TelegramBot, callback: CallbackQuery): void {
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
): void {
  const userId = callback.from?.id;
  const messageId = callback.message?.message_id;
  if (!userId) return;
  const { text, keyboard } = infoScreen();
  if (command === "MenuScreen: Info") telegramTools.editMessage(telegramBot, userId, text, keyboard, messageId);
}
