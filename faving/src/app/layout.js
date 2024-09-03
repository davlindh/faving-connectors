import { Inter } from 'next/font/google';
import './globals.css';
import { SupabaseProvider } from '@/hooks/useSupabase';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Faving - Connect, Collaborate, Create',
  description: 'A platform for connecting freelancers and project creators',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}