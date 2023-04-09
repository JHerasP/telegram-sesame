import TelegramBot from "node-telegram-bot-api";
import { telegramTools } from "../tools";
import TELEGRAM_MESSAGES from "../tools/telegram-messages";

const TM = TELEGRAM_MESSAGES;

export function sendWelcomeMessage(msg: TelegramBot.Message, telegramBot: TelegramBot): void {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  if (!userId) return;

  telegramTools.sendMessage(telegramBot, chatId, TM.start, []);
}
