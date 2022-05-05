import create, { State } from 'zustand';
import User from '../types/User';

export interface GlobalState extends State {
    isAuth: boolean;
    setIsAuth: (value: boolean) => void;

    profile: User | null;
    setProfile: (profile: User | null) => void;
}

export const useStore = create<GlobalState>(set => ({
    isAuth: false,
    setIsAuth: value => set(() => ({ isAuth: value })),

    profile: null,
    setProfile: profile => set(() => ({ profile }))
}));
