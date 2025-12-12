import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
	onMenuClick?: () => void;
	isSidebarOpen?: boolean;
}

export function Header({ onMenuClick, isSidebarOpen = true }: HeaderProps) {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="flex h-14 items-center px-4 gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={onMenuClick}
					className="md:hidden h-9 w-9"
					aria-label="Toggle sidebar"
				>
					{isSidebarOpen ? (
						<X className="h-5 w-5" />
					) : (
						<Menu className="h-5 w-5" />
					)}
				</Button>

				<div className="flex-1 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<h1 className="text-lg font-semibold">AI Chat</h1>
					</div>

					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
