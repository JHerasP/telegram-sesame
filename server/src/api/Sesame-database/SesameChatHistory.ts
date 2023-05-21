import TelegramBot from "node-telegram-bot-api";

export class SesameChatHistory {
  private history: Map<number, Set<number>>;
  constructor() {
    this.history = new Map<number, Set<number>>();
  }

  public get(chatId: number) {
    return this.history.get(chatId);
  }

  public createChatLog(chatId: number, messageId: number) {
    const chatLog = new Set<number>();
    chatLog.add(messageId);
    this.history.set(chatId, chatLog);
  }

  public updateChatLog(chatId: number, messageId: number) {
    const chatLog = this.history.get(chatId);

    if (chatLog) {
      chatLog.add(messageId);
      this.history.set(chatId, chatLog);
    }
  }

  public deleteChatHistory(telegramBot: TelegramBot, chatId: number) {
    const chatLogs = this.history.get(chatId);
    if (chatLogs) {
      chatLogs.forEach((chatLog) => telegramBot.deleteMessage(chatId, chatLog).catch(() => undefined));
      chatLogs.clear();
    }
  }
}

export const chatHistory = new SesameChatHistory();
