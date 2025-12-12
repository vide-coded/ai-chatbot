import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Conversation, dbHelpers, type Message } from "./db";

// Query keys for cache management
export const queryKeys = {
	conversations: ["conversations"] as const,
	conversation: (id: string) => ["conversation", id] as const,
	messages: (conversationId: string) => ["messages", conversationId] as const,
	conversationWithMessages: (id: string) =>
		["conversationWithMessages", id] as const,
};

// Hook to get all conversations
export function useConversations() {
	return useQuery({
		queryKey: queryKeys.conversations,
		queryFn: dbHelpers.getConversations,
	});
}

// Hook to get a single conversation
export function useConversation(id: string | undefined) {
	return useQuery({
		queryKey: queryKeys.conversation(id || ""),
		queryFn: () => (id ? dbHelpers.getConversation(id) : undefined),
		enabled: !!id,
	});
}

// Hook to get messages for a conversation
export function useMessages(conversationId: string | undefined) {
	return useQuery({
		queryKey: queryKeys.messages(conversationId || ""),
		queryFn: () =>
			conversationId ? dbHelpers.getMessages(conversationId) : [],
		enabled: !!conversationId,
	});
}

// Hook to get conversation with messages
export function useConversationWithMessages(id: string | undefined) {
	return useQuery({
		queryKey: queryKeys.conversationWithMessages(id || ""),
		queryFn: () =>
			id
				? dbHelpers.getConversationWithMessages(id)
				: { conversation: undefined, messages: [] },
		enabled: !!id,
	});
}

// Hook to create a new conversation
export function useCreateConversation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (title?: string) => dbHelpers.createConversation(title),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
		},
	});
}

// Hook to update a conversation
export function useUpdateConversation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			updates,
		}: {
			id: string;
			updates: Partial<Omit<Conversation, "id" | "createdAt">>;
		}) => dbHelpers.updateConversation(id, updates),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
			queryClient.invalidateQueries({
				queryKey: queryKeys.conversation(variables.id),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.conversationWithMessages(variables.id),
			});
		},
	});
}

// Hook to delete a conversation
export function useDeleteConversation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => dbHelpers.deleteConversation(id),
		onSuccess: (_data, id) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
			queryClient.invalidateQueries({ queryKey: queryKeys.conversation(id) });
			queryClient.invalidateQueries({ queryKey: queryKeys.messages(id) });
			queryClient.invalidateQueries({
				queryKey: queryKeys.conversationWithMessages(id),
			});
		},
	});
}

// Hook to add a message
export function useAddMessage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			conversationId,
			role,
			content,
		}: {
			conversationId: string;
			role: "user" | "assistant";
			content: string;
		}) => dbHelpers.addMessage(conversationId, role, content),
		onMutate: async (variables) => {
			// Optimistic update
			await queryClient.cancelQueries({
				queryKey: queryKeys.messages(variables.conversationId),
			});

			const previousMessages = queryClient.getQueryData<Message[]>(
				queryKeys.messages(variables.conversationId),
			);

			// Optimistically add the new message
			if (previousMessages) {
				queryClient.setQueryData<Message[]>(
					queryKeys.messages(variables.conversationId),
					[
						...previousMessages,
						{
							id: `temp-${Date.now()}`,
							conversationId: variables.conversationId,
							role: variables.role,
							content: variables.content,
							timestamp: Date.now(),
						},
					],
				);
			}

			return { previousMessages };
		},
		onError: (_err, variables, context) => {
			// Rollback on error
			if (context?.previousMessages) {
				queryClient.setQueryData(
					queryKeys.messages(variables.conversationId),
					context.previousMessages,
				);
			}
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.messages(variables.conversationId),
			});
			queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
			queryClient.invalidateQueries({
				queryKey: queryKeys.conversationWithMessages(variables.conversationId),
			});
		},
	});
}

// Hook to clear all data
export function useClearAll() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: dbHelpers.clearAll,
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
	});
}
