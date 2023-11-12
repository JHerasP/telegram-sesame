import { User, sesameDatabase } from "../../Sesame-database/SesameDatabase";
import { checkApi } from "../../entity/sesame/checks/check.index";
import { employeeApi } from "../../entity/sesame/employee/employee.index";
import { WorkType } from "../../entity/sesame/employee/employee.types";
import { sesameBotService } from "../../sesame-bot";
import { TelegramCommand } from "../../sesame-bot/command/command.types";
import { taskApiService } from "../../entity/sesame/task/task.index";
import { createButton, createText } from "../keyboards/keyboard";
import { asnwerCallback, rejectCallback } from "../telegramScreen.tools";
import { TelegramScreen } from "../telegramScreens.types";
import { sendMainMenu } from "./mainMenu";
import { awaitResolver, betterSplit } from "../../../TS_tools/general-utility";

export type CheckCallbacks =
  | `CheckScreen: ${string}`
  | `CheckScreen: Check in`
  | `CheckScreen: Check out`
  | `CheckScreen: Back`;

const checkScreen = (user: User, workTypes: WorkType[]): TelegramScreen<CheckCallbacks> => {
  const text = createText([
    { sentence: "WTF, why are there so many check in types?", style: { jumpLine: true } },
    { sentence: "(>ლ)", style: { bold: true, jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Status: " },
    { sentence: `${user.workingStatus}`, style: { strong: true } },
  ]);

  const buttons = workTypes.map((workType) => {
    if (user.workingStatus === "offline") return [createButton(workType.name, `CheckScreen: ${workType.id}`)];
    else return [];
  });

  const callbacks = workTypes.map((workType) => {
    const callback: CheckCallbacks = `CheckScreen: ${workType.id}`;
    return callback;
  });

  buttons.unshift([createButton("Office", "CheckScreen: Check in")]);
  if (user.workingStatus !== "offline") buttons.push([createButton("📴 Check out", "CheckScreen: Check out")]);
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

export async function sendCheckMenu({ messageId, chatId }: TelegramCommand) {
  if (!chatId || !messageId) return;

  const user = sesameDatabase.getUser(chatId);
  if (!user) return;

  const workTypes = await employeeApi.getWorkTypes(user);

  const { text, keyboard } = checkScreen(user, workTypes);

  sesameBotService.editMessage(chatId, text, keyboard, messageId);
}

export function handleCheckMenu(
  telegramCommand: TelegramCommand,
  command: ReturnType<typeof checkScreen>["callbacks"][number]
) {
  const user = sesameDatabase.getUser(telegramCommand.chatId);
  if (!user) return;

  if (command === "CheckScreen: Check in")
    return checkInSesame(user, telegramCommand.callbackId).then(() => sendMainMenu(telegramCommand));
  else if (command === "CheckScreen: Check out")
    return checkOutSesame(user, telegramCommand.callbackId).then(() => sendMainMenu(telegramCommand));
  else if (command === "CheckScreen: Back") return sendMainMenu(telegramCommand);

  if (command.includes("CheckScreen"))
    return checkInSesame(user, telegramCommand.callbackId, command).then(() => sendMainMenu(telegramCommand));
  else return;
}

async function checkInSesame(user: User, callbackId: string, workCheckTypeId?: `CheckScreen: ${string}`) {
  const checkId = workCheckTypeId ? betterSplit(workCheckTypeId, ":", 1).trim() : undefined;
  const [_, err] = await awaitResolver(checkApi.checkIn(user, checkId));

  if (err) return rejectCallback(callbackId, "F at checking in (╯▽╰ )");

  if (user.startTaskWhenCheckIn) await awaitResolver(taskApiService.startLastTask(user));

  asnwerCallback(callbackId);
}

function checkOutSesame(user: User, callbackId: string) {
  return checkApi
    .checkout(user)
    .then(() => asnwerCallback(callbackId))
    .catch((err) => rejectCallback(callbackId.toString(), err.message));
}
