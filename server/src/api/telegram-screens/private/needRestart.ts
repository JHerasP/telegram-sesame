import { ENV } from "../../../config";
import { sesameBotService } from "../../sesame-bot";
import { createJWT } from "../../tools/telegram-files/telegram-files";
import { createText } from "../keyboards/keyboard";
import { TelegramScreen } from "../telegramScreens.types";

const needRestartScreen = (jwt: string): TelegramScreen<never> => {
  const text = createText([
    { sentence: "╰(艹皿艹 ) Recruits!", style: { jumpLine: true, strong: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "The general has uploaded a new version, you should log in again " },
    { sentence: "tomorrow", style: { jumpLine: true, strong: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Peace out! ~(￣▽￣)~*", style: { strong: true } },
  ]);

  return {
    text,
    keyboard: [[{ text: "Log in", url: `http://${ENV.serverIp}:${ENV.port}/sesame/?jwt=${jwt}` }]],
    callbacks: [],
  };
};

export async function sendRestartMessage(userId: number) {
  const jwt = createJWT(userId);

  const { text, keyboard } = needRestartScreen(jwt);

  sesameBotService.sendMessage(userId, text, keyboard);
}
