import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs';
import { SignOutButton } from "@clerk/nextjs";
import GoBack from './components/GoBack';
import Link from 'next/link';
import NavBar from './components/NavBar';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();
  return (
    <ClerkProvider >
      <html lang="en">
        <body className={`bg-white ${inter.className}`}>
          {/* <div className=' bg-white'> */}
          <NavBar />
          {userId ? (
            <GoBack text='Previous Page' />
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
