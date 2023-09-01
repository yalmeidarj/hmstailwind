import db from '../../lib/utils/db'
import { location, house, worker, shiftLogger } from '../../../drizzle/schema'
import { and, eq } from "drizzle-orm";
import { AiOutlineHome, AiOutlineUser, AiOutlineCheck, AiOutlineReload, AiOutlineWarning, AiOutlineClose } from "react-icons/ai";
import PaginationControls from '../components/PaginationControls';
import { Suspense } from 'react';


async function getLocationsListSize() {
	// Use the drizzle-orm to get the data from the database
	const locations = await db.select().from(location).execute();
	return locations.length;
}

async function getHousesDataFiltered(locationId: number) {

	const houses = await db.select().from(house).where(eq(house.locationId, locationId)).execute();
	const locationInfo = await db.select().from(location).where(eq(location.id, locationId)).execute();

	const allHousesWithDatesAsStrings = houses.map(house => ({
		...house,
		lastUpdated: house.lastUpdated ? new Date(house.lastUpdated).toISOString() : null,
	}));

	const totalHouses = allHousesWithDatesAsStrings.length;
	const visitedHouses = allHousesWithDatesAsStrings.filter(house => house.lastUpdated !== null).length;
	const consentFinal = allHousesWithDatesAsStrings.filter(house => house.statusAttempt === 'Consent Final');
	// const consentFinalYes = consentFinal.filter(house => house.consent === 'Yes').length;
	const consentFinalYes = consentFinal.filter(house => house.consent === 'Yes' || house.consent === 'Consent Final Yes').length;

	const consentFinalNo = consentFinal.filter(house => house.consent === 'No').length;
	const secondAttempt = allHousesWithDatesAsStrings.filter(house => house.statusAttempt === 'Door Knock Attempt 2').length;
	const percentageYes = (consentFinalYes / totalHouses) * 100;
	const percentageNo = (consentFinalNo / totalHouses) * 100;
	const nonExistent = allHousesWithDatesAsStrings.filter(house => house.statusAttempt === 'Non Existent').length;

	return {
		allHousesWithDatesAsStrings,
		percentageNo,
		percentageYes,
		totalHouses,
		visitedHouses,
		consentFinalYes,
		consentFinalNo,
		secondAttempt,
		nonExistent,
		locationInfo
	};
}



async function getAllLocationData(number: string, size: string) {
	const pageNumber = parseInt(number);
	const pageSize = parseInt(size);
	const offset = (pageNumber - 1) * pageSize;

	const locations = await db.select().from(location).limit(pageSize).offset(offset).execute();
	const locationsData = [];

	for (let i = 0; i < locations.length; i++) {
		const locationData = await getHousesDataFiltered(locations[i].id);
		locationsData.push(locationData);
	}

	return locationsData;
}

export default async function page({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined }
}) {

	const page = searchParams['page'] ?? '1'
	const per_page = searchParams['per_page'] ?? '20'

	const start = (Number(page) - 1) * Number(per_page) // 0, 5, 10 ...
	const end = start + Number(per_page)  // 5, 10, 15 .

	const allLocationsData = await getAllLocationData(page, per_page);

	const listSize = await getLocationsListSize();

	return (
		<div className="flex flex-col justify-center items-center flex-wrap bg-gray-100 rounded-lg">
			<PaginationControls
				listSize={listSize}
				hasNextPage={end < listSize}
				hasPrevPage={start > 0}
			/>
			<div className="flex flex-row justify-around items-center flex-wrap bg-gray-100 rounded-lg">
				{allLocationsData.map((locationData, idx) => (
					<Suspense fallback={<h1 className="font-semibold text-black">Loading</h1>}>
						<div key={idx} className="p-8 m-4 max-w-[380px] bg-gray-100 border-2 border-white rounded-lg space-y-8">
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
									<div className="text-gray-700">Consent Final Yes: <span className="font-semibold">{locationData?.consentFinalYes}</span></div>
									<h1 className="text-green-700 border-2 rounded-full  border-solid p-1">{Math.ceil(locationData.percentageYes)}%</h1>
								</div>

								<div className="bg-white p-4 rounded shadow flex items-center space-x-2">
									<AiOutlineReload className="text-blue-600" />
									<h1 className="text-gray-700">2nd Attempt: <span className="font-semibold">{locationData?.secondAttempt}</span></h1>

								</div>

								<div className="bg-white p-4 rounded shadow flex items-center space-x-2">
									<AiOutlineWarning className="text-blue-600" />
									<div className="text-gray-700">Non Existent: <span className="font-semibold">{locationData?.nonExistent}</span></div>
								</div>
								<div className="bg-white p-4 rounded shadow flex items-center space-x-2">
									<AiOutlineClose className="text-blue-600" />
									<div className="text-gray-700">Consent Final No: <span className="font-semibold">{locationData?.consentFinalNo}</span></div>
									<h1 className="text-green-700 border-2 rounded-full border-solid p-1">{Math.ceil(locationData.percentageNo)}%</h1>
								</div>
							</div>
						</div>
					</Suspense>
				))}
			</div>
			<PaginationControls
				listSize={listSize}
				hasNextPage={end < listSize}
				hasPrevPage={start > 0}
			/>
		</div>
	);
}


