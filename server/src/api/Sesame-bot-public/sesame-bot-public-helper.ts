import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import { logginIn as logginScreen, welcomeScreen } from "../telegram-screens/public/screens-public";
import { telegramTools } from "../tools";

export function sendWelcomeMessage(telegramBot: TelegramBot, msg: Message): void {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  if (!userId) return;
  const { text, keyboard } = welcomeScreen();

  telegramTools.sendMessage(telegramBot, chatId, text, keyboard);
}

export function sendLogginInProcess(telegramBot: TelegramBot, callback: CallbackQuery): void {
  const userId = callback.from?.id;
  const messageId = callback.message?.message_id;
  if (!userId) return;
  const { text, keyboard } = logginScreen();

  telegramTools.editMessage(telegramBot, userId, text, keyboard, messageId);
}
