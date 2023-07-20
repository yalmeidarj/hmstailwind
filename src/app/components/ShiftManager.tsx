"use client"
import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import MenuItem from '@mui/material/MenuItem';
import Select from "@mui/material/Select";
import ClockOut from './ClockOut';

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
	const { user } = useUser();
	const [selectedSiteId, setSelectedSiteId] = useState<number>(0);
	const [isClockedIn, setIsClockedIn] = useState(user?.unsafeMetadata.isClockedIn as boolean);
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
					startingDate: new Date().toISOString()
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
		setIsClockedIn(user?.unsafeMetadata.isClockedIn as boolean);
		setSelectedSiteId
	}, [isClockedIn]);

	return (
		<div className="flex flex-col items-center space-y-4">
			{user?.unsafeMetadata.isClockedIn ? (
				<div>
					<h1 className='text-black'>Already Clocked In</h1>
					<ClockOut shiftId={shiftId} />
				</div>
			) : (
				<div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto p-4 rounded-md bg-white shadow">
					<Select
						value={selectedSiteId}
						onChange={({ target: { value } }) => setSelectedSiteId(Number(value))}
						className="w-full text-gray-700 bg-gray-200 rounded-md border border-gray-200 focus:outline-none focus:border-blue-500"
					>
						{sites?.map((site) => (
							<MenuItem key={site.id} value={site.id}>
								{site.name}
							</MenuItem>
						))}
					</Select>
					<form onSubmit={handleSubmitClockIn} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
						<button type="submit" className="w-full">
							Clock In
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default ShiftManager;

