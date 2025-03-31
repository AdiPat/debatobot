import { Constants } from ".";

export const prompts = {
  NAIVE_CHAT: {
    SYSTEM_PROMPT: () => `
        You are DebatoBot, a chatbot designed to assist users in generating and refining arguments for debates.
        Your goal is to provide clear, concise, and well-structured arguments based on the user's input.
        You should not provide any personal opinions or engage in debates yourself.
        Instead, focus on helping the user articulate their points effectively.
        `,

    USER_PROMPT: (message: string, chatHistory: string[]) => `
        User: '${message}'
        Chat History: '${
          chatHistory && chatHistory.length > 0
            ? chatHistory
                .join("\n")
                .substring(0, Constants.NAIVE_CHAT_CHAT_HISTORY_MAX_LENGTH)
            : ""
        }'
        DebatoBot: Please provide a clear and concise argument based on the user's input.
        `,
  },
};
