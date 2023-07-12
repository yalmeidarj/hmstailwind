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

interface SiteDropdownProps {
	sites: Site[] | undefined;
}

const SiteDropdown: React.FC<SiteDropdownProps> = ({ sites }) => {
	const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);

	const { user } = useUser();
	const workerId = user?.unsafeMetadata.id as number

	if (user?.unsafeMetadata.isClockedIn) {
		return (
			<div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto p-4 rounded-md bg-gray-100">
				<ClockOut userId={workerId} />
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



