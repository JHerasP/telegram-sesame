import { InlineKeyboardButton } from "node-telegram-bot-api";
import { User } from "../Sesame-database/SesameDatabase";
import { createButton, createText } from "./keyboards/keyboard-tools";
import { WorkType } from "../entity/sesame/types";

type screen<T> = {
  text: string;
  keyboard: InlineKeyboardButton[][];
  callbacks: T[];
};
export type telegramButtonsCallbacks =
  | welcomeCallbacks
  | loggedCallbacks
  | menuCallbacks
  | infoMenuCallbacks
  | optionCallbacks
  | previousAutoChecoutCallbaks
  | autoChecoutCallbaks
  | remmemberCheckInCallbacks
  | checkCallbacks;

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
    { sentence: "- If you are happy with the bot, you have to " },
    { sentence: "pat", style: { strong: true } },
    { sentence: "the creator on the head and say: " },
    { sentence: "good boy", style: { italic: true } },
  ]);

  return {
    text,
    keyboard: [[createButton<welcomeCallbacks>("We only live once, lets go!", "wellcomeScreen: Conditions")]],
    callbacks: ["wellcomeScreen: Conditions"],
  };
};

export const firstStepsScreen = (): screen<never> => {
  const text = createText([
    { sentence: "First, I need you to " },
    { sentence: "log in.", style: { strong: true, jumpLine: true } },
    { sentence: "Don't worry, I am not going to steal your information (⌐■_■),", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "After you finish it, You will receibe a message on", style: {} },
    { sentence: " this ", style: { bold: true } },
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
    { sentence: "If you find any problem, I recommend you to write:" },
    { sentence: " /start ", style: { italic: true } },
    { sentence: "and log in again" },
  ]);

  return {
    text,
    keyboard: [[createButton<loggedCallbacks>("I want to eat pancakes (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "LoggedScreen: start")]],
    callbacks: ["LoggedScreen: start"],
  };
};

type menuCallbacks = `MenuScreen: ${"Info" | "Check menu" | "Options" | "Refresh"}`;
export const menuScreen = (user: User): screen<menuCallbacks> => {
  const text = createText([
    { sentence: "So, It is sesame time, do as you wish ", style: { jumpLine: true } },
    { sentence: "ヽ(✿ﾟ▽ﾟ)ノ", style: { bold: true, jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Status: " },
    { sentence: `${user.workingStatus}`, style: { strong: true } },
  ]);

  return {
    text,
    keyboard: [
      [createButton<menuCallbacks>("📳  Check menu", "MenuScreen: Check menu")],
      [createButton<menuCallbacks>("🔫 Refresh", "MenuScreen: Refresh")],
      [createButton<menuCallbacks>("🗃 Loggin info", "MenuScreen: Info")],
      [createButton<menuCallbacks>("⚙ Options", "MenuScreen: Options")],
    ],
    callbacks: ["MenuScreen: Info", "MenuScreen: Check menu", "MenuScreen: Options", "MenuScreen: Refresh"],
  };
};

type checkCallbacks =
  | `CheckScreen: ${string}`
  | `CheckScreen: Check in`
  | `CheckScreen: Check out`
  | `CheckScreen: Back`;
export const checkScreen = (user: User, workTypes: WorkType[]): screen<checkCallbacks> => {
  const text = createText([
    { sentence: "WTF, why are there so many check in types?", style: { jumpLine: true } },
    { sentence: "(>ლ)", style: { bold: true, jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Status: " },
    { sentence: `${user.workingStatus}`, style: { strong: true } },
  ]);

  const buttons = workTypes.map((workType) => {
    return [createButton(workType.name, `CheckScreen: ${workType.id}`)];
  });

  const callbacks = workTypes.map((workType) => {
    const callback: checkCallbacks = `CheckScreen: ${workType.id}`;
    return callback;
  });

  buttons.unshift([createButton("Office", "CheckScreen: Check in")]);
  buttons.push([createButton("📴 Check out", "CheckScreen: Check out")]);
  buttons.push([createButton("Back", "CheckScreen: Back")]);
  callbacks.unshift("CheckScreen: Check in");
  callbacks.push("CheckScreen: Check out");
  callbacks.push("CheckScreen: Back");

  return {
    text,
    keyboard: buttons,
    callbacks: callbacks,
  };
};

type infoMenuCallbacks = "infoScreen: Back";
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
    keyboard: [[createButton<infoMenuCallbacks>("Back", "infoScreen: Back")]],
    callbacks: ["infoScreen: Back"],
  };
};

export const renewLoginScreen = (logUntil: string): screen<never> => {
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

type optionCallbacks =
  | "optionsScreen: Back"
  | "optionsScreen: Toogle autoclose"
  | "optionsScreen: Toogle remmember check in"
  | "optionsScreen: renew session"
  | "optionsScreen: remove session";
export const optionsScreen = (autoclose: boolean, remmeberCheckIn: boolean): screen<optionCallbacks> => {
  const text = createText([
    { sentence: "In here you can " },
    { sentence: "wubba lubba dub dub", style: { italic: true } },
    { sentence: "with the settings" },
    { sentence: " ฅʕ•̫͡•ʔฅ  ", style: { strong: true, jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: `Autoclose: ${autoclose ? "On" : "Off"}`, style: { strong: true, jumpLine: true } },
    { sentence: `Remmeber check in: ${remmeberCheckIn ? "On" : "Off"}`, style: { strong: true } },
  ]);

  return {
    text,
    keyboard: [
      [createButton<optionCallbacks>("⌚ Toogle auto check out", "optionsScreen: Toogle autoclose")],
      [createButton<optionCallbacks>("🕒 Toogle remmeber check in", "optionsScreen: Toogle remmember check in")],
      [createButton<optionCallbacks>("📋 Renew session", "optionsScreen: renew session")],
      [createButton<optionCallbacks>("🎢 Log out", "optionsScreen: remove session")],
      [createButton<optionCallbacks>("Back", "optionsScreen: Back")],
    ],
    callbacks: [
      "optionsScreen: Back",
      "optionsScreen: Toogle autoclose",
      "optionsScreen: Toogle remmember check in",
      "optionsScreen: renew session",
      "optionsScreen: remove session",
    ],
  };
};

export const logOutScreen = (): screen<never> => {
  const text = createText([
    { sentence: "Sesion removed", style: { jumpLine: true } },
    { sentence: "I hope the reason of you abandon was because you got fired", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "(。・ω・。)", style: { strong: true } },
  ]);

  return {
    text,
    keyboard: [],
    callbacks: [],
  };
};

type previousAutoChecoutCallbaks = "previousAutoCheckOutScreen: slave" | "previousAutoCheckOutScreen: Freedom";
export const previousAutoCheckOutScreen = (expireSesion: Date): screen<previousAutoChecoutCallbaks> => {
  const time = new Intl.DateTimeFormat("es-En", {
    hour: "numeric",
    minute: "numeric",
  }).format(expireSesion);

  const text = createText([
    { sentence: "Che boludito, deja de chamuyar con el horario que a las: " },
    { sentence: `${time} `, style: { strong: true } },
    { sentence: "te lleva " },
    { sentence: "Morit4 ( ͡° ͜ʖ ͡° )つ ", style: { strong: true } },
    { sentence: "y " },
    { sentence: "Juani_ ", style: { strong: true } },
    { sentence: "a jugar al OW", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "(⊙_(⊙_⊙)_⊙)", style: { jumpLine: true, strong: true } },
  ]);

  return {
    text,
    keyboard: [
      [
        createButton<previousAutoChecoutCallbaks>("Me están negreando ( ಥ﹏ಥ)", "previousAutoCheckOutScreen: slave"),
        createButton<previousAutoChecoutCallbaks>(
          "El decorado se calla ( ಠ ᴥಠ)",
          "previousAutoCheckOutScreen: Freedom"
        ),
      ],
    ],
    callbacks: ["previousAutoCheckOutScreen: slave", "previousAutoCheckOutScreen: Freedom"],
  };
};

type autoChecoutCallbaks = "autoCheckOutScreen: checkOut";
export const autoCheckOutScreen = (): screen<autoChecoutCallbaks> => {
  const text = createText([
    { sentence: "Hey, your clock was still running. I just clossed it for you", style: { jumpLine: true } },
    { sentence: "Thank my creator later", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "(✿◠‿◠)", style: { strong: true } },
  ]);

  return {
    text,
    keyboard: [[createButton<autoChecoutCallbaks>("Gracias maquina", "autoCheckOutScreen: checkOut")]],
    callbacks: ["autoCheckOutScreen: checkOut"],
  };
};

type remmemberCheckInCallbacks = "remmemberChecInScreen: checkIn";
export const remmemberChecInScreen = (): screen<remmemberCheckInCallbacks> => {
  const text = createText([
    { sentence: "Good moooooooooooooorning ヾ(•ω•`)o", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Did you forget to check in?", style: { jumpLine: true } },
  ]);

  return {
    text,
    keyboard: [[createButton<remmemberCheckInCallbacks>("Utzi lo egin (╯▔皿▔)╯", "remmemberChecInScreen: checkIn")]],
    callbacks: ["remmemberChecInScreen: checkIn"],
  };
};
