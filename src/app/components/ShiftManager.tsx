"use client"
import { useState } from "react";
import MenuItem from '@mui/material/MenuItem';
import Select from "@mui/material/Select";
import ClockIn from "./ClockIn";
import { useUser } from "@clerk/nextjs";
import ClockOut from "./ClockOut";

interface Site {
	id: number;
	name: string | null;
	neighborhood: string;
	priorityStatus: number;
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


interface SiteDropdownProps {
	sites: Site[] | undefined;
	shifts: ShiftData[];
}


// const SiteDropdown: React.FC<SiteDropdownProps> = ({ sites }) => {
const SiteDropdown: React.FC<SiteDropdownProps> = ({ sites, shifts }) => {
	const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);

	// Calculate average pace based on starting date and current date
	const calculateAveragePace = (): string => {
		const currentDate = new Date();
		const activeShifts = shifts.filter((shift) => shift.startingDate !== null);

		if (activeShifts.length === 0) {
			return "0:00:00";
		}

		const totalDiff = activeShifts.reduce((total, shift) => {
			const startingDate = new Date(shift.startingDate!);
			const diffInSeconds = Math.floor((currentDate.getTime() - startingDate.getTime()) / 1000);
			return total + diffInSeconds;
		}, 0);

		const averageDiffInSeconds = totalDiff / activeShifts.length;

		// Calculate hours, minutes, and seconds
		const hours = Math.floor(averageDiffInSeconds / 3600);
		const minutes = Math.floor((averageDiffInSeconds % 3600) / 60);
		const seconds = Math.floor(averageDiffInSeconds % 60);

		// Format the result as "HH:MM:SS"
		const formattedDiff = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

		return formattedDiff;
	};





	const averagePace = calculateAveragePace();

	const [pace, setPace] = useState(averagePace);

	const { user } = useUser();
	const workerId = user?.unsafeMetadata.id as number

	if (user?.unsafeMetadata.isClockedIn) {
		return (
			<div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto p-4 rounded-md bg-gray-100">
				<ClockOut />
				<h1 className="text-black">Pace: {pace}</h1>
			</div>
		)
	}

	return (
		<div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto p-4 rounded-md bg-white shadow">
			<Select
				value={selectedSiteId}
				onChange={(event: { target: { value: any; }; }) => setSelectedSiteId(Number(event.target.value))}
				className="w-full text-gray-700 bg-gray-200 rounded-md border border-gray-200 focus:outline-none focus:border-blue-500"
			>
				{sites && sites.map((site) => (
					<MenuItem key={site.id} value={site.id} className="px-4 py-2 hover:bg-gray-200">
						{site.name}
					</MenuItem>
				))}

			</Select>

			<ClockIn siteId={selectedSiteId} />
		</div>
	);
};

export default SiteDropdown;



