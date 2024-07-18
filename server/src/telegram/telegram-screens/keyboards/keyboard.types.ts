import { InlineKeyboardButton } from "node-telegram-bot-api";

export interface ICustomInLineKeyboadButton<T extends string, Y extends string> extends InlineKeyboardButton {
  text: T;
  callback_data: Y;
}

export type TTextStyle = {
  sentence: string;
  style?: {
    bold?: true;
    strong?: true;
    italic?: true;
    underline?: true;
    jumpLine?: true;
  };
};
