import TelegramBot from "node-telegram-bot-api";
import { SesameChatHistory } from "../../api/Sesame-database/SesameChatHistory";

jest.mock("node-telegram-bot-api");

describe("SesameChatHistory", () => {
  let sesameChatHistory: SesameChatHistory;
  let mockTelegramBot: TelegramBot;

  beforeEach(() => {
    sesameChatHistory = new SesameChatHistory();
    mockTelegramBot = {
      deleteMessage: jest.fn().mockResolvedValue(undefined),
    } as unknown as TelegramBot;
  });

  it("should create and retrieve a chat log", () => {
    const chatId = 1;
    const messageId = 123;

    sesameChatHistory.createChatLog(chatId, messageId);
    const chatLog = sesameChatHistory.get(chatId);

    expect(chatLog).toBeDefined();
    expect(chatLog?.size).toBe(1);
    expect(chatLog?.has(messageId)).toBe(true);
  });

  it("should update a chat log", () => {
    const chatId = 1;
    const messageId1 = 123;
    const messageId2 = 456;

    sesameChatHistory.createChatLog(chatId, messageId1);
    sesameChatHistory.updateChatLog(chatId, messageId2);

    const chatLog = sesameChatHistory.get(chatId);
    expect(chatLog).toBeDefined();
    expect(chatLog?.size).toBe(2);
    expect(chatLog?.has(messageId1)).toBe(true);
    expect(chatLog?.has(messageId2)).toBe(true);
  });

  it("should delete chat history", () => {
    const chatId = 1;
    const messageId1 = 123;
    const messageId2 = 456;

    sesameChatHistory.createChatLog(chatId, messageId1);
    sesameChatHistory.updateChatLog(chatId, messageId2);

    sesameChatHistory.deleteChatHistory(mockTelegramBot, chatId);

    expect(mockTelegramBot.deleteMessage).toHaveBeenCalledWith(chatId, messageId1);
    expect(mockTelegramBot.deleteMessage).toHaveBeenCalledWith(chatId, messageId2);

    const chatLog = sesameChatHistory.get(chatId);
    expect(chatLog).toBeDefined();
    expect(chatLog?.size).toBe(0);
  });
});
