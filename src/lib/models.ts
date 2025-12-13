// Available Gemini models from TanStack AI Gemini package
export const AVAILABLE_MODELS = [
	{ id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
	{ id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash Lite" },
	{ id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
	{ id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
	{ id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
];

// Extract just the model IDs for validation
export const AVAILABLE_MODEL_IDS = AVAILABLE_MODELS.map((m) => m.id);

// Default model
export const DEFAULT_MODEL = "gemini-2.0-flash";
