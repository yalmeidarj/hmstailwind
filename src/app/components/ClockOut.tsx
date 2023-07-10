"use client"
import React, { useState, useEffect, Key } from 'react';
import { useUser } from "@clerk/nextjs";

interface ClockOutProps {
	userId: Key;
}

const ClockOut: React.FC<ClockOutProps> = ({ userId }) => {
	const { isLoaded, isSignedIn, user } = useUser();
	const [shiftData, setShiftData] = useState<{ workerId: number, isActive: boolean, finishedDate: string } | null>(null);

	useEffect(() => {
		if (user) {
			const workerId = user?.unsafeMetadata.id as number;
			const isActive = false;
			setShiftData({
				workerId,
				isActive,
				finishedDate: new Date().toISOString(),
			});
		}
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		console.log(shiftData)
		console.log(shiftData?.workerId)

		try {
			// const response = await fetch(`http://127.0.0.1:5000/clockout/${userId}`, {
			const response = await fetch(`https://hmsapi.herokuapp.com/clockout/${shiftData?.workerId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(shiftData),
			});
			const responseData = await response.json();
			if (!response.ok) {
				throw new Error(responseData.error || 'PUT request failed');
			}

			const updateResponse = user?.update({
				unsafeMetadata: { "id": shiftData?.workerId, "isClockedIn": false }
			});
			if (updateResponse) {
				console.log('Updated user unsafeMetadata', updateResponse);
			}
		} catch (error) {
			// console.error(`Error occurred: ${error.message}, Details: ${error.details}`);
			console.error(`Error occurred: ${error}`);
		}
	};

	return (
		<div className="flex flex-col items-center">
			<form onSubmit={handleSubmit}>
				<button type="submit" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
					Clock Out
				</button>
			</form>
		</div>
	);
};

export default ClockOut;
