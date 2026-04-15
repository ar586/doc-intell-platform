import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Document Intelligence Platform',
  description: 'AI-infused Book RAG Pipeline',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#F5F5DC] text-amber-900`}>
        <nav className="bg-[#FFF8DC] shadow-sm border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex flex-1 items-center justify-between">
                <span className="font-bold text-2xl text-amber-800 tracking-tight">DocIntell Platform</span>
                <div className="space-x-6">
                  <a href="/" className="font-medium text-amber-900 hover:text-amber-700 transition">Dashboard</a>
                  <a href="/qa" className="font-medium text-amber-900 hover:text-amber-700 transition">Q&A Interface</a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
