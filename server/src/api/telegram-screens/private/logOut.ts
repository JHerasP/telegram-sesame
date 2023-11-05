import { sesameBotService } from "../../sesame-bot";
import { TelegramCommand } from "../../sesame-bot/command/command.types";
import { sesameDatabase } from "../../Sesame-database/SesameDatabase";
import logConsole from "../../tools/log";

import { createText } from "../keyboards/keyboard";
import { TelegramScreen } from "../telegramScreens.types";

const logOutScreen = (): TelegramScreen<never> => {
  const text = createText([
    { sentence: "Sesion removed", style: { jumpLine: true } },
    { sentence: "I hope the reason of your abandon is because you got fired", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "You can always return by using /start", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "(。・ω・。)", style: { strong: true } },
  ]);

  return {
    text,
    keyboard: [],
    callbacks: [],
  };
};

export function sendLogOutMessage({ messageId, chatId }: TelegramCommand) {
  const { text } = logOutScreen();

  const user = sesameDatabase.getUser(chatId);

  if (user) logConsole({ user, action: "closeSession" });

  sesameDatabase.logOut(chatId);
  sesameBotService.editMessage(chatId, text, [], messageId);
}
