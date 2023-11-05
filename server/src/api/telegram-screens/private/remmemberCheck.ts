import { sesameBotService } from "../../sesame-bot";
import { createButton, createText } from "../keyboards/keyboard";
import { TelegramScreen } from "../telegramScreens.types";

export type RemmemberCheckInCallbacks = "remmemberChecInScreen: Check In";

const remmemberChecInScreen = (): TelegramScreen<RemmemberCheckInCallbacks> => {
  const text = createText([
    { sentence: "Good moooooooooooooorning ヾ(•ω•`)o", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Did you forget to check in?", style: { jumpLine: true } },
  ]);

  return {
    text,
    keyboard: [[createButton<RemmemberCheckInCallbacks>("Utzi lo egin (╯▔皿▔)╯", "remmemberChecInScreen: Check In")]],
    callbacks: ["remmemberChecInScreen: Check In"],
  };
};

export async function sendRemberCheckInMessage(userId: number) {
  const { text, keyboard } = remmemberChecInScreen();

  sesameBotService.sendMessage(userId, text, keyboard);
}
