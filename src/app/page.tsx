import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';
import { getAuth, clerkClient } from "@clerk/nextjs/server";


import { eq } from "drizzle-orm";
import { location, street, shiftLogger, worker } from '../../drizzle/schema';

import db from '../lib/utils/db';
import ClockIn from './components/ClockIn';
import { Suspense } from 'react';
import LocationCard from './components/LocationCard';
// import { useUser } from '@clerk/clerk-react'

async function getLocationsDataDrizzle() {
  // Use the drizzle-orm to get the data from the database
  const locations = await db.select().from(location);
  return locations;
}


export default async function Home(

) {

  const data = await getLocationsDataDrizzle();

  return (
    <main className="flex flex-col items-center justify-center w-full py-8 px-6">
      {/* <h1 className="text-3xl text-black font-bold mb-6">{user?.firstName}</h1> */}
      <h1 className="text-3xl text-black font-bold mb-6">Locations</h1>
      <Suspense fallback={<p className='text-black'>Loading</p>}>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((location) => (
            <LocationCard location={location} />
          ))}
        </ul>
      </Suspense>
    </main>
  );
}
