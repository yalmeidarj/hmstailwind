import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs';
import Image from 'next/image'
import Link from 'next/link';
import NavBar from './components/NavBar';
import ClockIn from './components/ClockIn';
import ShiftManager from './components/ShiftManager';
import db from '@/lib/utils/db';


import { location } from '../../drizzle/schema';
import UserInfo from './components/UserInfo';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'HMS',
  description: 'Door to Door Management',
}



async function getLocationsDataDrizzle() {
  // Use the drizzle-orm to get the data from the database
  const locations = await db.select().from(location).execute();
  return locations;
}

const Header = () => (
  <header className="md:flex md:justify-around md:items-center w-full py-8 px-6">
    <Link href="/">
      <div className="flex items-center cursor-pointer space-x-3">
        <h1 className="text-lg font-bold text-blue-600">TDX Solutions</h1>
      </div>
    </Link>
    <div className="flex justify-between items-center w-full md:hidden">
      <div className="flex items-center space-x-4 text-black">
        <SignedOut>
          <Link className="text-black font-medium hover:underline" href="/sign-in">Sign in</Link>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
      <nav className="w-full py-4 border-t border-gray-200 flex items-center justify-between md:hidden">
        <Link href="/">
          <span className="text-sm text-gray-800 hover:text-blue-600 font-medium cursor-pointer">
            Locations
          </span>
        </Link>
        <Link href="/dashboard">
          <span className="text-sm text-gray-800 hover:text-blue-600 font-medium cursor-pointer">
            Dashboard
          </span>
        </Link>
        <Link href="/infolocation">
          <span className="text-sm text-gray-800 hover:text-blue-600 font-medium cursor-pointer">
            Site Info
          </span>
        </Link>
      </nav>
    </div>
    <nav className="hidden md:flex items-center space-x-4">
      <Link href="/">
        <span className="text-sm text-gray-800 hover:text-blue-600 font-medium cursor-pointer">
          Locations
        </span>
      </Link>
      <Link href="/dashboard">
        <span className="text-sm text-gray-800 hover:text-blue-600 font-medium cursor-pointer">
          Dashboard
        </span>
      </Link>
      <Link href="/infolocation">
        <span className="text-sm text-gray-800 hover:text-blue-600 font-medium cursor-pointer">
          Site Info
        </span>
      </Link>
    </nav>
    <div className="hidden md:flex items-center space-x-4">
      <SignedOut>
        <Link className="text-black font-medium hover:underline" href="/sign-in">Sign in</Link>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  </header>
)


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const { userId } = auth();

  const data = await getLocationsDataDrizzle()
  return (
    <html lang="en">
      <head></head>
      <ClerkProvider>
        <body className={`bg-white ${inter.className}`}>
          <div className="flex flex-col justify-end ">
            <Header />
          </div>
          <ShiftManager sites={data} />
          {children}
        </body>
      </ClerkProvider>
    </html>
  )
}
