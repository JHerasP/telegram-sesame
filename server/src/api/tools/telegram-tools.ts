// I still dont understand why I have to add this to avoid a deprecation warning
process.env["NTBA_FIX_350"] = "1";
import TelegramBot from "node-telegram-bot-api";
import { chatHistory } from "../Sesame-database/SesameChatHistory";

export function sendMessage(
  telegramBot: TelegramBot,
  chatId: number,
  message: string,
  keyboard: TelegramBot.InlineKeyboardButton[][]
) {
  telegramBot
    .sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
      parse_mode: "HTML",
    })
    .then((x) => {
      const chatLog = chatHistory.get(chatId);
      if (chatLog) chatHistory.updateChatLog(x.chat.id, x.message_id, chatLog);
      else chatHistory.createChatLog(x.chat.id, x.message_id);
    })
    .catch(() => undefined);
}

export function editMessage(
  telegramBot: TelegramBot,
  chatId: number,
  message: string,
  keyboard: TelegramBot.InlineKeyboardButton[][],
  messageId?: number
) {
  telegramBot
    .editMessageText(message, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: keyboard,
      },
      parse_mode: "HTML",
    })

    .catch(() => undefined);
}

export function sendFile(telegramBot: TelegramBot, chatId: number, file: Buffer) {
  telegramBot
    .sendDocument(chatId, file, {}, { filename: "Text.html", contentType: "text/html" })
    .then((x) => {
      const chatLog = chatHistory.get(chatId);
      if (chatLog) chatHistory.updateChatLog(x.chat.id, x.message_id, chatLog);
    })
    .catch(() => undefined);
}
