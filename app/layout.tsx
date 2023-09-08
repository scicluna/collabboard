import './globals.css'
import type { Metadata } from 'next'
import ConvexClerkProvider from '@/components/client/ConvexClerkProvider';
import { ClerkProvider } from '@clerk/nextjs/app-beta';

export const metadata: Metadata = {
  title: 'CollabBoard',
  description: 'Team Drawing Note Board',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 h-[100dvh] w-[100dvw]">
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} >
          <ConvexClerkProvider>
            {children}
          </ConvexClerkProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
