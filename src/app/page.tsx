import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs';
import { eq, and } from "drizzle-orm";
import { location, street, shiftLogger, worker, house } from '../../drizzle/schema';
import { DateTime, Duration } from 'luxon';
import db from '../lib/utils/db';

import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, SetStateAction, Suspense, useEffect, useState } from 'react';
import ShiftManager from './components/ShiftManager';
import Loading from './components/Loading';
import SiteLoadingSkeleton from './components/SiteLoadingSkeleton';
import UserInfo from './components/UserInfo';
import Locations from './components/Locations';
// import LocationCard from './components/LocationCard';


async function getLocationsDataDrizzle(pageNumber, pageSize) {
  // Use the drizzle-orm to get the data from the database
  const offset = (pageNumber - 1) * pageSize;  // Calculate the offset

  const locations = await db.select().from(location).limit(pageSize).offset(offset).execute();

  return locations;
}

// async function getLocationsDataDrizzle() {
//   // Use the drizzle-orm to get the data from the database
//   const locations = await db.select().from(location).execute();
//   return locations;
// }

async function getNumberOfStreets(locationId: any) {
  // Use drizzle-orm to get the number of streets for each location
  const streets = await db.select().from(street).where(eq(street.locationId, locationId)).execute();
  return streets.length;

}


async function getNumberOfHouses(locationId: any) {
  // Use drizzle-orm to get the number of streets for each location
  const houses = await db.select().from(house).where(eq(house.locationId, locationId)).execute();
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
  // const user = await currentUser();
  // const id = await 
  const shiftLoggers = await db.select().from(shiftLogger).where(and(eq(shiftLogger.isActive, true), eq(shiftLogger.workerId, workerId))).execute();
  return shiftLoggers as unknown as ShiftData[];
}

async function getPaceFinal(shiftLoggerId: any) {

  const shift = await db.select().from(shiftLogger).where(eq(shiftLogger.shiftLoggerId, shiftLoggerId)).execute();
  const pace = shift[0]
  return pace
}


async function getShiftLoggerData(locationId: any) {
  const dshiftLoggers = await db.select().from(shiftLogger).where(and(eq(shiftLogger.isActive, true), eq(shiftLogger.locationId, locationId))).execute();

  const workers = await Promise.all(dshiftLoggers.map(async (logger: { workerId: any; }) => {
    const workerData = await db.select().from(worker).where(eq(worker.id, logger.workerId)).execute();
    return (
      <>
        {
          workerData.map((worker: { name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }, index: any) => (
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
  const data = await getLocationsDataDrizzle(1, 20);
  const user = await currentUser();

  const id = user?.unsafeMetadata.id as number;
  const currentShift = user?.unsafeMetadata.shiftLoggerId as number;

  if (id !== undefined && currentShift !== undefined) {
    const currentShift = user?.unsafeMetadata.shiftLoggerId as number;
    const shiftLoggers = await getShiftLogger(id);
    const pace = await getPaceFinal(currentShift)


    const updatedHouses = pace?.updatedHouses || 0;
    const updatedHousesFinal = pace?.updatedHousesFinal || 0;
    const startTime = DateTime.fromJSDate(new Date(pace?.startingDate));

    const formattedStartTime = startTime.toLocaleString(DateTime.DATETIME_FULL);
    const now = DateTime.now().setZone('America/Toronto');
    const shiftDurationInMilliseconds = now.diff(startTime, 'milliseconds').milliseconds;

    let shiftDurationInMinutes = shiftDurationInMilliseconds / 1000 / 60; // convert from ms to minutes

    let shiftDurationAdjusted = shiftDurationInMinutes - (updatedHouses * 1.5);

    let userPace = 0;
    if (updatedHousesFinal !== 0) {
      userPace = shiftDurationAdjusted / updatedHousesFinal; // this gives adjusted minutes per house update
    }

    // Ensure userPace is not NaN
    if (isNaN(userPace)) {
      userPace = 0;
    }


    if (!user) return <div className="text-blue-900">Not logged in</div>;
    return (
      <main className="flex flex-col items-center justify-center w-full py-8 px-6">
        <Locations />
      </main>

    );
  } else {
    console.log("ID or currentShift is undefined.");
    // handle this error appropriately
  }
}


