import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OfflineIndicatorProps {
	onRetry?: () => void;
}

export function OfflineIndicator({ onRetry }: OfflineIndicatorProps) {
	return (
		<div className="flex items-center justify-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
			<WifiOff className="h-5 w-5 text-destructive" />
			<div className="flex-1">
				<p className="text-sm font-medium text-destructive">
					No internet connection
				</p>
				<p className="text-xs text-destructive/80">
					Please check your connection and try again
				</p>
			</div>
			{onRetry && (
				<Button
					onClick={onRetry}
					variant="outline"
					size="sm"
					className="shrink-0"
				>
					Retry
				</Button>
			)}
		</div>
	);
}
