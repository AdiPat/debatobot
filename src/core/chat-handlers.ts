import { ChatMessage } from "../models";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { prompts } from "../common";

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
export async function naiveChatMessageHandler(
  message: ChatMessage
): Promise<ChatMessage> {
  const timestamp = new Date();

  const { text: response } = await generateText({
    model: openai("gpt-4o"),
    system: prompts.NAIVE_CHAT.SYSTEM_PROMPT(),
    prompt: prompts.NAIVE_CHAT.USER_PROMPT(
      message.content,
      message.history?.map((msg) => msg.content) || []
    ),
  }).catch((error) => {
    console.error("Error generating response:", error);
    return {
      text: "An error occurred while generating the response.",
    };
  });

  return {
    content: response,
    timestamp,
    history: message.history ? [...message.history, message] : [message],
  };
}
