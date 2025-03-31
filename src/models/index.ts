/** Represents a chat message structure */
export interface ChatMessage {
  content: string;
  timestamp: Date;
  history?: ChatMessage[];
}

/** Type definition for the message handler callback */
export type MessageHandler = (message: ChatMessage) => Promise<ChatMessage>;
