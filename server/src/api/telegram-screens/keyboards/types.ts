import { InlineKeyboardButton } from "node-telegram-bot-api";

export interface ICustomInLineKeyboadButton<T extends string, Y extends string> extends InlineKeyboardButton {
  text: T;
  callback_data: Y;
}
