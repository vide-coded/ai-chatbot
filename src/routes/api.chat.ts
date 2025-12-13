import { chat, toStreamResponse } from "@tanstack/ai";
import { gemini } from "@tanstack/ai-gemini";
import { createFileRoute } from "@tanstack/react-router";
import {
	chatRequestSchema,
	checkRateLimit,
	getSessionId,
} from "../lib/api-utils";

export const Route = createFileRoute("/api/chat")({
	server: {
		handlers: {
			POST: async ({ request }: { request: Request }) => {
				try {
					// Get session ID for rate limiting
					const sessionId = getSessionId(request);

					// Check rate limit
					const rateLimit = checkRateLimit(sessionId);
					if (!rateLimit.allowed) {
						const resetIn = rateLimit.resetAt
							? Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
							: 60;
						return new Response(
							JSON.stringify({
								error: "Rate limit exceeded",
								message: `Too many requests. Please try again in ${resetIn} seconds.`,
							}),
							{
								status: 429,
								headers: {
									"Content-Type": "application/json",
									"Retry-After": String(resetIn),
								},
							},
						);
					}

					// Parse and validate request body
					const body = await request.json();
					const validationResult = chatRequestSchema.safeParse(body);

					if (!validationResult.success) {
						return new Response(
							JSON.stringify({
								error: "Validation error",
								details: validationResult.error.issues,
							}),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					const { messages, model } = validationResult.data;

					// Check for API key
					const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
					if (!apiKey) {
						return new Response(
							JSON.stringify({
								error: "Configuration error",
								message: "Google API key not configured",
							}),
							{
								status: 500,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					const { conversationId } = validationResult.data;

					// Set the API key in environment for the adapter
					process.env.GEMINI_API_KEY = apiKey;

					// Stream the response with TanStack AI
					const stream = chat({
						adapter: gemini(),
						model: model || "gemini-2.0-flash",
						messages: messages.map((msg) => ({
							role: msg.role,
							content: msg.content,
						})),
						conversationId,
					});

					// Return SSE streaming response
					return toStreamResponse(stream);
				} catch (error) {
					console.error("Chat API error:", error);

					return new Response(
						JSON.stringify({
							error: "Internal server error",
							message:
								error instanceof Error
									? error.message
									: "Unknown error occurred",
						}),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});
