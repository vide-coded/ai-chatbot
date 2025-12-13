import { z } from "zod";
import { AVAILABLE_MODEL_IDS, DEFAULT_MODEL } from "./models";

// Request validation schema
export const chatRequestSchema = z.object({
	conversationId: z.string().min(1, "Conversation ID is required"),
	model: z
		.string()
		.optional()
		.default(DEFAULT_MODEL)
		.refine((val) => AVAILABLE_MODEL_IDS.includes(val), {
			message: "Invalid model ID",
		}),
	messages: z
		.array(
			z.object({
				role: z.enum(["user", "assistant"]),
				content: z.string().min(1, "Message content cannot be empty"),
			}),
		)
		.min(1, "At least one message is required")
		.max(20, "Maximum 20 messages for context"),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

// Rate limiting store (in-memory for MVP)
interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

export function checkRateLimit(sessionId: string): {
	allowed: boolean;
	resetAt?: number;
} {
	const now = Date.now();
	const entry = rateLimitStore.get(sessionId);

	// Clean up expired entries
	if (entry && entry.resetAt < now) {
		rateLimitStore.delete(sessionId);
	}

	const currentEntry = rateLimitStore.get(sessionId);

	if (!currentEntry) {
		// First request in window
		rateLimitStore.set(sessionId, {
			count: 1,
			resetAt: now + RATE_LIMIT_WINDOW,
		});
		return { allowed: true };
	}

	if (currentEntry.count >= RATE_LIMIT_MAX_REQUESTS) {
		return {
			allowed: false,
			resetAt: currentEntry.resetAt,
		};
	}

	// Increment counter
	currentEntry.count++;
	rateLimitStore.set(sessionId, currentEntry);

	return { allowed: true };
}

// Get or create session ID from headers/cookies
export function getSessionId(request: Request): string {
	// For MVP, use a simple header-based session
	// In production, use proper session management
	const sessionId =
		request.headers.get("x-session-id") ||
		`session-${Date.now()}-${Math.random()}`;
	return sessionId;
}
