import { InlineKeyboardButton } from "node-telegram-bot-api";
import { createButton, createText } from "../keyboards/keyboard-tools";

type screen<T> = {
  text: string;
  keyboard: InlineKeyboardButton[][];
  callbacks: T[];
};

type welcomeCallbacks = "firstMessage";
export const welcomeScreen = (): screen<welcomeCallbacks> => {
  const text = createText([
    { sentence: "Have you ever hear about our savior" },
    { sentence: "the fucking", style: { bold: true } },
    { sentence: "flying spaguetti?" },
  ]);

  return {
    text,
    keyboard: [[createButton<string, welcomeCallbacks>("We only live once, lets go!", "firstMessage")]],
    callbacks: ["firstMessage"],
  };
};

export const logginIn = (): screen<never> => {
  const text = createText([
    { sentence: "I need you to log in" },
    { sentence: "hold it, I am not going to steal your information" },
    { sentence: "yet", style: { strong: true } },
  ]);
  return {
    text,
    keyboard: [[]],
    callbacks: [],
  };
};
