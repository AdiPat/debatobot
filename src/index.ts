import { ChatLoop } from "./core/chat-loop";
import { naiveChatMessageHandler } from "./core/chat-handlers";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
  override: true,
});

/**
 * Main function to run the SynthLite CLI.
 */
export async function main() {
  const chatLoop = new ChatLoop(naiveChatMessageHandler);
  console.log("Welcome to DebatoBot!");
  console.log("Type 'q' or 'Q' to quit.");
  await chatLoop.start();
}
