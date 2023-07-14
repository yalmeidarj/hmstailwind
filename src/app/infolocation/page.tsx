import db from '../../lib/utils/db'
import { location, house, worker, shiftLogger } from '../../../drizzle/schema'
import { and, eq } from "drizzle-orm";
import { AiOutlineHome, AiOutlineUser, AiOutlineCheck, AiOutlineReload, AiOutlineWarning } from "react-icons/ai";


async function getHousesDataFiltered(locationId: number) {

	const locationIds = await db.select({
		field1: location.id,
	}).from(location);

	// const allLocations = await db.select().from(location).whereIn(location.id, locationIds.map(id => id.field1));


	// const allLocations = locationIds.map(property => ({
	// 	...property,

	// }));

	const houses = await db.select().from(house).where(eq(house.locationId, locationId));
	const locationInfo = await db.select().from(location).where(eq(location.id, locationId));
	const allShiftLoggerWithDatesAsStrings = houses.map(house => ({
		...house,
		lastUpdated: house.lastUpdated ? new Date(house.lastUpdated).toISOString() : null,
	}));

	const totalHouses = allShiftLoggerWithDatesAsStrings.length;
	const visitedHouses = allShiftLoggerWithDatesAsStrings.filter(house => house.lastUpdated !== null).length;
	const consentFinalYes = allShiftLoggerWithDatesAsStrings.filter(house => house.statusAttempt === 'consent final yes');
	const secondAttempt = allShiftLoggerWithDatesAsStrings.filter(house => house.statusAttempt === '2nd attempt');

	const nonExistent = allShiftLoggerWithDatesAsStrings.filter(house =>
		house.name === null &&
		house.locationId === null &&
		house.streetNumber === null &&
		house.lastName === null &&
		house.notes === null &&
		house.phoneOrEmail === null &&
		house.type === null &&
		house.streetId === null &&
		house.lastUpdatedBy === null &&
		house.statusAttempt === null &&
		house.consent === null
	).length;

	return {
		allShiftLoggerWithDatesAsStrings,
		totalHouses,
		visitedHouses,
		consentFinalYes,
		secondAttempt,
		nonExistent,
		locationInfo
	};
}

export default async function page() {
	const housesData = await getHousesDataFiltered(1);
	return (
		<div className="p-8 bg-gray-100 rounded-lg space-y-8">
			<h1 className="text-3xl font-semibold text-gray-700 mb-4">
				Location: <span className="font-normal text-blue-600">{housesData?.locationInfo[0]?.name}</span>
			</h1>

			<div className="grid grid-cols-2 gap-4">
				<div className="bg-white p-4 rounded shadow flex items-center space-x-2">
					<AiOutlineHome className="text-blue-600" />
					<div className="text-gray-700">Total Houses: <span className="font-semibold">{housesData?.totalHouses}</span></div>
				</div>

				<div className="bg-white p-4 rounded shadow flex items-center space-x-2">
					<AiOutlineUser className="text-blue-600" />
					<div className="text-gray-700">Visited Houses: <span className="font-semibold">{housesData?.visitedHouses}</span></div>
				</div>

				<div className="bg-white p-4 rounded shadow flex items-center space-x-2">
					<AiOutlineCheck className="text-blue-600" />
					<div className="text-gray-700">Consent Final Yes: <span className="font-semibold">{housesData?.consentFinalYes?.length}</span></div>
				</div>

				<div className="bg-white p-4 rounded shadow flex items-center space-x-2">
					<AiOutlineReload className="text-blue-600" />
					<div className="text-gray-700">2nd Attempt: <span className="font-semibold">{housesData?.secondAttempt?.length}</span></div>
				</div>

				<div className="bg-white p-4 rounded shadow flex items-center space-x-2">
					<AiOutlineWarning className="text-blue-600" />
					<div className="text-gray-700">Non Existent: <span className="font-semibold">{housesData?.nonExistent}</span></div>
				</div>
			</div>

			{/* Uncomment if you need to render secondAttempt's status
    <div className="mt-4 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Second Attempt Statuses:</h2>
        <ul className="space-y-1 text-gray-600">
            {housesData?.secondAttempt?.map((house, index) => (
                <li key={index}>
                    {house?.statusAttempt}
                </li>
            ))}
        </ul>
    </div>
    */}
		</div>

	)
}

{/* Uncomment if you need to render secondAttempt's status
<div className="space-y-6">
	{housesData?.secondAttempt?.map((house) => (
			<p className="text-black">
					{house?.statusAttempt}
			</p>
	))}
</div> */}


