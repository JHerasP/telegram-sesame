import { User, sesameDatabase } from "../../Sesame-database/SesameDatabase";
import { sesameBotService } from "../../sesame-bot";
import { TelegramCommand } from "../../sesame-bot/command/command.types";
import { createButton, createText } from "../keyboards/keyboard";
import { asnwerCallback } from "../telegramScreen.tools";
import { TelegramScreen } from "../telegramScreens.types";
import { sendCheckMenu } from "./checks";
import { sendOptionsMenu } from "./options";
import { sendTaskMenu } from "./task";

export type MenuCallbacks = `MenuScreen: ${"Check menu" | "Task" | "Refresh" | "Options"}`;

const mainMenuScreen = (user: User): TelegramScreen<MenuCallbacks> => {
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
      [createButton<MenuCallbacks>("📳  Check menu", "MenuScreen: Check menu")],
      [createButton<MenuCallbacks>("🎫  Task menu", "MenuScreen: Task")],
      [createButton<MenuCallbacks>("🔫 Refresh", "MenuScreen: Refresh")],

      [createButton<MenuCallbacks>("⚙ Options", "MenuScreen: Options")],
    ],
    callbacks: ["MenuScreen: Check menu", "MenuScreen: Options", "MenuScreen: Refresh"],
  };
};

export async function sendMainMenu({ messageId, chatId }: TelegramCommand) {
  await sesameDatabase.refreshWorkingStatus(chatId);
  const user = sesameDatabase.getUser(chatId);
  if (!user) return;

  const { text, keyboard } = mainMenuScreen(user);

  sesameBotService.editMessage(chatId, text, keyboard, messageId);
}

export function handleMainMenu(
  telegramCommand: TelegramCommand,
  command: ReturnType<typeof mainMenuScreen>["callbacks"][number]
) {
  const user = sesameDatabase.getUser(telegramCommand.chatId);
  if (!user) return;

  if (command === "MenuScreen: Check menu") sendCheckMenu(telegramCommand);
  else if (command === "MenuScreen: Task") sendTaskMenu(telegramCommand, user);
  else if (command === "MenuScreen: Options") sendOptionsMenu(telegramCommand, user);
  else if (command === "MenuScreen: Refresh")
    sendMainMenu(telegramCommand).then(() => asnwerCallback(telegramCommand.callbackId));
  else return;
}
