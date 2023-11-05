import { InlineKeyboardButton } from "node-telegram-bot-api";
import { PrivateScreenCallbacks, PublicScreenCallbacks } from ".";

export type TelegramScreen<T> = {
  text: string;
  keyboard: InlineKeyboardButton[][];
  callbacks: T[];
};

export type TelegramButtonsCallbacks = PublicScreenCallbacks | PrivateScreenCallbacks;
