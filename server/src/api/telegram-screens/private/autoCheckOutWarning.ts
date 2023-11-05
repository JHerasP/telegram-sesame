import { awaitResolver } from "../../../TS_tools/general-utility";
import { sesameBotService } from "../../sesame-bot";
import { sesameBot } from "../../sesame-bot/SesameBot";
import { TelegramCommand } from "../../sesame-bot/command/command.types";
import { User, sesameDatabase } from "../../Sesame-database/SesameDatabase";

import logConsole from "../../tools/log";
import { createButton, createText } from "../keyboards/keyboard";
import { TelegramScreen } from "../telegramScreens.types";

export type AutoCheckOutWarningCallbaks = `PreviousAutoCheckOutScreen: ${"Slave" | "Freedom"}`;

const autoCheckOutWarningScreen = (expireSesion: Date): TelegramScreen<AutoCheckOutWarningCallbaks> => {
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
      [createButton<AutoCheckOutWarningCallbaks>("Me están negreando ( ಥ﹏ಥ)", "PreviousAutoCheckOutScreen: Slave")],
      [
        createButton<AutoCheckOutWarningCallbaks>(
          "El decorado se calla ( ಠ ᴥಠ)",
          "PreviousAutoCheckOutScreen: Freedom"
        ),
      ],
    ],
    callbacks: ["PreviousAutoCheckOutScreen: Slave", "PreviousAutoCheckOutScreen: Freedom"],
  };
};

export async function sendAutoCheckOutWarningMessage(userId: number, expireSesion: Date) {
  const { text, keyboard } = autoCheckOutWarningScreen(expireSesion);

  sesameBotService.sendMessage(userId, text, keyboard);
}

export async function handleCheckOutWarningMenu(
  telegramCommand: TelegramCommand,
  command: ReturnType<typeof autoCheckOutWarningScreen>["callbacks"][number]
) {
  const user = sesameDatabase.getUser(telegramCommand.chatId);
  if (!user) return;

  if (command === "PreviousAutoCheckOutScreen: Freedom")
    return await awaitResolver(sesameBot.telegramBot.deleteMessage(telegramCommand.chatId, telegramCommand.messageId));
  else return tooglePreviousAutoclose(telegramCommand, user);
}

async function tooglePreviousAutoclose({ messageId, chatId }: TelegramCommand, user: User) {
  logConsole({ user, action: "abortAutoCheckOut" });

  sesameDatabase.toogleInminentAutoclose(chatId, true);
  await awaitResolver(sesameBot.telegramBot.deleteMessage(chatId, messageId));
}
