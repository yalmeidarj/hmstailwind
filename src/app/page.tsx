import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';
import { getAuth, clerkClient } from "@clerk/nextjs/server";


import { eq } from "drizzle-orm";
import { location, street, shiftLogger, worker } from '../../drizzle/schema';

import db from '../lib/utils/db';
import ClockIn from './components/ClockIn';
import { Suspense } from 'react';
// import { useUser } from '@clerk/clerk-react'

async function getLocationsDataDrizzle() {
  // Use the drizzle-orm to get the data from the database
  const locations = await db.select().from(location);
  return locations;
}

async function getNumberOfStreets(locationId: any) {
  // Use drizzle-orm to get the number of streets for each location
  const streets = await db.select().from(street).where(eq(street.locationId, locationId));
  return streets.length;

}

async function getShiftLoggerData(locationId: any) {
  const dshiftLoggers = await db.select().from(shiftLogger).where(eq(shiftLogger.locationId, locationId));

  const workers = await Promise.all(dshiftLoggers.map(async (logger) => {
    const workers = await db.select().from(worker).where(eq(worker.id, logger.workerId));
    return (
      <div className="flex flex-wrap justify-start items-center space-x-2">
        {
          workers.map((worker, index) => (
            <div key={index} className="px-4 py-2 bg-gray-100 rounded-md shadow-sm">
              <dd className="mt-1 text-sm text-gray-800 sm:mt-0">
                {worker.name}
              </dd>
            </div>
          ))
        }
      </div>
    );
  }));

  return workers;
}


// import { getAuth, clerkClient } from "@clerk/nextjs/server";
// import type { NextApiRequest, NextApiResponse } from "next";

export default async function Home(

) {

  const data = await getLocationsDataDrizzle();

  return (
    <main className="flex flex-col items-center justify-center w-full py-8 px-6">
      {/* <h1 className="text-3xl text-black font-bold mb-6">{user?.firstName}</h1> */}
      <h1 className="text-3xl text-black font-bold mb-6">Locations</h1>
      <Suspense fallback={<p className='text-black'>Loading</p>}>
        <ul className="grid grid-cols-3 gap-6">
          {data.map((location) => (
            <div key={location.id} className="flex flex-row  justify-center items-center p-4 my-4 bg-gray-100 rounded-md shadow-md">
              <li className="flex flex-col items-center p-4 text-center cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                <Link href={`/locations/${location.id}`}>
                  <div className="flex flex-col items-center justify-center px-3 py-2 mb-3 bg-white rounded-md shadow-sm">
                    <p className="text-xs font-semibold text-teal-500">Priority</p>
                    <span className="text-xs font-semibold text-teal-500">
                      {location.priorityStatus}
                    </span>
                  </div>
                  <div className="mt-2 mb-4 text-gray-800">
                    {location.name}
                    <p className="mt-2 text-sm text-gray-500">{location.neighborhood}</p>
                    <div className="flex flex-row justify-center items-center text-gray-600 mt-4">
                      <p className="text-xs text-teal-500 mx-2">Streets: {getNumberOfStreets(location.id)}</p>
                      <div className="text-xs text-teal-500 mx-2">Workers:
                        {getShiftLoggerData(location.id)}
                      </div>
                    </div>
                  </div>
                </Link>
                <ClockIn locationId={location.id} />
              </li>
            </div>
          ))}
        </ul>
      </Suspense>
    </main>
  );
}

