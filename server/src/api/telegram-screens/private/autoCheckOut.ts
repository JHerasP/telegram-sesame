import { sesameBotService } from "../../sesame-bot";
import { createButton, createText } from "../keyboards/keyboard";
import { TelegramScreen } from "../telegramScreens.types";

export type AutoChecoutCallbaks = "autoCheckOutScreen: Check Out";

const autoCheckOutScreen = (): TelegramScreen<AutoChecoutCallbaks> => {
  const text = createText([
    { sentence: "Hey, your clock was still running. I just clossed it for you", style: { jumpLine: true } },
    { sentence: "Thank my creator later", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "(✿◠‿◠)", style: { strong: true } },
  ]);

  return {
    text,
    keyboard: [[createButton<AutoChecoutCallbaks>("Gracias maquina", "autoCheckOutScreen: Check Out")]],
    callbacks: ["autoCheckOutScreen: Check Out"],
  };
};

export async function sendAutoCheckOutMessage(userId: number) {
  const { text, keyboard } = autoCheckOutScreen();

  sesameBotService.sendMessage(userId, text, keyboard);
}
