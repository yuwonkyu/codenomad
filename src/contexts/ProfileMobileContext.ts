import { createContext } from 'react';

export const ProfileMobileContext = createContext<{ onCancel: () => void } | null>(null);
