"use client";

import { AuthProvider } from '@descope/react-sdk';
import { ReactNode } from 'react';

export const DescopeProvider = ({ children }: { children: ReactNode }) => {
    return (
        <AuthProvider projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID || 'P37BNB6wE01ogq91wB5pfH08VPsA'}>
            {children}
        </AuthProvider>
    );
};
