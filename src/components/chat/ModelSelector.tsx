import { useStore } from "@tanstack/react-store";
import { useId } from "react";
import { chatActions, chatStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// Available Gemini models from TanStack AI Gemini package
const AVAILABLE_MODELS = [
	{ id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
	{ id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash Lite" },
	{ id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
	{ id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
	{ id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
];

export function ModelSelector() {
	const selectId = useId();
	const { selectedModel } = useStore(chatStore);

	const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		chatActions.setSelectedModel(e.target.value);
	};

	return (
		<div className="flex items-center gap-2">
			<label
				htmlFor={selectId}
				className="text-xs text-muted-foreground whitespace-nowrap"
			>
				Model:
			</label>
			<select
				id={selectId}
				value={selectedModel}
				onChange={handleModelChange}
				className={cn(
					"text-xs bg-background border border-border rounded px-2 py-1",
					"focus:outline-none focus:ring-1 focus:ring-ring",
					"hover:bg-muted transition-colors",
				)}
				aria-label="Select AI model"
			>
				{AVAILABLE_MODELS.map((model) => (
					<option key={model.id} value={model.id}>
						{model.name}
					</option>
				))}
			</select>
		</div>
	);
}
