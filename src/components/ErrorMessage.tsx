import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
	title?: string;
	message: string;
	onRetry?: () => void;
	onDismiss?: () => void;
}

export function ErrorMessage({
	title = "Error",
	message,
	onRetry,
	onDismiss,
}: ErrorMessageProps) {
	return (
		<div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
			<AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
			<div className="flex-1 space-y-1">
				<p className="text-sm font-medium text-destructive">{title}</p>
				<p className="text-xs text-destructive/90">{message}</p>
			</div>
			<div className="flex shrink-0 gap-2">
				{onRetry && (
					<Button onClick={onRetry} variant="outline" size="sm">
						Retry
					</Button>
				)}
				{onDismiss && (
					<Button onClick={onDismiss} variant="ghost" size="sm">
						Dismiss
					</Button>
				)}
			</div>
		</div>
	);
}
