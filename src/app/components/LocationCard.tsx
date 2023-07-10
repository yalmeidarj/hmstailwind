import React from 'react';
import Link from 'next/link';
import ClockIn from './ClockIn'; // Assuming ClockIn is a component

import { and, eq } from "drizzle-orm";
import { street, shiftLogger, worker } from '../../../drizzle/schema';

import db from '../../lib/utils/db';

import { Suspense } from 'react';

async function getNumberOfStreets(locationId: any) {
	// Use drizzle-orm to get the number of streets for each location
	const streets = await db.select().from(street).where(eq(street.locationId, locationId));
	return streets.length;

}

async function getShiftLoggerData(locationId: any) {
	const dshiftLoggers = await db.select().from(shiftLogger).where(and(eq(shiftLogger.locationId, locationId), eq(shiftLogger.isActive, true)));

	const workers = await Promise.all(dshiftLoggers.map(async (logger) => {
		const workers = await db.select().from(worker).where(eq(worker.id, logger.workerId));
		return workers;
	}));

	return workers;
}

interface Location {
	id: number;
	priorityStatus: number;
	name: string | null;
	neighborhood: string;
	// Add other properties if they exist
}



interface LocationCardProps {
	location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
	return (

		<div key={location.id} className="flex flex-row  justify-center items-center p-4 my-4 cursor-pointer bg-slate-500 hover:bg-gray-200 transition-colors duration-200 rounded-md shadow-md">
			<li className="flex flex-col items-center p-4 text-center cursor-pointer ">
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
							<div className="text-xs text-teal-500 mx-2">Field Agents:
								{getShiftLoggerData(location.id)}
							</div>
						</div>
					</div>
				</Link>
				{/* Check if user is clocked in, if not, show clockOut */}
				{
					<ClockIn siteId={location.id} />
				}
			</li>
		</div>

	);
};

export default LocationCard;


