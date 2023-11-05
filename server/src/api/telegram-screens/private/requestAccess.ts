import { Message } from "node-telegram-bot-api";
import { publicScreens } from "..";
import { betterSplit } from "../../../TS_tools/general-utility";
import { chatHistory } from "../../Sesame-database/SesameChatHistory";
import { sesameUserRequestDatabase } from "../../Sesame-database/SesameUserRequest";
import { sesameBotService } from "../../sesame-bot";
import { sesameBot } from "../../sesame-bot/SesameBot";
import { TelegramCommand } from "../../sesame-bot/command/command.types";
import { createButton, createText } from "../keyboards/keyboard";
import { asnwerCallback } from "../telegramScreen.tools";
import { TelegramScreen } from "../telegramScreens.types";
import { ENV } from "../../../config";
import logConsole from "../../tools/log";

export type RequestAccessScreenCallbacks = `requestAccessScreen: ${"No way" | `Meh.${string}`}`;

const requestAcessScreen = (msg: Message): TelegramScreen<RequestAccessScreenCallbacks> => {
  const text = createText([
    {
      sentence: "Sup, bro, this person wants to join our ultra secret boy band",
      style: { strong: true, jumpLine: true },
    },
    { sentence: "", style: { jumpLine: true } },
    { sentence: msg.chat.first_name || "Unknown", style: { strong: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "What do we do?", style: { jumpLine: true } },
  ]);

  return {
    text,
    keyboard: [
      [
        createButton<RequestAccessScreenCallbacks>("No", "requestAccessScreen: No way"),
        createButton<RequestAccessScreenCallbacks>("Yep", `requestAccessScreen: Meh.${msg.chat.id}`),
      ],
    ],
    callbacks: [],
  };
};

export function requestAcessMessage(msg: Message): void {
  const chatId = parseInt(ENV.adminId);
  const { text, keyboard } = requestAcessScreen(msg);

  sesameBotService.sendMessage(chatId, text, keyboard);
}

export function handleRequestAcessMenu(
  telegramCommand: TelegramCommand,
  command: ReturnType<typeof requestAcessScreen>["callbacks"][number]
) {
  if (command === "requestAccessScreen: No way") {
    return sesameBot.telegramBot
      .deleteMessage(telegramCommand.chatId, telegramCommand.messageId)
      .catch(() => undefined);
  } else if (command.includes("requestAccessScreen")) {
    const newUserId = parseInt(betterSplit(command, ".", 1));

    chatHistory.deleteChatHistory(newUserId);
    publicScreens.sendWelcomeMessage(newUserId);

    return sesameBot.telegramBot
      .deleteMessage(telegramCommand.chatId, telegramCommand.messageId)
      .then(() => {
        sesameUserRequestDatabase.acceptUser(newUserId);
        asnwerCallback(telegramCommand.callbackId);

        const user = sesameUserRequestDatabase.getUser(newUserId);
        if (user) logConsole({ user, action: "grantedAccess" });
      })
      .catch(() => undefined);
  } else return;
}
