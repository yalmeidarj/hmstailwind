
import styles from './styles.module.css';
import Link from 'next/link';
import { IoHomeSharp } from 'react-icons/io5';
import { house, street } from '../../../../../drizzle/schema';
import { eq, lt, gte, ne, inArray } from "drizzle-orm";
import { Suspense } from 'react';

import db from '../../../../lib/utils/db';



async function getAllStreetNumbersOfStreet(streetId: any) {
    // Use the drizzle-orm to get the data from the database
    const idNumber = parseInt(streetId);
    const streetNumbers = await db.select().from(house).where(eq(house.streetId, idNumber)).orderBy(house.streetNumber).execute();

    const previousStreet = await db.select().from(street).where(eq(street.id, idNumber)).execute();

    return { streetNumbers, previousStreet };

}


function getConditionalClass(statusAttempt: string, consent: string) {
    switch (statusAttempt) {
        case 'No Attempt':
            return 'bg-gray-300 text-gray-800';
        case 'Door Knock Attempt 1':
            return 'bg-blue-200 text-blue-900';
        case 'Door Knock Attempt 2':
            return 'bg-yellow-200 text-yellow-900';
        case 'Door Knock Attempt 3':
            return 'bg-indigo-200 text-indigo-900';
        case 'Door Knock Attempt 4':
            return 'bg-orange-200 text-orange-900';
        case 'Door Knock Attempt 5':
            return 'bg-purple-200 text-purple-900';
        case 'Door Knock Attempt 6':
            return 'bg-red-200 text-red-900';
        case 'Consent Final':
            if (consent.toLowerCase() == 'yes') {
                return 'bg-green-200 text-green-900';
            } else if (consent.toLowerCase() == 'no') {
                return 'bg-red-200 text-red-900';
            } else {
                return 'bg-gray-200 text-gray-900';
            }
        case 'engineer visit required':
            return 'bg-teal-200 text-teal-900';
        case 'Home Does Not Exist':
            return 'bg-black-200 text-black-900';
        default:
            return 'border-2 border-black text-blue-900';
    }

}





export default async function Page({
    params: { id },
}: {
    params: { id: string };
}) {

    const houses = await getAllStreetNumbersOfStreet(id);
    const mainStreetName = houses.previousStreet[0].name;

    return (
        <main className="w-full py-8 px-6">
            <div className="flex flex-col justify-center items-center max-w-6xl mx-auto">
                <Link href={`/locations/${houses.previousStreet[0].locationId}`}>
                    <button className="text-green-600 hover:underline flex items-center space-x-2 mb-4">
                        Back to Site view
                    </button>
                </Link>
                <h1 className="text-4xl font-bold mb-6 text-green-600 flex items-center space-x-2">
                    <IoHomeSharp /> <span>{mainStreetName}</span>
                </h1>
                {/* <div className="w-full grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"> */}
                <div className='flex flex-wrap justify-around min-w-[360px]'>
                    {houses.streetNumbers.map(house => (
                        <div key={house.id} className="min-w-[360px] m-2 p-2">
                            <Link
                                href={`/locations/streets/house/${house.id}`}
                                className={`w-full max-w-lg h-full flex flex-col items-start justify-between py-4 lg:py-6 xl:py-8 px-6 lg:px-8 xl:px-10 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:opacity-70 ${getConditionalClass(
                                    house?.statusAttempt ?? " ",
                                    house?.consent ?? " "
                                )}`}
                            >
                                <div className="flex flex-row w-full justify-between border-b border-white py-2 mb-2">
                                    <div className="flex flex-col justify-center items-center p-2">
                                        <h1 className="text-xl font-bold leading-tight mb-2 text-center">
                                            {house.streetNumber}
                                        </h1>
                                    </div>
                                    <div className="flex flex-row justify-center items-center p-2 space-x-4">
                                        <div className="flex flex-col justify-center items-center">
                                            <h2 className="text-md font-semibold leading-snug mb-1">Att:</h2>
                                            <span className="text-sm">
                                                {house.statusAttempt === "Consent Final" ? house.consent : house.statusAttempt}
                                            </span>
                                        </div>
                                        <div className="flex flex-col justify-center items-center">
                                            <h2 className="text-md font-semibold leading-snug mb-1">Type:</h2>
                                            <span className="text-sm">{house.type ?? 'To verify'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm leading-relaxed text-gray-700">
                                    <span className="font-bold">Notes:</span> {house.notes?.substring(0, 40)}...
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}



// deixar skadafjakdkfjada jadfjalsdujasdk
// moderate type of house on streets view
/// 
