import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/lib/db";
import { cn } from "@/lib/utils";

interface ConversationListProps {
	conversations: Conversation[];
	activeConversationId: string | null;
	onSelectConversation: (id: string) => void;
	onDeleteConversation: (id: string) => void;
}

export function ConversationList({
	conversations,
	activeConversationId,
	onSelectConversation,
	onDeleteConversation,
}: ConversationListProps) {
	if (conversations.length === 0) {
		return (
			<div className="flex-1 flex items-center justify-center p-4">
				<p className="text-sm text-muted-foreground text-center">
					No conversations yet.
					<br />
					Start a new chat to begin.
				</p>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto">
			<div className="space-y-1 p-2">
				{conversations.map((conversation) => {
					const isActive = conversation.id === activeConversationId;
					const formattedDate = new Intl.DateTimeFormat("en-US", {
						month: "short",
						day: "numeric",
					}).format(new Date(conversation.updatedAt));

					return (
						<div
							key={conversation.id}
							className={cn(
								"group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50",
								isActive && "bg-muted",
							)}
						>
							<button
								type="button"
								onClick={() => onSelectConversation(conversation.id)}
								className="flex-1 flex items-center gap-2 text-left min-w-0"
								aria-label={`Select conversation: ${conversation.title}`}
							>
								<MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
								<div className="flex-1 min-w-0">
									<p className="font-medium truncate">{conversation.title}</p>
									<p className="text-xs text-muted-foreground">
										{formattedDate}
									</p>
								</div>
							</button>

							<Button
								variant="ghost"
								size="icon"
								onClick={(e) => {
									e.stopPropagation();
									if (confirm("Delete this conversation?")) {
										onDeleteConversation(conversation.id);
									}
								}}
								className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
								aria-label="Delete conversation"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						</div>
					);
				})}
			</div>
		</div>
	);
}
