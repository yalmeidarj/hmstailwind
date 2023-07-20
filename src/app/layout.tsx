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
  const locations = await db.select().from(location);
  return locations;
}

const Header = () => (
  <header className="flex justify-between px-4 py-2 md:px-8">
    <div className="flex items-center">
      <Link href="/">
        <div className="flex items-center cursor-pointer">
          <Image src="/logo.svg" width="32" height="32" alt="Logo" />
          <span className="ml-3 font-bold text-blue-600">TDX Solutions</span>
        </div>
      </Link>
    </div>
    <div className="text-black">
      <SignedOut>
        <Link className="text-black" href="/sign-in">Sign in</Link>
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
            {/* <NavBar /> */}
            <Header />
          </div>
          <ShiftManager sites={data} />
          {children}
        </body>
      </ClerkProvider>
    </html>
  )
}
