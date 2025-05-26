import './globals.css';
import { Inter } from 'next/font/google';
import Providers from './components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CoinYaps - Crypto Community Discussion',
  description: 'Search, analyze, and discuss cryptocurrency trends with the community.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}