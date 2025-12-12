import { Check, Copy } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StreamingTextProps {
	content: string;
	isStreaming?: boolean;
}

export function StreamingText({
	content,
	isStreaming = false,
}: StreamingTextProps) {
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

interface ChatMessageProps {
	role: "user" | "assistant";
	content: string;
	timestamp?: number;
	isStreaming?: boolean;
}

export function ChatMessage({
	role,
	content,
	timestamp,
	isStreaming = false,
}: ChatMessageProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(content);
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

				<div className="text-sm text-foreground">
					<StreamingText content={content} isStreaming={isStreaming} />
				</div>

				{!isStreaming && content && (
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
