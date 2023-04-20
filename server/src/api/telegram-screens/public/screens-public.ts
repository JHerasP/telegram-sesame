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

type loginIn = "Done";
export const loggedIn = (): screen<loginIn> => {
  const text = createText([
    { sentence: "I need you to log in, hold it, I am not going to steal your information" },
    { sentence: "yet.", style: { strong: true, jumpLine: true } },
    { sentence: "After you finish it, You will receibe a message on this chat." },
  ]);
  return {
    text,
    keyboard: [[createButton<string, loginIn>("Done", "Done")]],
    callbacks: ["Done"],
  };
};

export const logginInProcess = (): screen<never> => {
  const text = createText([{ sentence: "Wait" }]);
  return {
    text,
    keyboard: [[]],
    callbacks: [],
  };
};
