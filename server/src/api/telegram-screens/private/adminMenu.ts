import { publicScreens } from "..";
import { betterSplit } from "../../../TS_tools/general-utility";
import { chatHistory } from "../../sesame-database/SesameChatHistory";
import { sesameDatabase } from "../../sesame-database/SesameDatabase";
import { sesameUserRequestDatabase } from "../../sesame-database/SesameUserRequest";
import { sesameBotService } from "../../sesame-bot";
import { TelegramCommand } from "../../sesame-bot/command/command.types";
import logConsole from "../../tools/log";
import { createButton, createText } from "../keyboards/keyboard";
import { asnwerCallback } from "../telegramScreen.tools";
import { TelegramScreen } from "../telegramScreens.types";
import { sendMainMenu } from "./mainMenu";
import { sendRestartMessage } from "./needRestart";

export type AdminMenuCallbacks = `AdminMenu: ${"send restart" | "back" | `id.${string}`}`;

const adminMenuScreen = (): TelegramScreen<AdminMenuCallbacks> => {
  const text = createText([
    {
      sentence: "Wololo, this is the list of people that wants to join: ",
      style: { jumpLine: true },
    },
  ]);

  const requestUsers = sesameUserRequestDatabase.getAllUsers();

  const keyboard = [
    [createButton<AdminMenuCallbacks>("Send restart message", "AdminMenu: send restart")],
    [createButton<AdminMenuCallbacks>("Back", "AdminMenu: back")],
  ];

  requestUsers.forEach((user) => {
    if (user.accepted) return;
    keyboard.unshift([
      createButton<AdminMenuCallbacks>(`${user.employeeName}`, `AdminMenu: id.${user.chatId}`),
    ]);
  });

  return {
    text,
    keyboard,
    callbacks: ["AdminMenu: back", "AdminMenu: send restart"],
  };
};

export async function sendAdminMenu({ messageId, chatId }: TelegramCommand) {
  const user = sesameDatabase.getUser(chatId);
  if (!user) return;

  const { text, keyboard } = adminMenuScreen();

  sesameBotService.editMessage(chatId, text, keyboard, messageId);
}

export function handleAdminMenu(
  telegramCommand: TelegramCommand,
  command: ReturnType<typeof adminMenuScreen>["callbacks"][number]
) {
  const user = sesameDatabase.getUser(telegramCommand.chatId);
  if (!user) return;

  if (command === "AdminMenu: back") sendMainMenu(telegramCommand);
  else if (command === "AdminMenu: send restart") sendResetAllUsers(telegramCommand);
  else if (command.includes("AdminMenu")) grantAccess(command, telegramCommand);
  else return;
}
function grantAccess(command: string, telegramCommand: TelegramCommand) {
  const newUserId = parseInt(betterSplit(command, ".", 1));

  chatHistory.deleteChatHistory(newUserId);
  publicScreens.sendWelcomeMessage(newUserId);
  sesameUserRequestDatabase.acceptUser(newUserId);

  sendAdminMenu(telegramCommand).then(() => asnwerCallback(telegramCommand.callbackId));

  const user = sesameUserRequestDatabase.getUser(newUserId);
  if (user) logConsole({ user, action: "grantedAccess" });
}

function sendResetAllUsers(telegramCommand: TelegramCommand) {
  const users = sesameDatabase.getAllUsers();
  if (!users.size) return;

  users.forEach((_, userId) => sendRestartMessage(userId));
  return asnwerCallback(telegramCommand.callbackId);
}
