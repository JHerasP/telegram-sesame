import TelegramBot from "node-telegram-bot-api";

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
    .catch(() => undefined);
}
