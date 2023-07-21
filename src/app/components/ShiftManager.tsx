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
		e.preventDefault();
		try {
			const response = await fetch('https://hmsapi.herokuapp.com/shiftLogger', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					workerId: workerId,
					locationId: selectedSiteId,
					isActive: true,
					startingDate: DateTime.now().setZone('America/Toronto').toISO()
				})
			});

			const responseData = await response.json();
			const shifLoggerId = responseData.ShiftLoggerId;
			const updateUser = user?.update({
				unsafeMetadata: { "id": workerId, "isClockedIn": true, "shiftLoggerId": shifLoggerId }
			});

			alert("Successfully clocked in.");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			alert("Failed to clock in. Please try again.");
			console.log(`Failed to create a shift log due to ${error}`);
			console.log(user?.unsafeMetadata.id);
			console.log(selectedSiteId);
			console.error(error);
		}
	};

	useEffect(() => {
		setSelectedSiteId
	}, [isClockedIn]);

	if (!isLoaded || !isSignedIn) {
		return null;
	}

	return (
		<div className="flex  flex-col items-center mb-8 mt-8">
			{user?.unsafeMetadata.isClockedIn ? (
				<div className="min-w-[275px] flex  flex-col bg-slate-400 items-center m-6 border border-gray-400 rounded-md p-4 shadow-md">
					<h1 className='text-gray-600 text-lg mb-1'>Current pace <span className='rounded-md mt-2 mb-2 p-2 text-blue-600'>3.00</span></h1>
					<p className="text-sm mb-4">Pace will be updated every 5 min...</p>
					<ClockOut shiftId={shiftId} />
				</div>
			) : (
				<div className="min-w-[275px] shadow-md  bg-slate-400 m-6 border border-gray-400 rounded-md p-4">
					<h1 className="text-gray-600 text-lg mb-1">Clock In</h1>
					<p className="text-sm">Please select a site to clock in.</p>
					<select
						value={selectedSiteId}
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
