import { InlineKeyboardButton } from "node-telegram-bot-api";
import { createButton, createText } from "../keyboards/keyboard-tools";

type screen<T> = {
  text: string;
  keyboard: InlineKeyboardButton[][];
  callbacks: T[];
};
export type telegramButtonsCallbacks = welcomeCallbacks | loggedCallbacks | menuCallbacks | infoMenuCallbacks;

type welcomeCallbacks = "wellcomeScreen: Conditions";
export const welcomeScreen = (): screen<welcomeCallbacks> => {
  const text = createText([
    { sentence: "ヾ(•ω•`)o", style: { strong: true } },
    { sentence: " Wellcome to the sesame bot 1993", style: { strong: true, underline: true, jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Before we start, I need you to accept the next " },
    { sentence: "conditions:", style: { jumpLine: true, strong: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "- I won't blame the creator for any bug or mistake that this" },
    { sentence: "rushed", style: { strong: true, jumpLine: true } },
    { sentence: "bot makes.", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "- I won't talk about this bot to anybody.", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    {
      sentence: "- If you are happy with the bot, you have to ",
    },
    { sentence: "pat", style: { strong: true } },
    { sentence: "the creator on the head and say: " },
    { sentence: "good boy", style: { italic: true } },
  ]);

  return {
    text,
    keyboard: [[createButton<string, welcomeCallbacks>("We only live once, lets go!", "wellcomeScreen: Conditions")]],
    callbacks: ["wellcomeScreen: Conditions"],
  };
};

export const firstStepsScreen = (): screen<never> => {
  const text = createText([
    { sentence: "First, I need you to " },
    { sentence: "log in.", style: { strong: true, jumpLine: true } },
    { sentence: "Don't worry, I am not going to steal your information (⌐■_■),", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "After you finish it, You will receibe a message on" },
    { sentence: "this", style: { bold: true } },
    { sentence: "chat." },
  ]);
  return {
    text,
    keyboard: [[]],
    callbacks: [],
  };
};

type loggedCallbacks = "LoggedScreen: start";
export const loggedScreen = (): screen<loggedCallbacks> => {
  const text = createText([
    { sentence: "Everything went fine...", style: { jumpLine: true } },
    { sentence: "Yes I know, I am also surprised. ( ͡ಠ ʖ̯ ͡ಠ)", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "If you find any problem, I recommend you to write: " },
    { sentence: "/start", style: { italic: true } },
    { sentence: "and log in again" },
  ]);

  return {
    text,
    keyboard: [[createButton<string, loggedCallbacks>("I want to eat pancakes (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "LoggedScreen: start")]],
    callbacks: ["LoggedScreen: start"],
  };
};

type menuCallbacks = `MenuScreen: ${"Info" | "Check in" | "Check out" | "Options"}`;
export const menuScreen = (): screen<menuCallbacks> => {
  const text = createText([
    { sentence: "So, It is sesame time, do as you wish " },
    { sentence: "ヽ(✿ﾟ▽ﾟ)ノ", style: { bold: true } },
  ]);

  return {
    text,
    keyboard: [
      [createButton<string, menuCallbacks>("Loggin info", "MenuScreen: Info")],
      [createButton<string, menuCallbacks>("Check in", "MenuScreen: Check in")],
      [createButton<string, menuCallbacks>("Check out", "MenuScreen: Check out")],
      [createButton<string, menuCallbacks>("Options", "MenuScreen: Options")],
    ],
    callbacks: ["MenuScreen: Info", "MenuScreen: Check in", "MenuScreen: Check out", "MenuScreen: Options"],
  };
};

type infoMenuCallbacks = "infoScreen: Back" | "infoScreen: session";
export const infoScreen = (logSince: string, logUntil: string): screen<infoMenuCallbacks> => {
  const text = createText([
    {
      sentence: "In here you can check when was the time when you logged in and when I am going to ask you to renewal:",
      style: { jumpLine: true },
    },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Logged in since:" },
    { sentence: `${logSince}`, style: { strong: true, jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Login renewal:" },
    { sentence: `${logUntil}`, style: { strong: true } },
  ]);

  return {
    text,
    keyboard: [
      [
        createButton<string, infoMenuCallbacks>("Renew session", "infoScreen: session"),
        createButton<string, infoMenuCallbacks>("Back", "infoScreen: Back"),
      ],
    ],
    callbacks: ["infoScreen: Back", "infoScreen: session"],
  };
};

type renewLoginCallbacks = never;
export const renewLoginScreen = (logUntil: string): screen<renewLoginCallbacks> => {
  const text = createText([
    { sentence: "Hey, your session will expire on" },
    { sentence: `${logUntil}`, style: { strong: true } },
    { sentence: "days." },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Fill the form again to renew it", style: { jumpLine: true } },
  ]);

  return {
    text,
    keyboard: [[]],
    callbacks: [],
  };
};
