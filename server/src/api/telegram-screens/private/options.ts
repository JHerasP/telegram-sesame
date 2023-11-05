import { User, sesameDatabase } from "../../Sesame-database/SesameDatabase";
import { sesameBotService } from "../../sesame-bot";
import { TelegramCommand } from "../../sesame-bot/command/command.types";
import { createButton, createText } from "../keyboards/keyboard";
import { TelegramScreen } from "../telegramScreens.types";
import { sendInfoMenu } from "./information";
import { sendLogOutMessage } from "./logOut";
import { sendMainMenu } from "./mainMenu";

export type OptionCallbacks = `OptionsScreen: ${
  | "Back"
  | "Toogle autoclose"
  | "Toogle remmember check in"
  | "Toogle start task"
  | "Info"
  | "Remove session"}`;

const optionsScreen = (
  autoclose: boolean,
  remmeberCheckIn: boolean,
  startTask: boolean
): TelegramScreen<OptionCallbacks> => {
  const text = createText([
    { sentence: "In here you can " },
    { sentence: "wubba lubba dub dub", style: { italic: true } },
    { sentence: "with the settings " },
    { sentence: " ฅʕ•̫͡•ʔฅ  ", style: { strong: true, jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
  ]);

  return {
    text,
    keyboard: [
      [
        createButton<OptionCallbacks>(
          `⌚ Auto check out is ${autoclose ? "On" : "Off"}`,
          "OptionsScreen: Toogle autoclose"
        ),
      ],
      [
        createButton<OptionCallbacks>(
          `🕒 Remmeber check in is ${remmeberCheckIn ? "On" : "Off"}`,
          "OptionsScreen: Toogle remmember check in"
        ),
      ],
      [
        createButton<OptionCallbacks>(
          `🎫 Start task when check in is ${startTask ? "On" : "Off"}`,
          "OptionsScreen: Toogle start task"
        ),
      ],
      [createButton<OptionCallbacks>("🗃 Loggin info", "OptionsScreen: Info")],
      [],
      [createButton<OptionCallbacks>("🎢 Log out", "OptionsScreen: Remove session")],
      [createButton<OptionCallbacks>("Back", "OptionsScreen: Back")],
    ],
    callbacks: [
      "OptionsScreen: Info",
      "OptionsScreen: Back",
      "OptionsScreen: Toogle autoclose",
      "OptionsScreen: Toogle remmember check in",
      "OptionsScreen: Remove session",
    ],
  };
};

export function sendOptionsMenu({ chatId, messageId }: TelegramCommand, user: User) {
  const { text, keyboard } = optionsScreen(user.autoCheckOut, user.remmeberCheckIn, user.startTaskWhenCheckIn);

  sesameBotService.editMessage(chatId, text, keyboard, messageId);
}

export function handleOptionsMenu(
  telegramCommand: TelegramCommand,
  command: ReturnType<typeof optionsScreen>["callbacks"][number]
) {
  const user = sesameDatabase.getUser(telegramCommand.chatId);
  if (!user) return;

  if (command === "OptionsScreen: Back") sendMainMenu(telegramCommand);
  else if (command === "OptionsScreen: Info") sendInfoMenu(telegramCommand, user);
  else if (command === "OptionsScreen: Toogle autoclose") toogleAutoclose(telegramCommand);
  else if (command === "OptionsScreen: Toogle remmember check in") toogleRemmemberCheckIn(telegramCommand);
  else if (command === "OptionsScreen: Toogle start task") toogleStartTaskCheckIn(telegramCommand);
  else if (command === "OptionsScreen: Remove session") sendLogOutMessage(telegramCommand);
  else return;
}

function toogleAutoclose(telegramCommand: TelegramCommand) {
  const user = sesameDatabase.getUser(telegramCommand.chatId);
  if (!user) return;

  sesameDatabase.toogleAutoclose(telegramCommand.chatId);
  sendOptionsMenu(telegramCommand, user);
}

function toogleRemmemberCheckIn(telegramCommand: TelegramCommand) {
  const user = sesameDatabase.getUser(telegramCommand.chatId);
  if (!user) return;

  sesameDatabase.toogleremmeberCheckIn(telegramCommand.chatId);
  sendOptionsMenu(telegramCommand, user);
}

function toogleStartTaskCheckIn(telegramCommand: TelegramCommand) {
  const user = sesameDatabase.getUser(telegramCommand.chatId);
  if (!user) return;

  sesameDatabase.toogleStartTaskCheckIn(telegramCommand.chatId);
  sendOptionsMenu(telegramCommand, user);
}
