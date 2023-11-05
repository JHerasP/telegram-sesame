import { betterSplit } from "../../../TS_tools/general-utility";
import { User, sesameDatabase } from "../../Sesame-database/SesameDatabase";
import { taskApi, taskApiService } from "../../entity/sesame/task/task.index";
import { TaskTimer } from "../../entity/sesame/task/task.type";
import { sesameBotService } from "../../sesame-bot";
import { TelegramCommand } from "../../sesame-bot/command/command.types";
import { createButton, createText } from "../keyboards/keyboard";
import { ICustomInLineKeyboadButton } from "../keyboards/keyboard.types";
import { asnwerCallback, rejectCallback } from "../telegramScreen.tools";
import { TelegramScreen } from "../telegramScreens.types";
import { sendMainMenu } from "./mainMenu";

export type TaskCallbaks = "taskScreen: back" | "taskScreen: Open last" | `taskScreen: task.${string}`;

const taskScreen = (task?: TaskTimer): TelegramScreen<TaskCallbaks> => {
  let text: string;
  let keyboard: ICustomInLineKeyboadButton<string, `taskScreen: ${string}`>[][];

  if (task) {
    text = createText([
      { sentence: "As far I can see, this is what you are supposed to be doing now: ", style: { jumpLine: true } },
      { sentence: "", style: { jumpLine: true } },
      { sentence: `${task.comment}`, style: { jumpLine: true, strong: true } },
    ]);
    keyboard = [[createButton<TaskCallbaks>("F this shit", `taskScreen: task.${task.id}`)]];
  } else {
    text = createText([
      {
        sentence: "It seems that you are doing nothing at work, just like you do with your life.",
        style: { jumpLine: true },
      },
      { sentence: "", style: { jumpLine: true } },
      { sentence: "¯_( ͡° ͜ʖ ͡°)_/¯ ", style: { strong: true } },
    ]);
    keyboard = [[createButton<TaskCallbaks>("Meh, time to work something", "taskScreen: Open last")]];
  }

  keyboard.push([createButton<TaskCallbaks>("Back", "taskScreen: back")]);

  return {
    text,
    keyboard,
    callbacks: ["taskScreen: Open last", `taskScreen: task.${task?.id}`, "taskScreen: back"],
  };
};

export async function sendTaskMenu({ chatId, messageId }: TelegramCommand, user: User) {
  const task = await taskApi.getActiveTask(user);

  const { text, keyboard } = taskScreen(task);

  sesameBotService.editMessage(chatId, text, keyboard, messageId);
}

export function handleTaskMenu(
  telegramCommand: TelegramCommand,
  command: ReturnType<typeof taskScreen>["callbacks"][number]
) {
  const user = sesameDatabase.getUser(telegramCommand.chatId);
  if (!user) return;

  if (command === "taskScreen: Open last") return startTaskSesame(user, telegramCommand);
  else if (command === "taskScreen: back") return sendMainMenu(telegramCommand);

  if (command.includes("taskScreen"))
    return closeTaskSesame(user, telegramCommand.callbackId, command).then(() => sendTaskMenu(telegramCommand, user));
  else return;
}

function startTaskSesame(user: User, telegramCommand: TelegramCommand) {
  return taskApiService.startLastTask(user).then(() => {
    asnwerCallback(telegramCommand.callbackId);
    sendTaskMenu(telegramCommand, user);
  });
}

function closeTaskSesame(user: User, callbackId: string, command: `taskScreen: task.${string}`) {
  const taskId = betterSplit(command, ".", 1);

  return taskApi
    .closeTask(user, taskId)
    .then(() => asnwerCallback(callbackId))
    .catch((err) => rejectCallback(callbackId, err.message));
}
