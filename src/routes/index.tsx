import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useCallback, useEffect, useState } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatList } from "@/components/chat/ChatList";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Header } from "@/components/layout/Header";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { Sidebar } from "@/components/sidebar/Sidebar";
import {
	useConversations,
	useCreateConversation,
	useDeleteConversation,
	useMessages,
	useUpdateConversation,
} from "@/lib/queries";
import { chatActions, chatStore } from "@/lib/store";
import { useOnlineStatus } from "@/lib/use-online-status";
import { useTanStackChat } from "@/lib/use-tanstack-chat";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { activeConversationId, isSidebarOpen, selectedModel } =
		useStore(chatStore);
	const isOnline = useOnlineStatus();
	const [dismissedError, setDismissedError] = useState(false);
	const [mounted, setMounted] = useState(false);

	// Fetch conversations
	const { data: conversations = [], isLoading: conversationsLoading } =
		useConversations();

	// Fetch messages for active conversation
	const { data: messages = [] } = useMessages(
		activeConversationId || undefined,
	);

	// Mutations
	const createConversation = useCreateConversation();
	const deleteConversation = useDeleteConversation();
	const updateConversation = useUpdateConversation();

	// TanStack AI Chat
	const {
		messages: aiMessages,
		sendMessage,
		isLoading: isStreaming,
		error: streamError,
	} = useTanStackChat({
		conversationId: activeConversationId || "",
		model: selectedModel,
		onStreamComplete: async (fullResponse) => {
			// Generate title from first message if conversation is new
			if (activeConversationId && messages.length === 0) {
				const title =
					fullResponse.slice(0, 50) + (fullResponse.length > 50 ? "..." : "");
				await updateConversation.mutateAsync({
					id: activeConversationId,
					updates: { title },
				});
			}
		},
		onError: (error) => {
			console.error("Streaming error:", error);
		},
	});

	// Get the currently streaming message (last assistant message)
	const lastMessage = aiMessages[aiMessages.length - 1];
	const streamingContent =
		isStreaming && lastMessage?.role === "assistant"
			? lastMessage.parts
					.filter((p) => "content" in p && p.type === "text")
					.map((p) => (p as { type: string; content: string }).content)
					.join("")
			: undefined;

	// Set mounted state for hydration
	useEffect(() => {
		setMounted(true);
	}, []);

	// Handlers
	const handleNewChat = useCallback(async () => {
		const newConversation =
			await createConversation.mutateAsync("New Conversation");
		chatActions.setActiveConversation(newConversation.id);

		// Close sidebar on mobile after creating new chat
		if (window.innerWidth < 768) {
			chatActions.setSidebarOpen(false);
		}
	}, [createConversation]);

	// Create initial conversation if none exists
	useEffect(() => {
		if (
			!conversationsLoading &&
			conversations.length === 0 &&
			!activeConversationId
		) {
			handleNewChat();
		}
	}, [
		conversationsLoading,
		conversations.length,
		activeConversationId,
		handleNewChat,
	]);

	// Auto-select first conversation if none is selected
	useEffect(() => {
		if (conversations.length > 0 && !activeConversationId) {
			chatActions.setActiveConversation(conversations[0].id);
		}
	}, [conversations, activeConversationId]);

	// Reset dismissed error when error changes
	useEffect(() => {
		if (streamError) {
			setDismissedError(false);
		}
	}, [streamError]);

	const handleSelectConversation = (id: string) => {
		chatActions.setActiveConversation(id);

		// Close sidebar on mobile after selecting
		if (window.innerWidth < 768) {
			chatActions.setSidebarOpen(false);
		}
	};

	const handleDeleteConversation = async (id: string) => {
		await deleteConversation.mutateAsync(id);

		// If deleted conversation was active, select another
		if (id === activeConversationId) {
			const remaining = conversations.filter((c) => c.id !== id);
			if (remaining.length > 0) {
				chatActions.setActiveConversation(remaining[0].id);
			} else {
				chatActions.setActiveConversation(null);
				handleNewChat();
			}
		}
	};

	const handleSendMessage = (message: string) => {
		if (!activeConversationId) return;
		sendMessage(message);
	};

	const handleToggleSidebar = () => {
		chatActions.toggleSidebar();
	};

	// Show a loading skeleton during SSR/hydration to prevent mismatch
	if (!mounted) {
		return (
			<div className="flex h-screen flex-col">
				<Header onMenuClick={handleToggleSidebar} isSidebarOpen={false} />
				<div className="flex flex-1 overflow-hidden">
					<Sidebar
						conversations={[]}
						activeConversationId={null}
						onSelectConversation={handleSelectConversation}
						onDeleteConversation={handleDeleteConversation}
						onNewChat={handleNewChat}
						isOpen={false}
					/>
					<main className="flex flex-1 flex-col overflow-hidden">
						<div className="flex-1 flex items-center justify-center">
							<div className="text-center">
								<h2 className="text-2xl font-semibold mb-2">
									Welcome to AI Chat
								</h2>
								<p className="text-muted-foreground">
									Create a new conversation to get started
								</p>
							</div>
						</div>
					</main>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen flex-col">
			<Header onMenuClick={handleToggleSidebar} isSidebarOpen={isSidebarOpen} />

			<div className="flex flex-1 overflow-hidden">
				<Sidebar
					conversations={conversations}
					activeConversationId={activeConversationId}
					onSelectConversation={handleSelectConversation}
					onDeleteConversation={handleDeleteConversation}
					onNewChat={handleNewChat}
					isOpen={isSidebarOpen}
				/>

				<main className="flex flex-1 flex-col overflow-hidden">
					{activeConversationId ? (
						<>
							{/* Offline indicator */}
							{!isOnline && (
								<div className="p-4">
									<OfflineIndicator />
								</div>
							)}

							{messages.length === 0 &&
							!streamingContent &&
							aiMessages.length === 0 ? (
								<div className="flex-1 flex items-center justify-center text-center p-8">
									<div className="max-w-md space-y-3">
										<h3 className="text-lg font-medium text-foreground">
											Start a conversation
										</h3>
										<p className="text-sm text-muted-foreground">
											Send a message to begin chatting with the AI assistant.
										</p>
									</div>
								</div>
							) : (
								<ChatList
									messages={messages}
									aiMessages={aiMessages}
									streamingContent={streamingContent}
									isLoading={isStreaming && !streamingContent}
								/>
							)}

							{/* Error message */}
							{streamError && !dismissedError && (
								<div className="p-4">
									<ErrorMessage
										title="Message failed"
										message={
											streamError.message.includes("rate limit")
												? "Too many requests. Please wait a moment before trying again."
												: streamError.message.includes("quota")
													? "API quota exceeded. Please try again later or contact support."
													: streamError.message
										}
										onRetry={() => {
											setDismissedError(true);
											if (messages.length > 0) {
												const lastUserMessage = messages
													.filter((m) => m.role === "user")
													.pop();
												if (lastUserMessage) {
													sendMessage(lastUserMessage.content);
												}
											}
										}}
										onDismiss={() => setDismissedError(true)}
									/>
								</div>
							)}

							<ChatInput
								onSend={handleSendMessage}
								disabled={isStreaming || !activeConversationId || !isOnline}
								placeholder={
									!isOnline
										? "No internet connection..."
										: isStreaming
											? "AI is responding..."
											: "Send a message..."
								}
							/>
						</>
					) : (
						<div className="flex-1 flex items-center justify-center">
							<div className="text-center">
								<h2 className="text-2xl font-semibold mb-2">
									Welcome to AI Chat
								</h2>
								<p className="text-muted-foreground">
									Create a new conversation to get started
								</p>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
