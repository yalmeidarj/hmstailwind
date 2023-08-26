import React from 'react';
import db from '@/lib/utils/db';
import { currentUser } from '@clerk/nextjs';
import { eq, and } from 'drizzle-orm';
import { DateTime } from 'luxon';
import { shiftLogger } from '../../../drizzle/schema';



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


async function getPaceFinal(shiftLoggerId: any) {
	const shift = await db.select().from(shiftLogger).where(eq(shiftLogger.shiftLoggerId, shiftLoggerId)).execute();
	const data = shift[0];
	return data;
}

async function getShiftLogger(workerId: any) {
	const shiftLoggers = await db.select().from(shiftLogger).where(and(eq(shiftLogger.isActive, true), eq(shiftLogger.workerId, workerId))).execute();
	return shiftLoggers as unknown as ShiftData[];
}

const ShiftInfoCard = async () => {
	const user = await currentUser();

	const id = user?.unsafeMetadata.id as number;
	const currentShift = user?.unsafeMetadata.shiftLoggerId as number;

	if (id !== undefined && currentShift !== undefined) {
		const currentShift = user?.unsafeMetadata.shiftLoggerId as number;
		const shiftLoggers = await getShiftLogger(id);

		const pace = await getPaceFinal(currentShift)
		// Assuming pace is already defined somewhere
		const updatedHouses = pace?.updatedHouses || 0;
		const updatedHousesFinal = pace?.updatedHousesFinal || 0;
		const startTime = DateTime.fromJSDate(new Date(pace?.startingDate), { zone: 'America/Toronto' });

		const now = DateTime.now();
		const shiftDurationInMilliseconds = now.diff(startTime, 'hours').toObject().hours || 0;
		// Convert from hours to minutes
		let shiftDurationInMinutes = shiftDurationInMilliseconds * 60;
		let shiftDurationAdjusted = shiftDurationInMinutes - (updatedHouses * 1.5);

		let userPace = updatedHousesFinal !== 0 ? shiftDurationAdjusted / updatedHousesFinal : 0;
		userPace = isNaN(userPace) ? 0 : userPace; // Ensure userPace is not NaN


		// Ensure userPace is not NaN
		if (isNaN(userPace)) {
			userPace = 0;
		}

		return (
			<div className="p-4 border rounded-lg shadow-md bg-white">
				<h1 className="text-blue-900 font-semibold text-2xl mb-2">Pace: ~{userPace.toFixed(0)} minutes</h1>
				<div className="text-gray-700 my-2">
					<p><span className="font-semibold">Final Answer:</span> {updatedHousesFinal}</p>
					<p><span className="font-semibold">Nobody Home:</span> {updatedHouses}</p>
					<p><span className="font-semibold">Shift Duration:</span> {shiftDurationInMinutes.toFixed(2)} minutes</p>
					<p><span className="font-semibold">Start Time:</span> {pace?.startingDate ? new Date(pace.startingDate).toLocaleString() : 'N/A'}</p>
				</div>
			</div>
		);
	}
};

export default ShiftInfoCard;



