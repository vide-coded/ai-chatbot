import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/lib/db";
import { ChatMessage } from "./ChatMessage";
import { TanStackChatMessage } from "./TanStackChatMessage";

interface ChatListProps {
	messages: Message[];
	aiMessages?: Array<{
		id: string;
		role: string;
		parts: Array<{ type: string; content?: string }>;
	}>;
	streamingContent?: string;
	isLoading?: boolean;
}

export function ChatList({
	messages,
	aiMessages = [],
	streamingContent,
	isLoading = false,
}: ChatListProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when new messages arrive or streaming updates
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	// Use TanStack AI messages if available, otherwise fall back to IndexedDB messages
	const hasAIMessages = aiMessages.length > 0;

	return (
		<ScrollArea className="flex-1" ref={scrollRef}>
			<div className="flex flex-col">
				{hasAIMessages ? (
					<>
						{/* Render TanStack AI messages with parts support */}
						{aiMessages.map((message) => {
							const isLastMessage =
								message === aiMessages[aiMessages.length - 1];
							const isStreamingMsg =
								isLastMessage && message.role === "assistant";

							return (
								<TanStackChatMessage
									key={message.id}
									role={message.role as "user" | "assistant" | "system"}
									parts={
										message.parts as Array<{
											type:
												| "text"
												| "thinking"
												| "image"
												| "audio"
												| "video"
												| "document";
											content: string;
										}>
									}
									isStreaming={isStreamingMsg && isLoading}
								/>
							);
						})}
					</>
				) : (
					<>
						{/* Render IndexedDB messages (legacy format) */}
						{messages.map((message) => (
							<ChatMessage
								key={message.id}
								role={message.role}
								content={message.content}
								timestamp={message.timestamp}
							/>
						))}

						{streamingContent && (
							// biome-ignore lint/a11y/useValidAriaRole: <don't worry>
							<ChatMessage
								content={streamingContent}
								isStreaming={true}
								role="assistant"
							/>
						)}
					</>
				)}

				{isLoading && !streamingContent && (
					<div className="px-4 py-3">
						<div className="flex gap-3">
							<div className="shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium">
								AI
							</div>
							<div className="flex items-center gap-1">
								<div
									className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
									style={{ animationDelay: "0ms" }}
								/>
								<div
									className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
									style={{ animationDelay: "150ms" }}
								/>
								<div
									className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
									style={{ animationDelay: "300ms" }}
								/>
							</div>
						</div>
					</div>
				)}

				<div ref={bottomRef} />
			</div>
		</ScrollArea>
	);
}
