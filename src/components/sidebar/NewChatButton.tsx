import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewChatButtonProps {
	onClick: () => void;
	disabled?: boolean;
}

export function NewChatButton({
	onClick,
	disabled = false,
}: NewChatButtonProps) {
	return (
		<Button
			onClick={onClick}
			disabled={disabled}
			className="w-full justify-start gap-2"
			variant="outline"
		>
			<MessageSquarePlus className="h-4 w-4" />
			New Chat
		</Button>
	);
}
