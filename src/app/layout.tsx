import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Life Chart App',
  description: 'Create and manage personalized life charts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <h1 className="text-xl font-bold text-blue-600">Life Chart App</h1>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}