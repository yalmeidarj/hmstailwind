"use client"
import React from 'react';
import { useUser } from "@clerk/nextjs";
import { DateTime } from 'luxon';


interface ClockOutProps {
	shiftId: number;
}

const ClockOut: React.FC<ClockOutProps> = ({ shiftId }) => {
	const { user } = useUser();
	const id = user?.unsafeMetadata.shiftLoggerId as number;
	const workerId = user?.unsafeMetadata.id as number;

	const handleClockOut = async () => {
		const data = {
			isActive: false,
			finishedDate: DateTime.now().setZone('America/Toronto').toISO(),
		};
		try {
			const response = await fetch(`https://hmsapi.herokuapp.com/shiftLogger/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				user?.update({
					unsafeMetadata: { "id": workerId, "isClockedIn": false, "shiftLoggerId": null }
				});
				alert('Successfully clocked out.');
			} else {
				const statusText = await response.text();
				throw new Error(`HTTP error! status: ${statusText}`);
			}
		} catch (error) {
			alert("Failed to clock out. Please try again.");
			console.error(`Failed to update a shift log due to ${error}`);

		}
	};

	return (
		<button onClick={handleClockOut} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
			Clock Out
		</button>
	);
};

export default ClockOut;
