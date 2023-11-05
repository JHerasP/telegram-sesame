import { publicScreens } from "..";
import { betterSplit } from "../../../TS_tools/general-utility";
import { chatHistory } from "../../Sesame-database/SesameChatHistory";
import { User, sesameDatabase } from "../../Sesame-database/SesameDatabase";
import { sesameUserRequestDatabase } from "../../Sesame-database/SesameUserRequest";
import { sesameBotService } from "../../sesame-bot";
import { TelegramCommand } from "../../sesame-bot/command/command.types";
import logConsole from "../../tools/log";
import { createButton, createText } from "../keyboards/keyboard";
import { asnwerCallback } from "../telegramScreen.tools";
import { TelegramScreen } from "../telegramScreens.types";
import { sendMainMenu } from "./mainMenu";

export type AdminMenuCallbacks = `AdminMenu: ${"back" | `id.${string}`}`;

const adminMenuScreen = (user: User): TelegramScreen<AdminMenuCallbacks> => {
  const text = createText([
    { sentence: "So, It is sesame time, do as you wish ", style: { jumpLine: true } },
    { sentence: "ヽ(✿ﾟ▽ﾟ)ノ", style: { bold: true, jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Status: " },
    { sentence: `${user.workingStatus}`, style: { strong: true } },
  ]);

  const requestUsers = sesameUserRequestDatabase.getAllUsers();

  const keyboard = [[createButton<AdminMenuCallbacks>("Back", "AdminMenu: back")]];

  requestUsers.forEach((user) => {
    if (user.accepted) return;
    keyboard.unshift([createButton<AdminMenuCallbacks>(`${user.employeeName}`, `AdminMenu: id.${user.chatId}`)]);
  });

  return {
    text,
    keyboard,
    callbacks: ["AdminMenu: back"],
  };
};

export async function sendAdminMenu({ messageId, chatId }: TelegramCommand) {
  const user = sesameDatabase.getUser(chatId);
  if (!user) return;

  const { text, keyboard } = adminMenuScreen(user);

  sesameBotService.editMessage(chatId, text, keyboard, messageId);
}

export function handleAdminMenu(
  telegramCommand: TelegramCommand,
  command: ReturnType<typeof adminMenuScreen>["callbacks"][number]
) {
  const user = sesameDatabase.getUser(telegramCommand.chatId);
  if (!user) return;

  if (command === "AdminMenu: back") sendMainMenu(telegramCommand);
  else if (command.includes("AdminMenu")) {
    const newUserId = parseInt(betterSplit(command, ".", 1));

    chatHistory.deleteChatHistory(newUserId);
    publicScreens.sendWelcomeMessage(newUserId);
    sesameUserRequestDatabase.acceptUser(newUserId);

    sendAdminMenu(telegramCommand).then(() => asnwerCallback(telegramCommand.callbackId));

    const user = sesameUserRequestDatabase.getUser(newUserId);
    if (user) logConsole({ user, action: "grantedAccess" });
  } else return;
}
