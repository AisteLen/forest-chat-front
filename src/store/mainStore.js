import {create} from "zustand";
import http from "../plugins/http";

const useStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('authToken') || "",
    conversationsCount: 0,
    setUser: (val) => {
        localStorage.setItem('user', JSON.stringify(val));
        set({ user: val });
    },
    setToken: (val) => {
        localStorage.setItem('authToken', val);
        set({ token: val });
    },
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        set({ user: null, token: "", conversationsCount: 0 });
    },
    fetchConversationsCount: async () => {
        const user = get().user;
        if (user) {
            try {
                const res = await http.get(`/conversations/${user.username}`);
                if (!res.error) {
                    set({ conversationsCount: res.conversations.length });
                }
            } catch (err) {
                console.error("Failed to fetch conversations count.");
            }
        }
    },
}));

export default useStore