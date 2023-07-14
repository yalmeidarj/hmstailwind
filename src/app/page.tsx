import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

import { eq, and } from "drizzle-orm";
import { location, street, shiftLogger, worker, house } from '../../drizzle/schema';

import db from '../lib/utils/db';
import ClockIn from './components/ClockIn';
import { Suspense } from 'react';
import ShiftManager from './components/ShiftManager';
import Loading from './components/Loading';
import SiteLoadingSkeleton from './components/SiteLoadingSkeleton';
import UserInfo from './components/UserInfo';
// import LocationCard from './components/LocationCard';


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
async function getNumberOfHouses(locationId: any) {
  // Use drizzle-orm to get the number of streets for each location
  const houses = await db.select().from(house).where(eq(house.locationId, locationId));
  return houses.length;
}
type ShiftData = {
  locationId: number;
  shiftLoggerId: number;
  workerId: number;
  startingDate: Date;
  finishedDate: string | null;
  updatedHouses: number | null;
  updatedHousesFinal: number | null;
  pace: number | null;
  paceFinal: number | null;
  userProviderUserId: string | null;
  isActive: boolean | null;
};

async function getShiftLogger(workerId: any) {
  const shiftLoggers = await db.select().from(shiftLogger).where(and(eq(shiftLogger.isActive, true), eq(shiftLogger.workerId, workerId)));
  return shiftLoggers as unknown as ShiftData[];
}


async function getShiftLoggerData(locationId: any) {
  const dshiftLoggers = await db.select().from(shiftLogger).where(and(eq(shiftLogger.isActive, true), eq(shiftLogger.locationId, locationId)));

  const workers = await Promise.all(dshiftLoggers.map(async (logger) => {
    const workers = await db.select().from(worker).where(eq(worker.id, logger.workerId));
    return (

      <>
        {
          workers.map((worker, index) => (
            <Suspense fallback={<p className='text-black'>Loading</p>}>
              <span className="text-blue-500 text-center mr-2" > {worker.name}</span>
            </Suspense>
          ))
        }
      </>
    );
  }));
  return workers;
}

export default async function Home() {
  const data = await getLocationsDataDrizzle();
  const user = await currentUser();

  const shiftLoggers = await getShiftLogger(user?.unsafeMetadata.id);
  // console.log(user?.privateMetadata.role);


  return (
    <main className="flex flex-col items-center justify-center w-full py-8 px-6">
      {/* <UserButton afterSignOutUrl="/" /> */}
      <UserInfo />
      <ShiftManager shifts={shiftLoggers} sites={data} />
      <h1 className="text-blue-900 text-4xl font-semibold mb-6">Sites</h1>
      {/* <ShiftManager sites={data} /> */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((location) => (
          <Suspense fallback={<SiteLoadingSkeleton />}>
            <li key={location.id} className="p-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-md shadow-md">
              <Link href={`/locations/${location.id}`}>
                <div className="block">
                  <div className="flex content-center text-center justify-center mb-3 bg-white rounded-md shadow-sm p-3">
                    <h2 className="text-xs font-semibold text-teal-500">Priority</h2>
                    <span className="text-xs font-semibold text-teal-500">
                      {" "}{location.priorityStatus}
                    </span>
                  </div>
                  <h2 className="text-blue-700 text-center justify-center text-lg font-semibold mb-1">{location.name}</h2>
                  <div className="flex content-center text-center justify-center">
                    {/* <h3 className="text-sm text-gray-600 mt-1"></h3> */}
                    <p className="text-sm text-gray-500 mt-1">{location.neighborhood} | Streets: {getNumberOfStreets(location.id)} | Houses: {getNumberOfHouses(location.id)}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Currently working
                    {getShiftLoggerData(location.id)}
                  </p>
                </div>
              </Link>
            </li>
          </Suspense>
        ))}
      </ul>
    </main >
  );
}


