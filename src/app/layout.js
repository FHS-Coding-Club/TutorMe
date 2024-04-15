import { Inter } from 'next/font/google'
import '@/styles/globals.css';
import Provider from "@/lib/provider"
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NHS TutorMe',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
