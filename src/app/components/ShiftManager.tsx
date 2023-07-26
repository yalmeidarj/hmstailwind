"use client"

import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import ClockOut from './ClockOut';
import { DateTime } from 'luxon';
interface Site {
	id: number;
	name: string | null;
	neighborhood: string;
	priorityStatus: number;
}

interface ShiftManagerProps {
	sites: Site[];
}

const ShiftManager: React.FC<ShiftManagerProps> = ({ sites }) => {
	const { isLoaded, isSignedIn, user } = useUser();
	const [selectedSiteId, setSelectedSiteId] = useState<number>(0);
	const isClockedIn = user?.unsafeMetadata.isClockedIn as boolean;

	const [shiftId, setShiftId] = useState(user?.unsafeMetadata.shiftLoggerId as number);

	const workerId = user?.unsafeMetadata.id as number;

	const handleSubmitClockIn = async (e: React.FormEvent<HTMLFormElement>) => {
		const shiftLoggerId = user?.unsafeMetadata.shiftLoggerId as number;
		// const workerId = user?.unsafeMetadata.id as number;
		console.log("shiftLoggerId", shiftLoggerId);
		console.log("workerId", workerId);
		e.preventDefault();
		try {
			const response = await fetch('https://hmsapi.herokuapp.com/shiftLogger', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					workerId: 2,
					locationId: 91,
					isActive: true,
					updatedHouses: 0,
					updatedHousesFinal: 0,
					startingDate: DateTime.now().setZone('America/Toronto').toISO()
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const responseData = await response.json();
			const newShiftLoggerId = responseData.ShiftLoggerId;

			console.log("Response Data:", responseData);
			console.log("Shift Logger ID after API call:", newShiftLoggerId);

			const updateUser = await user?.update({
				unsafeMetadata: { "id": workerId, "isClockedIn": true, "shiftLoggerId": newShiftLoggerId }
			});

			alert("Successfully clocked in.");

		} catch (error) {
			alert("Failed to clock in. Please try again.");
			console.log("Failed to create a shift log due to ", error);
			console.log("User ID at error:", user?.unsafeMetadata.id);
			console.log("Selected Site ID at error:", selectedSiteId);
			console.error(error);
		}
	};


	useEffect(() => {
		setSelectedSiteId
	}, [isClockedIn]);

	if (!isLoaded || !isSignedIn) {
		return null;
	}
	console.log("workerId", workerId);
	return (
		<div className="flex  flex-col items-center mb-8 mt-8">
			{user?.unsafeMetadata.isClockedIn ? (
				<ClockOut shiftId={shiftId} />
			) : (
				<div className="min-w-[275px] shadow-md  bg-slate-400 m-6 border border-gray-400 rounded-md p-4">
					<h1 className="text-gray-600 text-lg mb-1">Clock In</h1>
					<p className="text-sm">Please select a site to clock in.</p>
					<select
						value={0}
						onChange={({ target: { value } }) => setSelectedSiteId(Number(value))}
						className="w-full border text-gray-500 border-gray-300 rounded-md mt-2 mb-2 p-2"
					>
						{sites?.map((site) => (
							<option className='text-gray-500' key={site.id} value={site.id}>
								{site.name}
							</option>
						))}
					</select>
					<form onSubmit={handleSubmitClockIn}>
						<button
							type="submit"
							className="w-full bg-blue-600 text-white mt-8 py-2 rounded-md"
						>
							Clock In
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default ShiftManager;
