import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs';
import { eq, and } from "drizzle-orm";
import { location, street, shiftLogger, worker, house } from '../../drizzle/schema';
import { DateTime, Duration } from 'luxon';
import db from '../lib/utils/db';

import { Key, Suspense } from 'react';
import ShiftManager from './components/ShiftManager';
import Loading from './components/Loading';
import SiteLoadingSkeleton from './components/SiteLoadingSkeleton';
import UserInfo from './components/UserInfo';
import ClientWrapper from './components/ClientWrapper';
import { ai } from 'drizzle-orm/column.d-aa4e525d';
import PaginationControls from './components/PaginationControls';
// import LocationCard from './components/LocationCard';


async function getLocationsDataDrizzle(number: string, size: string) {

  const pageNumber = parseInt(number);
  const pageSize = parseInt(size);
  // Use the drizzle-orm to get the data from the database
  const offset = (pageNumber - 1) * pageSize;  // Calculate the offset

  const locations = await db.select().from(location).limit(pageSize).offset(offset).execute();

  return locations;
}

async function fetchLocations(pageNumber: number, pageSize: number) {
  // Use the drizzle-orm to get the data from the database
  const offset = (pageNumber - 1) * pageSize; // Calculate the offset

  const locations = await db
    .select()
    .from(location)
    .limit(pageSize)
    .offset(offset)
    .execute();

  return locations;
}
async function getLocationsListSize() {
  // Use the drizzle-orm to get the data from the database
  const locations = await db.select().from(location).execute();
  return locations.length;
}

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







async function getShiftLoggerData(locationId: any) {
  const dshiftLoggers = await db.select().from(shiftLogger).where(and(eq(shiftLogger.isActive, true), eq(shiftLogger.locationId, locationId))).execute();

  const workers = await Promise.all(dshiftLoggers.map(async (logger: { workerId: any; }) => {
    const workerData = await db.select().from(worker).where(eq(worker.id, logger.workerId)).execute();
    return (
      <>
        {
          workerData.map((worker: { name: string | number | boolean | undefined; }, index: any) => (
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



export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {

  const page = searchParams['page'] ?? '1'
  const per_page = searchParams['per_page'] ?? '20'

  const start = (Number(page) - 1) * Number(per_page) // 0, 5, 10 ...
  const end = start + Number(per_page)  // 5, 10, 15 ...

  const entries = (await getLocationsDataDrizzle(page, per_page))

  // const data = await getLocationsDataDrizzle();
  // const data = await getLocationsDataDrizzle(1, 20);
  // Ensure userPace is not NaN

  const listSize = await getLocationsListSize(); // Assuming this function is defined somewhere

  // if (!user) return <div className="text-blue-900">Not logged in</div>;
  return (
    <main className="flex flex-col items-center justify-center w-full py-8 px-6">


      <h1 className="text-blue-900 text-4xl font-semibold mb-6">Sites</h1>
      <p className="text-gray-300 text-sm font-semibold mb-2">Total of {listSize} sites</p>
      <PaginationControls
        listSize={listSize}
        hasNextPage={end < listSize}
        hasPrevPage={start > 0}
      />
      <div className='flex flex-row flex-wrap p-2 items-center justify-center m-2'>

        {entries.map((location: {
          id: Key | null | undefined;
          priorityStatus: string | number | boolean | null | undefined;
          name: string | number | boolean | null | undefined;
        }) => (
          <Suspense fallback={<h1 className="font-semibold text-black">Loading</h1>} key={location.id}>
            <li className="p-4 mb-2 bg-gray-100 hover:bg-gray-200 min-w-[300px] transition-colors duration-200 m-1 rounded-md shadow-md">
              <Link href={`/locations/${location.id}`}>
                <div className="block">
                  <div className="flex items-center justify-center mb-3 bg-white rounded-md shadow-sm p-3">
                    <h2 className="text-xs font-semibold text-teal-500">
                      Priority
                    </h2>
                    <span className="text-xs font-semibold text-teal-500">
                      {" "}
                      {location.priorityStatus}
                    </span>
                  </div>
                  <h2 className="text-blue-700 text-center text-lg font-semibold mb-1">
                    {location.name}
                  </h2>
                  <div className="flex items-center justify-center">
                    <p className="text-sm text-gray-500 mt-1">
                      {/* {location.neighborhood} | Streets:{" "} */}
                      {getNumberOfStreets(location.id)} | Houses:{" "}
                      {getNumberOfHouses(location.id)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Currently working: {getShiftLoggerData(location.id)}
                  </p>
                </div>
              </Link>
            </li>
          </Suspense>
        ))}
      </div>
    </main>
  );
  // } else {
  //   console.log("ID or currentShift is undefined.");
  //   // handle this error appropriately
  // }
}



