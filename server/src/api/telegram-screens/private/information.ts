import { sesameBotService } from "../../sesame-bot";
import { TelegramCommand } from "../../sesame-bot/command/command.types";
import { sesameDatabase, User } from "../../asesame-database/SesameDatabase";
import { createButton, createText } from "../keyboards/keyboard";
import { TelegramScreen } from "../telegramScreens.types";
import { sendLoggedWelcomeMessage } from "./loggingWelcome";
import { sendOptionsMenu } from "./options";

export type InfoMenuCallbacks = `InfoScreen: ${"Renew session" | "Back"}`;

const infoScreen = (logSince: string, logUntil: string): TelegramScreen<InfoMenuCallbacks> => {
  const text = createText([
    {
      sentence:
        "In here you can check when was the time when you logged in and when I am going to ask you to renewal:",
      style: { jumpLine: true },
    },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Logged in since: " },
    { sentence: `${logSince}`, style: { strong: true, jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Login renewal: " },
    { sentence: `${logUntil}`, style: { strong: true } },
  ]);

  return {
    text,
    keyboard: [
      [createButton<InfoMenuCallbacks>("📋 Renew session", "InfoScreen: Renew session")],
      [createButton<InfoMenuCallbacks>("Back", "InfoScreen: Back")],
    ],
    callbacks: ["InfoScreen: Renew session", "InfoScreen: Back"],
  };
};

export function sendInfoMenu(telegramCommand: TelegramCommand, user: User) {
  const since = new Intl.DateTimeFormat("es").format(user.logSince);
  const until = new Intl.DateTimeFormat("es").format(user.logUntil);

  const { text, keyboard } = infoScreen(since, until);

  sesameBotService.editMessage(telegramCommand.chatId, text, keyboard, telegramCommand.messageId);
}

export function handleInfoMenu(
  telegramCommand: TelegramCommand,
  command: ReturnType<typeof infoScreen>["callbacks"][number]
) {
  const user = sesameDatabase.getUser(telegramCommand.chatId);
  if (!user) return;

  if (command === "InfoScreen: Back") sendOptionsMenu(telegramCommand, user);
  else if (command === "InfoScreen: Renew session")
    sendLoggedWelcomeMessage(telegramCommand.chatId);
}
