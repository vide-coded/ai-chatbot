import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { DEFAULT_MODEL } from "./models";
import { useAddMessage } from "./queries";

interface UseTanStackChatOptions {
	conversationId: string;
	model?: string;
	onStreamComplete?: (fullResponse: string) => void;
	onError?: (error: Error) => void;
}

export function useTanStackChat({
	conversationId,
	model = DEFAULT_MODEL,
	onStreamComplete,
	onError,
}: UseTanStackChatOptions) {
	const addMessage = useAddMessage();

	const chat = useChat({
		connection: fetchServerSentEvents("/api/chat"),
		body: {
			conversationId,
			model,
		},
		onFinish: async (message) => {
			// Save assistant message to IndexedDB when complete
			if (message.role === "assistant") {
				const textContent = message.parts
					.filter((part) => "content" in part && part.type === "text")
					.map((part) => (part as { type: string; content: string }).content)
					.join("\n");

				if (textContent.trim()) {
					await addMessage.mutateAsync({
						conversationId,
						role: message.role,
						content: textContent,
					});
				}

				onStreamComplete?.(textContent);
			}
		},
		onError: (error) => {
			console.error("TanStack AI Chat error:", error);
			onError?.(error);
		},
	});

	// Wrapper to save user messages to IndexedDB before sending
	const sendMessageWithPersistence = async (content: string) => {
		// Save user message first
		await addMessage.mutateAsync({
			conversationId,
			role: "user",
			content,
		});

		// Then send to AI
		return chat.sendMessage(content);
	};

	return {
		messages: chat.messages,
		sendMessage: sendMessageWithPersistence,
		isLoading: chat.isLoading,
		error: chat.error,
		stop: chat.stop,
		reload: chat.reload,
	};
}
