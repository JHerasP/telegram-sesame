import { InlineKeyboardButton } from "node-telegram-bot-api";
import { createButton } from "../keyboards/callback-buttons";

type screen<T> = {
  text: string;
  keyboard: InlineKeyboardButton[][];
  callbacks: T[];
};

type welcomeCallbacks = "hey";
export const welcomeScreen = (): screen<welcomeCallbacks> => {
  return {
    text: "Have you ever hear about our savior the fucking flying spaguetti?",
    keyboard: [[createButton<string, welcomeCallbacks>("Leave me alone", "hey")]],
    callbacks: ["hey"],
  };
};

type logginInCallbacks = "Ok";
export const logginIn = (): screen<logginInCallbacks> => {
  return {
    text: "I am working on it, please be patient",
    keyboard: [[createButton<string, logginInCallbacks>("Wubba Lubba Dub Dub!", "Ok")]],
    callbacks: ["Ok"],
  };
};
