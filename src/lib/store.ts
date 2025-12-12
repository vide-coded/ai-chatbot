import { Store } from "@tanstack/store";

interface ChatState {
	activeConversationId: string | null;
	isSidebarOpen: boolean;
}

// Create the chat store
export const chatStore = new Store<ChatState>({
	activeConversationId: null,
	isSidebarOpen: true,
});

// Store actions
export const chatActions = {
	setActiveConversation: (conversationId: string | null) => {
		chatStore.setState((state) => ({
			...state,
			activeConversationId: conversationId,
		}));
	},

	toggleSidebar: () => {
		chatStore.setState((state) => ({
			...state,
			isSidebarOpen: !state.isSidebarOpen,
		}));
	},

	setSidebarOpen: (isOpen: boolean) => {
		chatStore.setState((state) => ({
			...state,
			isSidebarOpen: isOpen,
		}));
	},
};

// Persist active conversation to localStorage
if (typeof window !== "undefined") {
	const savedConversationId = localStorage.getItem("activeConversationId");
	if (savedConversationId) {
		chatActions.setActiveConversation(savedConversationId);
	}

	chatStore.subscribe(() => {
		const state = chatStore.state;
		if (state.activeConversationId) {
			localStorage.setItem("activeConversationId", state.activeConversationId);
		} else {
			localStorage.removeItem("activeConversationId");
		}
	});
}
