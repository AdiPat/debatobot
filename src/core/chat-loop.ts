import * as readline from "readline";

/** Represents a chat message structure */
interface ChatMessage {
  content: string;
  timestamp: Date;
}

/** Type definition for the message handler callback */
type MessageHandler = (message: ChatMessage) => Promise<ChatMessage>;

/**
 * ChatLoop manages an interactive chat session with proper input/output handling
 * and error management.
 */
export class ChatLoop {
  private readonly rl: readline.Interface;
  private isRunning: boolean = false;

  /**
   * Creates a new ChatLoop instance
   * @param messageHandler - Callback function to process each message
   */
  constructor(private readonly messageHandler: MessageHandler) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Starts the chat loop and manages the conversation flow
   * @returns Promise that resolves when the chat ends
   */
  public async start(): Promise<void> {
    this.isRunning = true;
    console.log('Chat started. Type "q" or "Q" to quit.');

    try {
      while (this.isRunning) {
        const input = await this.getUserInput();

        if (this.shouldEndChat(input)) {
          break;
        }

        const message: ChatMessage = {
          content: input,
          timestamp: new Date(),
        };

        try {
          const response = await this.messageHandler(message);
          this.displayResponse(response);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    } finally {
      this.cleanup();
    }
  }

  /**
   * Gets input from the user
   * @returns Promise with the user's input
   */
  private getUserInput(): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question("You: ", (input) => {
        resolve(input.trim());
      });
    });
  }

  /**
   * Checks if the chat should end based on user input
   * @param input - User input to check
   * @returns boolean indicating if chat should end
   */
  private shouldEndChat(input: string): boolean {
    const normalizedInput = input.toLowerCase();
    return (
      normalizedInput === "q" ||
      normalizedInput === "quit" ||
      normalizedInput === "exit"
    );
  }

  /**
   * Displays the response message
   * @param response - Response message to display
   */
  private displayResponse(response: ChatMessage): void {
    console.log("Bot:", response.content);
  }

  /**
   * Performs cleanup operations
   */
  private cleanup(): void {
    this.isRunning = false;
    this.rl.close();
    console.log("Chat ended.");
  }
}
