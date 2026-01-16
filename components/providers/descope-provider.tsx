"use client";

import { AuthProvider } from '@descope/react-sdk';
import { ReactNode } from 'react';

export const DescopeProvider = ({ children }: { children: ReactNode }) => {
    return (
        <AuthProvider projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID || 'P38Ce5ELumb4fUCTq5JnhlpDTdd9'}>
            {children}
        </AuthProvider>
    );
};
