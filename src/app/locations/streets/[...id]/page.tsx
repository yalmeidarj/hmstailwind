
import styles from './styles.module.css';
import Link from 'next/link';
import { IoHomeSharp } from 'react-icons/io5';
import { house, street } from '../../../../../drizzle/schema';
import { eq, lt, gte, ne, inArray } from "drizzle-orm";

import db from '../../../../lib/utils/db';



async function getAllStreetNumbersOfStreet(streetId: any) {
    // Use the drizzle-orm to get the data from the database
    const idNumber = parseInt(streetId);
    const streetNumbers = await db.select().from(house).where(eq(house.streetId, idNumber));

    const previousStreet = await db.select().from(street).where(eq(street.id, idNumber));

    return { streetNumbers, previousStreet };

}

function getConditionalClass(statusAttempt: string) {
    switch (statusAttempt) {
        case 'not started':
            return 'bg-gray-300';
        case '1st attempt':
            return 'bg-blue-200';
        case '2nd attempt':
            return 'bg-yellow-200';
        case '3rd attempt':
            return 'bg-indigo-200';
        case 'consent final yes':
            return 'bg-green-200';
        case 'consent final no':
            return 'bg-red-200';
        default:
            return '';
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
        <main className="flex flex-col items-center justify-center w-full py-8 px-6">
            <Link href={`/locations/${houses.previousStreet[0].locationId}`}>
                <button className="text-green-600 hover:underline flex items-center space-x-2 mb-4">
                    Back to Site view
                </button>
            </Link>
            <h1 className="text-4xl font-bold mb-6 text-green-600 flex items-center space-x-2"><IoHomeSharp /> <span>{mainStreetName}</span></h1>
            <div className="w-full flex flex-wrap items-center justify-center">
                {houses.streetNumbers.map(house => {
                    const statusAttempt = house.statusAttempt || '';
                    return (
                        <div key={house.id} className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2`}>
                            {/* // <div key={house.id} className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 min-w-0`}> */}
                            <Link href={`/locations/streets/house/${house.id}`} className={`w-full h-full flex flex-col items-start justify-between py-4 px-6 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:opacity-70 ${getConditionalClass(statusAttempt)}`}>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2">{house.streetNumber}</h1>
                                <h3 className="text-md sm:text-lg md:text-xl font-semibold mb-2">Type: <span className="font-normal">{house.type}</span></h3>
                                <div className="w-full border-t border-b border-gray-300 py-2 mb-2">
                                    <h2 className="text-xs sm:text-sm md:text-base text-gray-500 mb-1">Attempt:</h2>
                                    <span className="text-xs sm:text-sm md:text-base">{house.statusAttempt}</span>
                                </div>
                                <div className="text-xs sm:text-sm md:text-base text-gray-700">
                                    <span className="font-bold">Notes:</span> {house.notes?.substring(0, 20)}...
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}



// deixar skadafjakdkfjada jadfjalsdujasdk
// moderate type of house on streets view
/// 
