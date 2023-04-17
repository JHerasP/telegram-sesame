import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import { logginInProcess, loggedIn as logginScreen, welcomeScreen } from "../telegram-screens/public/screens-public";
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

  const file = getHtmlFile(callback.from.id);
  telegramTools.editMessage(telegramBot, userId, text, keyboard, messageId);
  telegramTools.sendFile(telegramBot, userId, file);
}

export function sendLogginInProcess(telegramBot: TelegramBot, callback: CallbackQuery): void {
  const userId = callback.from?.id;
  const messageId = callback.message?.message_id;
  if (!userId) return;
  const { text, keyboard } = logginInProcess();

  telegramTools.editMessage(telegramBot, userId, text, keyboard, messageId);
}
