"use client"
import { Suspense, useState } from "react";
import MenuItem from '@mui/material/MenuItem';
import Select from "@mui/material/Select";
import ClockIn from "./ClockIn";
import { useUser } from "@clerk/nextjs";
import ClockOut from "./ClockOut";
import { P } from "drizzle-orm/db.d-cf0abe10";

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

	const { isLoaded, isSignedIn, user } = useUser();
	const workerId = user?.unsafeMetadata.id as number

	if (user?.unsafeMetadata.isClockedIn) {
		return (
			<div className="">
				<ClockOut userId={workerId} />
			</div>
		)
	}

	return (
		<>

			<Select
				value={selectedSiteId}
				onChange={(event: { target: { value: any; }; }) => setSelectedSiteId(Number(event.target.value))}
			>
				{sites && sites.map((site) => (
					<MenuItem key={site.id} value={site.id}>
						{site.name}
					</MenuItem>
				))}

			</Select >

			<ClockIn siteId={selectedSiteId} />
		</>
	);
};

export default SiteDropdown;

