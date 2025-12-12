import Dexie, { type EntityTable } from "dexie";

// TypeScript interfaces for our data models
export interface Conversation {
	id: string;
	title: string;
	createdAt: number;
	updatedAt: number;
	model: "gemini-pro";
}

export interface Message {
	id: string;
	conversationId: string;
	role: "user" | "assistant";
	content: string;
	timestamp: number;
}

// Dexie database class
class ChatDatabase extends Dexie {
	conversations!: EntityTable<Conversation, "id">;
	messages!: EntityTable<Message, "id">;

	constructor() {
		super("ChatDatabase");

		this.version(1).stores({
			conversations: "id, createdAt, updatedAt",
			messages: "id, conversationId, timestamp, [conversationId+timestamp]",
		});
	}
}

// Create and export database instance
export const db = new ChatDatabase();

// Helper function to generate IDs
export function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Type-safe query helpers
export const dbHelpers = {
	// Get all conversations ordered by most recent
	async getConversations(): Promise<Conversation[]> {
		return db.conversations.orderBy("updatedAt").reverse().toArray();
	},

	// Get a single conversation by ID
	async getConversation(id: string): Promise<Conversation | undefined> {
		return db.conversations.get(id);
	},

	// Get all messages for a conversation ordered by timestamp
	async getMessages(conversationId: string): Promise<Message[]> {
		return db.messages
			.where("conversationId")
			.equals(conversationId)
			.sortBy("timestamp");
	},

	// Get conversation with its messages
	async getConversationWithMessages(id: string): Promise<{
		conversation: Conversation | undefined;
		messages: Message[];
	}> {
		const conversation = await db.conversations.get(id);
		const messages = conversation
			? await db.messages.where("conversationId").equals(id).sortBy("timestamp")
			: [];

		return { conversation, messages };
	},

	// Create a new conversation
	async createConversation(
		title: string = "New Conversation",
	): Promise<Conversation> {
		const conversation: Conversation = {
			id: generateId(),
			title,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			model: "gemini-pro",
		};

		await db.conversations.add(conversation);
		return conversation;
	},

	// Update conversation (mainly for title and updatedAt)
	async updateConversation(
		id: string,
		updates: Partial<Omit<Conversation, "id" | "createdAt">>,
	): Promise<void> {
		await db.conversations.update(id, {
			...updates,
			updatedAt: Date.now(),
		});
	},

	// Delete a conversation and all its messages
	async deleteConversation(id: string): Promise<void> {
		await db.transaction("rw", [db.conversations, db.messages], async () => {
			await db.messages.where("conversationId").equals(id).delete();
			await db.conversations.delete(id);
		});
	},

	// Add a message to a conversation
	async addMessage(
		conversationId: string,
		role: "user" | "assistant",
		content: string,
	): Promise<Message> {
		const message: Message = {
			id: generateId(),
			conversationId,
			role,
			content,
			timestamp: Date.now(),
		};

		await db.transaction("rw", [db.messages, db.conversations], async () => {
			await db.messages.add(message);
			await db.conversations.update(conversationId, {
				updatedAt: Date.now(),
			});
		});

		return message;
	},

	// Get the last N messages from a conversation (for context window)
	async getLastMessages(
		conversationId: string,
		limit: number = 10,
	): Promise<Message[]> {
		const messages = await db.messages
			.where("conversationId")
			.equals(conversationId)
			.reverse()
			.limit(limit)
			.toArray();

		return messages.reverse();
	},

	// Delete all data (for testing/reset)
	async clearAll(): Promise<void> {
		await db.transaction("rw", [db.conversations, db.messages], async () => {
			await db.conversations.clear();
			await db.messages.clear();
		});
	},
};

// Export types
export type { EntityTable } from "dexie";
