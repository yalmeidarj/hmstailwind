import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs';
import { eq, and } from "drizzle-orm";
import { location, street, shiftLogger, worker, house } from '../../drizzle/schema';

import db from '../lib/utils/db';

import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, Suspense, useState } from 'react';
import ShiftManager from './components/ShiftManager';
import Loading from './components/Loading';
import SiteLoadingSkeleton from './components/SiteLoadingSkeleton';
import UserInfo from './components/UserInfo';
// import LocationCard from './components/LocationCard';


async function getLocationsDataDrizzle() {
  // Use the drizzle-orm to get the data from the database
  const locations = await db.select().from(location).execute();
  return locations;
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
  const shiftLoggers = await db.select().from(shiftLogger).where(and(eq(shiftLogger.isActive, true), eq(shiftLogger.workerId, 2)));
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
  const data = await getLocationsDataDrizzle();
  // const { userId } = auth()
  const { userId } = auth();
  const user = await currentUser();
  const id = user?.publicMetadata.id as number;
  const currentShift = user?.unsafeMetadata.shiftLoggerId as number;



  const shiftLoggers = await getShiftLogger(id);
  // console.log(user?.privateMetadata.role);

  const pace = await getPaceFinal(currentShift)
  // calculate the duration of the shift in hours
  // calculate the duration of the shift in hours
  const shiftDuration = (new Date().getTime() - new Date(pace.startingDate).getTime()) / 1000 / 60 / 60;


  // calculate the pace
  const userPace = pace.updatedHousesFinal / shiftDuration;



  if (!user) return <div className="text-blue-900">Not logged in</div>;
  return (
    <main className="flex flex-col items-center justify-center w-full py-8 px-6">
      <h1 className="text-blue-900">
        Houses updated: {pace.updatedHousesFinal}
      </h1>
      <h1 className="text-blue-900">
        Start Time: {pace.startingDate.toString()}
      </h1>
      <h1 className="text-blue-900">
        Pace: {userPace}
      </h1>

      {/* <ShiftManager shifts={shiftLoggers} sites={data} /> */}
      <h1 className="text-blue-900 text-4xl font-semibold mb-6">Sites</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((location: { id: Key | null | undefined; priorityStatus: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; neighborhood: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) => (
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


