import { create } from 'zustand';

export interface NavAction {
    label: string;
    onClick: () => void;
    icon?: string;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
}

interface NavState {
    view: 'nav' | 'action';
    primaryAction: NavAction | null;
    secondaryAction: NavAction | null;

    // Actions
    setActions: (primary: NavAction, secondary?: NavAction) => void;
    reset: () => void;
}

export const useNavStore = create<NavState>((set) => ({
    view: 'nav',
    primaryAction: null,
    secondaryAction: null,

    setActions: (primary, secondary) => set({
        view: 'action',
        primaryAction: primary,
        secondaryAction: secondary || null
    }),

    reset: () => set({
        view: 'nav',
        primaryAction: null,
        secondaryAction: null
    }),
}));
