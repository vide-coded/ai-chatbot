import type { Conversation } from "@/lib/db";
import { cn } from "@/lib/utils";
import { ConversationList } from "./ConversationList";
import { NewChatButton } from "./NewChatButton";

interface SidebarProps {
	conversations: Conversation[];
	activeConversationId: string | null;
	onSelectConversation: (id: string) => void;
	onDeleteConversation: (id: string) => void;
	onNewChat: () => void;
	isOpen: boolean;
	className?: string;
}

export function Sidebar({
	conversations,
	activeConversationId,
	onSelectConversation,
	onDeleteConversation,
	onNewChat,
	isOpen,
	className,
}: SidebarProps) {
	return (
		<>
			{/* Mobile overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
					aria-hidden="true"
				/>
			)}

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-border bg-background transition-transform duration-300 ease-in-out md:relative md:top-0 md:h-full md:translate-x-0",
					!isOpen && "-translate-x-full md:translate-x-0",
					isOpen && "translate-x-0",
					className,
				)}
			>
				<div className="flex h-full flex-col">
					{/* New Chat Button */}
					<div className="shrink-0 p-3 border-b border-border">
						<NewChatButton onClick={onNewChat} />
					</div>

					{/* Conversation List */}
					<div className="flex-1 min-h-0">
						<ConversationList
							conversations={conversations}
							activeConversationId={activeConversationId}
							onSelectConversation={onSelectConversation}
							onDeleteConversation={onDeleteConversation}
						/>
					</div>

					{/* Footer */}
					<div className="shrink-0 border-t border-border p-3">
						<p className="text-xs text-muted-foreground">Powered by Gemini</p>
					</div>
				</div>
			</aside>
		</>
	);
}
