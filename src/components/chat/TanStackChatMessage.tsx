import { Check, Copy } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessagePart {
	type: "text" | "thinking" | "image" | "audio" | "video" | "document";
	content: string;
}

interface TanStackChatMessageProps {
	role: "user" | "assistant" | "system";
	parts: MessagePart[];
	timestamp?: number;
	isStreaming?: boolean;
}

function StreamingText({
	content,
	isStreaming = false,
}: {
	content: string;
	isStreaming?: boolean;
}) {
	return (
		<div className="prose prose-sm dark:prose-invert max-w-none">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeHighlight]}
			>
				{content}
			</ReactMarkdown>
			{isStreaming && (
				<span className="inline-block w-1 h-4 ml-0.5 bg-primary animate-pulse" />
			)}
		</div>
	);
}

function ThinkingIndicator({ content }: { content: string }) {
	return (
		<div className="text-sm text-muted-foreground italic mb-2 p-2 bg-muted/30 rounded">
			💭 Thinking: {content}
		</div>
	);
}

export function TanStackChatMessage({
	role,
	parts,
	timestamp,
	isStreaming = false,
}: TanStackChatMessageProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		const textContent = parts
			.filter((p) => p.type === "text")
			.map((p) => p.content)
			.join("\n");
		await navigator.clipboard.writeText(textContent);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const formattedTime = timestamp
		? new Intl.DateTimeFormat("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			}).format(new Date(timestamp))
		: "";

	const isUser = role === "user";
	const hasContent = parts.some((p) => p.content.trim());

	return (
		<div
			className={cn(
				"group flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
				isUser && "bg-muted/30",
			)}
		>
			<div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium">
				<div
					className={cn(
						"w-full h-full rounded-full flex items-center justify-center",
						isUser
							? "bg-primary text-primary-foreground"
							: "bg-muted text-muted-foreground",
					)}
				>
					{isUser ? "U" : "AI"}
				</div>
			</div>

			<div className="flex-1 min-w-0 space-y-2">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">
						{isUser ? "You" : "Assistant"}
					</span>
					{timestamp && (
						<span className="text-xs text-muted-foreground">
							{formattedTime}
						</span>
					)}
				</div>

				<div className="text-sm text-foreground space-y-2">
					{parts.map((part, idx) => {
						const partKey = `${part.type}-${idx}-${part.content.slice(0, 20)}`;

						if (part.type === "thinking") {
							return <ThinkingIndicator key={partKey} content={part.content} />;
						}

						if (part.type === "text") {
							return (
								<StreamingText
									key={partKey}
									content={part.content}
									isStreaming={isStreaming && idx === parts.length - 1}
								/>
							);
						}

						// Fallback for other types
						return (
							<div key={partKey} className="text-muted-foreground text-xs">
								[{part.type}]: {part.content}
							</div>
						);
					})}
				</div>

				{!isStreaming && hasContent && (
					<div className="opacity-0 group-hover:opacity-100 transition-opacity">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleCopy}
							className="h-7 px-2 text-xs"
							aria-label="Copy message"
						>
							{copied ? (
								<>
									<Check className="w-3 h-3 mr-1" />
									Copied
								</>
							) : (
								<>
									<Copy className="w-3 h-3 mr-1" />
									Copy
								</>
							)}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
