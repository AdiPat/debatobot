import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ChatLoop } from "../chat-loop";
import * as readline from "readline";

// Mock readline
vi.mock("readline", () => ({
  createInterface: vi.fn(() => ({
    question: vi.fn(),
    close: vi.fn(),
  })),
}));

describe("ChatLoop", () => {
  let chatLoop: ChatLoop;
  let mockMessageHandler: any;
  let mockReadline: any;
  let consoleLogSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup console spies
    consoleLogSpy = vi.spyOn(console, "log");
    consoleErrorSpy = vi.spyOn(console, "error");

    // Setup message handler mock
    mockMessageHandler = vi.fn(async (message) => ({
      content: `Response to: ${message.content}`,
      timestamp: new Date(),
    }));

    // Create chat loop instance
    chatLoop = new ChatLoop(mockMessageHandler);

    // Get readline mock instance
    mockReadline = (readline.createInterface as any).mock.results[0].value;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("start()", () => {
    it("should start chat loop and handle normal conversation flow", async () => {
      mockReadline.question
        .mockImplementationOnce((prompt: string, cb: (input: string) => void) =>
          cb("hello")
        )
        .mockImplementationOnce((prompt: string, cb: (input: string) => void) =>
          cb("q")
        );

      await chatLoop.start();

      expect(mockMessageHandler).toHaveBeenCalledTimes(1);
      expect(mockReadline.close).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Chat started. Type "q" or "Q" to quit.'
      );
    });

    it("should handle empty inputs", async () => {
      mockReadline.question
        .mockImplementationOnce((prompt: string, cb: (input: string) => void) =>
          cb("   ")
        )
        .mockImplementationOnce((prompt: string, cb: (input: string) => void) =>
          cb("q")
        );

      await chatLoop.start();

      expect(mockMessageHandler).toHaveBeenCalledTimes(1);
      expect(mockMessageHandler.mock.calls[0][0].content).toBe("");
    });

    it("should handle message handler errors gracefully", async () => {
      mockReadline.question
        .mockImplementationOnce((prompt: string, cb: (input: string) => void) =>
          cb("trigger error")
        )
        .mockImplementationOnce((prompt: string, cb: (input: string) => void) =>
          cb("q")
        );

      mockMessageHandler.mockRejectedValueOnce(new Error("Processing failed"));

      await chatLoop.start();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error processing message:",
        expect.any(Error)
      );
    });

    it('should end chat on "q" command', async () => {
      mockReadline.question.mockImplementationOnce(
        (prompt: string, cb: (input: string) => void) => cb("q")
      );

      await chatLoop.start();

      expect(mockMessageHandler).not.toHaveBeenCalled();
      expect(mockReadline.close).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith("Chat ended.");
    });

    it('should end chat on "quit" command', async () => {
      mockReadline.question.mockImplementationOnce(
        (prompt: string, cb: (input: string) => void) => cb("quit")
      );

      await chatLoop.start();

      expect(mockMessageHandler).not.toHaveBeenCalled();
      expect(mockReadline.close).toHaveBeenCalled();
    });

    it('should end chat on "exit" command', async () => {
      mockReadline.question.mockImplementationOnce(
        (prompt: string, cb: (input: string) => void) => cb("exit")
      );

      await chatLoop.start();

      expect(mockMessageHandler).not.toHaveBeenCalled();
      expect(mockReadline.close).toHaveBeenCalled();
    });

    it("should handle multiple messages before quitting", async () => {
      mockReadline.question
        .mockImplementationOnce((prompt: string, cb: (input: string) => void) =>
          cb("message 1")
        )
        .mockImplementationOnce((prompt: string, cb: (input: string) => void) =>
          cb("message 2")
        )
        .mockImplementationOnce((prompt: string, cb: (input: string) => void) =>
          cb("q")
        );

      await chatLoop.start();

      expect(mockMessageHandler).toHaveBeenCalledTimes(2);
      expect(mockMessageHandler.mock.calls[0][0].content).toBe("message 1");
      expect(mockMessageHandler.mock.calls[1][0].content).toBe("message 2");
    });
  });
});
