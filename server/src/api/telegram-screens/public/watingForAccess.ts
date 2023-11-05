import { Message } from "node-telegram-bot-api";
import { sesameBotService } from "../../sesame-bot";
import { createText } from "../keyboards/keyboard";
import { TelegramScreen } from "../telegramScreens.types";

const waitingForAccessScreen = (): TelegramScreen<never> => {
  const text = createText([
    { sentence: "Yooo, *★,°*:.☆(￣▽￣)/$:*.°★* 。", style: { strong: true, jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "It seems that some people is using me without the permission of my: ", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "( ﾉ ﾟｰﾟ)ﾉ Magnificent owner ＼(ﾟｰﾟ＼) ", style: { strong: true, jumpLine: true } },

    { sentence: "", style: { jumpLine: true } },
    {
      sentence: "I have sent a message with your information to my owner, wait for him to accept you.",
      style: { jumpLine: true },
    },
  ]);

  return {
    text,
    keyboard: [[]],
    callbacks: [],
  };
};

export function waitingForAccessMessage(msg: Message): void {
  const chatId = msg.chat.id;
  const { text, keyboard } = waitingForAccessScreen();

  sesameBotService.sendMessage(chatId, text, keyboard);
}
