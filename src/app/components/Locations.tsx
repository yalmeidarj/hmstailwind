import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, Suspense, useState } from 'react'
// import { fetchLocations, getShiftLoggerData } from './actions.js'
import Link from 'next/link.js'
import db from '../../lib/utils/db'
import { eq, and } from 'drizzle-orm'
import { street, house, location, shiftLogger, worker } from '../../../drizzle/schema'
// import SiteLoadingSkeleton from './SiteLoadingSkeleton.jsx'

type LocationType = {
	id: number;
	name: string | null;
	neighborhood: string;
	priorityStatus: number;
};

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



export default async function Locations() {
	const location = await getLocationsDataDrizzle()

	return (
		<div className="flex flex-row flex-wrap items-center justify-around m-4 w-full py-8 px-6">

			{location.map((location: { id: Key | null | undefined; priorityStatus: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) => (
				<Suspense fallback={<h1>Loading</h1>} key={location.id}>
					<li className="p-4 bg-gray-100 hover:bg-gray-200 min-w-[300px] transition-colors duration-200 mb-4 rounded-md shadow-md">
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
										{getNumberOfStreets(location.nei)} | Houses:{" "}
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
	)
}
