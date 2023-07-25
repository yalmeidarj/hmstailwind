import db from '../../lib/utils/db'
import { location, house, worker, shiftLogger } from '../../../drizzle/schema'
import { and, eq } from "drizzle-orm";
import { AiOutlineHome, AiOutlineUser, AiOutlineCheck, AiOutlineReload, AiOutlineWarning } from "react-icons/ai";



async function getHousesDataFiltered(locationId: number) {
	const houses = await db.select().from(house).where(eq(house.locationId, locationId)).execute();
	const locationInfo = await db.select().from(location).where(eq(location.id, locationId)).execute();

	const allHousesWithDatesAsStrings = houses.map(house => ({
		...house,
		lastUpdated: house.lastUpdated ? new Date(house.lastUpdated).toISOString() : null,
	}));

	const totalHouses = allHousesWithDatesAsStrings.length;
	const visitedHouses = allHousesWithDatesAsStrings.filter(house => house.lastUpdated !== null).length;
	const consentFinalYes = allHousesWithDatesAsStrings.filter(house => house.statusAttempt === 'consent final yes');
	const secondAttempt = allHousesWithDatesAsStrings.filter(house => house.statusAttempt === '2nd attempt');

	const nonExistent = allHousesWithDatesAsStrings.filter(house =>
		house.name === null &&
		house.locationId === null &&
		house.streetNumber === null &&
		house.lastName === null &&
		house.notes === null &&
		house.salesForceNotes === null &&
		house.email === null &&
		house.phone === null &&
		house.type === null &&
		house.streetId === null &&
		house.lastUpdatedBy === null &&
		house.statusAttempt === null &&
		house.consent === null
	).length;

	return {
		allHousesWithDatesAsStrings,
		totalHouses,
		visitedHouses,
		consentFinalYes,
		secondAttempt,
		nonExistent,
		locationInfo
	};
}


async function getAllLocationData() {
	const locations = await db.select().from(location).execute();
	const locationsData = [];

	for (let i = 0; i < locations.length; i++) {
		const locationData = await getHousesDataFiltered(locations[i].id);
		locationsData.push(locationData);
	}

	return locationsData;
}

export default async function page() {
	const allLocationsData = await getAllLocationData();

	return (
		<div className="flex flex-row flex-wrap bg-gray-100 rounded-lg">
			{allLocationsData.map((locationData, idx) => (
				<div key={idx} className="p-8 m-4 max-w-[350px] bg-gray-100 border-2 border-white rounded-lg space-y-8">
					<h1 className="text-3xl font-semibold text-gray-700 mb-4">
						Location: <span className="font-normal text-blue-600">{locationData?.locationInfo[0]?.name}</span>
					</h1>

					<div className=" grid grid-cols-2 gap-4">
						<div className="bg-white p-4 rounded shadow flex items-center space-x-2">
							<AiOutlineHome className="text-blue-600" />
							<div className="text-gray-700">Total Houses: <span className="font-semibold">{locationData?.totalHouses}</span></div>
						</div>

						<div className="bg-white p-4 rounded shadow flex items-center space-x-2">
							<AiOutlineUser className="text-blue-600" />
							<div className="text-gray-700">Visited Houses: <span className="font-semibold">{locationData?.visitedHouses}</span></div>
						</div>

						<div className="bg-white p-4 rounded shadow flex items-center space-x-2">
							<AiOutlineCheck className="text-blue-600" />
							<div className="text-gray-700">Consent Final Yes: <span className="font-semibold">{locationData?.consentFinalYes?.length}</span></div>
						</div>

						<div className="bg-white p-4 rounded shadow flex items-center space-x-2">
							<AiOutlineReload className="text-blue-600" />
							<div className="text-gray-700">2nd Attempt: <span className="font-semibold">{locationData?.secondAttempt?.length}</span></div>
						</div>

						<div className="bg-white p-4 rounded shadow flex items-center space-x-2">
							<AiOutlineWarning className="text-blue-600" />
							<div className="text-gray-700">Non Existent: <span className="font-semibold">{locationData?.nonExistent}</span></div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}


// melhar deixar com os dois campos, pra ter todos (o email e o telefone).... tehdfjal tnsal.
// ordem n'umerica .
