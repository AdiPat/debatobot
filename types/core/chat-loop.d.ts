import { MessageHandler } from "../models";
/**
 * ChatLoop manages an interactive chat session with proper input/output handling
 * and error management.
 */
export declare class ChatLoop {
    private readonly messageHandler;
    private readonly rl;
    private isRunning;
    private messageHistory;
    /**
     * Creates a new ChatLoop instance
     * @param messageHandler - Callback function to process each message
     */
    constructor(messageHandler: MessageHandler);
    /**
     * Starts the chat loop and manages the conversation flow
     * @returns Promise that resolves when the chat ends
     */
    start(): Promise<void>;
    /**
     * Gets input from the user
     * @returns Promise with the user's input
     */
    private getUserInput;
    /**
     * Checks if the chat should end based on user input
     * @param input - User input to check
     * @returns boolean indicating if chat should end
     */
    private shouldEndChat;
    /**
     * Displays the response message
     * @param response - Response message to display
     */
    private displayResponse;
    /**
     * Performs cleanup operations
     */
    private cleanup;
}
