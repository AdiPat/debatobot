import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ChatMessage } from "../../models";
import { naiveChatMessageHandler } from "../chat-handlers";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { prompts } from "../../common";

// Mock dependencies
vi.mock("ai");
vi.mock("@ai-sdk/openai");

describe("Chat Handlers", () => {
  const mockResponse = "Mock AI response";
  const mockError = new Error("AI generation failed");
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");
    vi.mocked(openai).mockReturnValue("gpt-4o" as any);
    vi.mocked(generateText).mockResolvedValue({ text: mockResponse } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("naiveChatMessageHandler", () => {
    it("should handle basic message without history", async () => {
      const message: ChatMessage = {
        content: "Hello",
        timestamp: new Date(),
      };

      const response = await naiveChatMessageHandler(message);

      expect(response.content).toBe(mockResponse);
      expect(response.history).toEqual([message]);
      expect(response.timestamp).toBeInstanceOf(Date);
      expect(generateText).toHaveBeenCalledWith({
        model: "gpt-4o",
        system: prompts.NAIVE_CHAT.SYSTEM_PROMPT(),
        prompt: prompts.NAIVE_CHAT.USER_PROMPT(message.content, []),
      });
    });

    it("should preserve and append to existing history", async () => {
      const history: ChatMessage[] = [
        { content: "Previous", timestamp: new Date() },
      ];
      const message: ChatMessage = {
        content: "Hello",
        timestamp: new Date(),
        history,
      };

      const response = await naiveChatMessageHandler(message);

      expect(response.history).toEqual([...history, message]);
      expect(generateText).toHaveBeenCalledWith({
        model: "gpt-4o",
        system: prompts.NAIVE_CHAT.SYSTEM_PROMPT(),
        prompt: prompts.NAIVE_CHAT.USER_PROMPT(message.content, ["Previous"]),
      });
    });

    it("should handle empty message content", async () => {
      const message: ChatMessage = {
        content: "",
        timestamp: new Date(),
      };

      const response = await naiveChatMessageHandler(message);

      expect(response.content).toBe(mockResponse);
      expect(response.history).toEqual([message]);
    });

    it("should handle AI generation error", async () => {
      vi.mocked(generateText).mockRejectedValueOnce(mockError);

      const message: ChatMessage = {
        content: "Hello",
        timestamp: new Date(),
      };

      const response = await naiveChatMessageHandler(message);

      expect(response.content).toBe(
        "An error occurred while generating the response."
      );
      expect(response.history).toEqual([message]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating response:",
        mockError
      );
    });

    it("should handle undefined history", async () => {
      const message: ChatMessage = {
        content: "Hello",
        timestamp: new Date(),
        history: undefined,
      };

      const response = await naiveChatMessageHandler(message);

      expect(response.history).toEqual([message]);
      expect(response.history).not.toBe(undefined);
      expect(generateText).toHaveBeenCalledWith({
        model: "gpt-4o",
        system: prompts.NAIVE_CHAT.SYSTEM_PROMPT(),
        prompt: prompts.NAIVE_CHAT.USER_PROMPT(message.content, []),
      });
    });

    it("should initialize history as empty array when not provided", async () => {
      const message: ChatMessage = {
        content: "Hello",
        timestamp: new Date(),
      };

      const response = await naiveChatMessageHandler(message);

      expect(response.history).toEqual([message]);
      expect(response.history).not.toBe(undefined);
      expect(Array.isArray(response.history)).toBe(true);
    });
  });
});
