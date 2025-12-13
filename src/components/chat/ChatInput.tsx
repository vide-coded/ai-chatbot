import { Send } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ModelSelector } from "./ModelSelector";

interface ChatInputProps {
	onSend: (message: string) => void;
	disabled?: boolean;
	placeholder?: string;
}

export function ChatInput({
	onSend,
	disabled = false,
	placeholder = "Send a message...",
}: ChatInputProps) {
	const [input, setInput] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Auto-resize textarea
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = () => {
		const trimmedInput = input.trim();
		if (trimmedInput && !disabled) {
			onSend(trimmedInput);
			setInput("");
			// Reset textarea height
			if (textareaRef.current) {
				textareaRef.current.style.height = "auto";
			}
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		// Submit on Enter (without Shift)
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className="border-t border-border bg-background p-4">
			<div className="max-w-4xl mx-auto">
				<div className="relative flex items-end gap-2">
					<Textarea
						ref={textareaRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						disabled={disabled}
						rows={1}
						className={cn("resize-none pr-12", "focus-visible:ring-1")}
						aria-label="Chat message input"
					/>
					<Button
						onClick={handleSubmit}
						disabled={disabled || !input.trim()}
						size="icon"
						className="absolute right-2 bottom-2 h-8 w-8"
						aria-label="Send message"
					>
						<Send className="w-4 h-4" />
					</Button>
				</div>
				<div className="flex items-center justify-between mt-2 px-1">
					<p className="text-xs text-muted-foreground">
						Press{" "}
						<kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to
						send,{" "}
						<kbd className="px-1 py-0.5 bg-muted rounded text-xs">
							Shift + Enter
						</kbd>{" "}
						for new line
					</p>
					<ModelSelector />
				</div>
			</div>
		</div>
	);
}
