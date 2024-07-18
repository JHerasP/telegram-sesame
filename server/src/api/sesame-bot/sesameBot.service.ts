// I still dont understand why I have to add this to avoid a deprecation warning
process.env["NTBA_FIX_350"] = "1";
import TelegramBot from "node-telegram-bot-api";
import { chatHistory, tempChatHistory } from "../sesame-database/SesameChatHistory";
import { sesameBot } from "../sesame-bot/SesameBot";

export function sendMessage(
  chatId: number,
  message: string,
  keyboard: TelegramBot.InlineKeyboardButton[][],
  tempMessage: boolean = false
) {
  sesameBot.telegramBot
    .sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
      parse_mode: "HTML",
    })
    .then((x) => {
      if (tempMessage) {
        const chatLog = tempChatHistory.get(chatId);
        if (chatLog) tempChatHistory.updateChatLog(x.chat.id, x.message_id);
        else tempChatHistory.createChatLog(x.chat.id, x.message_id);
      } else {
        const chatLog = chatHistory.get(chatId);
        if (chatLog) chatHistory.updateChatLog(x.chat.id, x.message_id);
        else chatHistory.createChatLog(x.chat.id, x.message_id);
      }
    })
    .catch(() => undefined);
}

export function editMessage(
  chatId: number,
  message: string,
  keyboard: TelegramBot.InlineKeyboardButton[][],
  messageId: number
) {
  sesameBot.telegramBot
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

export function sendFile(chatId: number, file: Buffer, filename?: string) {
  sesameBot.telegramBot
    .sendDocument(chatId, file, {}, { filename: `${filename}.html`, contentType: "text/html" })
    .then((x) => {
      chatHistory.updateChatLog(x.chat.id, x.message_id);
    })
    .catch(() => undefined);
}
