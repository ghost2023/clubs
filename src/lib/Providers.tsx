'use client'
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { TRPCReactProvider } from '~/trpc/react';


export const Providers = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
        <SessionProvider>

        <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
  )
}
