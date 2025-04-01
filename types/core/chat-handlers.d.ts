import { ChatMessage } from "../models";
/**
 * Handles chat messages using a naive approach with GPT-4o model.
 *
 * @param message - The chat message to process, containing content and optional message history
 * @returns Promise<ChatMessage> - A promise that resolves to a new chat message containing:
 *                                - content: AI generated response
 *                                - timestamp: When the response was generated
 *                                - history: Updated conversation history including the input message
 *
 */
export declare function naiveChatMessageHandler(message: ChatMessage): Promise<ChatMessage>;
