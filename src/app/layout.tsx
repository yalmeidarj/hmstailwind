import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs';
import { SignOutButton } from "@clerk/nextjs";
import GoBack from './components/GoBack';
import Link from 'next/link';
import NavBar from './components/NavBar';
import ClockIn from './components/ClockIn';
// import { currentUser } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'HMS',
  description: 'Door to Door Management',
}


const getUserPace = async () => {
  const res = await fetch('http://localhost:9000/userspace')
  const data = await res.json()
  console.log(data)
  return data
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();
  // const user = await currentUser();
  return (
    <ClerkProvider
    // publishableKey={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}

    >
      <html lang="en">
        <body className={`bg-white ${inter.className}`}>
          {/* <div className=' bg-white'> */}
          <NavBar />
          {userId ? (
            <div>

              <GoBack text='Previous Page' />

            </div>
          ) : (
            <div className="mt-4 lg:mt-0">
            </div>
          )}

          {/* <GoBack
            text='Go Back'
          /> */}
          {children}
          {/* </div> */}
        </body>
      </html>
    </ClerkProvider>
  )
}
