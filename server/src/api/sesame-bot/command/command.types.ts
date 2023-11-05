import TelegramBot from "node-telegram-bot-api";

export type TelegramCommand = {
  chatId: TelegramBot.CallbackQuery["from"]["id"];
  messageId: number;
  callbackId: TelegramBot.CallbackQuery["id"];
};
