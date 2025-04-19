import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eventgo',
  description: 'Eventgo is a platform for event management.',
  icons: {
    icon: '/assets/images/new-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'bg-primary-500 hover:bg-primary-600',
          card: 'bg-white',
          logoBox: 'h-[38px] w-[38px]',
          logoImage: 'h-[38px] w-[38px]',
        },
        variables: {
          colorPrimary: '#624CF5',
        },
        layout: {
          logoImageUrl: '/assets/images/new-logo.png',
          logoPlacement: 'inside',
          socialButtonsVariant: 'iconButton',
        },
      }}
    >
      <html lang="en">
        <body className={poppins.variable}>
          {/* No sign-in/out buttons */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
