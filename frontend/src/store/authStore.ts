import { create } from 'zustand';
import api from '../api/client';

// ─── Types ───
export interface User {
    id: number;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    created_at: string;
}

export interface Model3D {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    file_path: string;
    original_photo_path: string | null;
    thumbnail_url: string | null;
    is_public: boolean;
    likes_count: number;
    created_at: string;
    owner?: User;
    is_liked: boolean;
    is_favorited: boolean;
}

// ─── Auth Store ───
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: !!localStorage.getItem('access_token'),
    isLoading: false,

    login: async (username, password) => {
        const { data } = await api.post('/auth/login', { username, password });
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        set({ isAuthenticated: true });

        // Fetch user profile
        const { data: user } = await api.get('/users/me');
        set({ user });
    },

    register: async (username, email, password) => {
        const { data } = await api.post('/auth/register', { username, email, password });
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        set({ isAuthenticated: true });

        const { data: user } = await api.get('/users/me');
        set({ user });
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false });
    },

    fetchMe: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get('/users/me');
            set({ user: data, isAuthenticated: true });
        } catch {
            set({ user: null, isAuthenticated: false });
        } finally {
            set({ isLoading: false });
        }
    },
}));
