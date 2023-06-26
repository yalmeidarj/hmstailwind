import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { SignOutButton } from "@clerk/nextjs";
import GoBack from './components/GoBack';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'HMS',
  description: 'Door to Door Management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider >
      <html lang="en">
        <body className={`bg-white ${inter.className}`}>
          {/* <div className=' bg-white'> */}
          <div>
            <h1 className=' '> Sign Out </h1>
            <SignOutButton>
              <button>Sign in with Clerk</button>
            </SignOutButton>
          </div>
          <GoBack
            text='Go Back'
          />
          {children}
          {/* </div> */}
        </body>
      </html>
    </ClerkProvider>
  )
}
