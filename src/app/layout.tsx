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


import { location, shiftLogger } from '../../drizzle/schema';
import UserInfo from './components/UserInfo';
import { DateTime } from 'luxon';
import { and, eq } from 'drizzle-orm';
import ShiftInfoCard from './components/ShiftInfoCard';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TDX Solutions',
  description: 'Project - Bell consent/ Fiber Optic Installation',
}


async function getLocationsDataDrizzle() {
  // Use the drizzle-orm to get the data from the database
  const locations = await db.select().from(location).execute();
  return locations;
}

// TODO: turn Header into a component
const Header = () => (
  <header className="md:flex md:justify-around md:items-center w-full py-8 px-6">
    <Link href="/">
      <div className="flex items-center cursor-pointer space-x-3">
        <h1 className="text-lg font-bold text-blue-600">TDX Solutions</h1>
      </div>
    </Link>
    <div className="flex justify-between items-center w-full md:hidden">
      <nav className="w-full py-4 border-t border-gray-200 flex items-center justify-between md:hidden">
        <Link href="/">
          <span className="text-sm text-gray-800 hover:text-blue-600 font-medium cursor-pointer">
            Sites
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
      <div className="flex items-center space-x-4 m-2 text-black">
        <SignedOut>
          <Link className="text-black font-medium hover:underline" href="/sign-in">Sign in</Link>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </div>
    <nav className="hidden md:flex items-center space-x-4">
      <Link href="/">
        <span className="text-sm text-gray-800 hover:text-blue-600 font-medium cursor-pointer">
          Sites
        </span>
      </Link>
      <Link href="/dashboard">
        <span className="text-sm text-gray-800 hover:text-blue-600 font-medium cursor-pointer">
          Dashboard
        </span>
      </Link>
      <Link href="/infolocation">
        <span className="text-sm text-gray-800 hover:text-blue-600 font-medium cursor-pointer">
          Sites Info
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
          <ShiftInfoCard />
          {children}
        </body>
      </ClerkProvider>
    </html>
  )

}
