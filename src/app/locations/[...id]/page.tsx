
import Link from 'next/link';
import { Key, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from 'react';
import { prisma } from '../../../lib/utils/prisma';
import db from '@/lib/utils/db';
import { eq, lt, gte, ne, inArray } from "drizzle-orm";
import { location, street, house } from "../../../../drizzle/schema";

export const runtime = 'edge';

async function getLocations(id: string) {

    const idNumber = parseInt(id);
    const locations = await db.select().from(location).where(eq(location.id, idNumber)).execute();

    return locations[0];
}

async function getStreetsByLocation(id: string) {

    const idNumber = parseInt(id);
    const streets = await db.select().from(street).where(eq(street.locationId, idNumber)).execute();
    return streets;
}

async function getNumberOfHouses(streetId: any) {
    // Use drizzle-orm to get the number of streets for each location
    const houses = await db.select().from(house).where(eq(house.streetId, streetId)).execute();
    return houses.length;
}




type Params = {
    id: string,
    name: string,
    address: string;
    entry:
    {
        status: string;
        streetName: string;
    }

};

type PageProps = {
    params: Params;
};

export default async function Page({ params }: PageProps) {
    const location = await getLocations(params.id);

    const streets = await getStreetsByLocation(params.id);

    // const numberOfHouses = await getNumberOfHousesOfStreet(params.id);
    return (
        <>
            <main className="flex flex-col items-center justify-center w-full py-8 px-6">
                <Link href={`/`}>
                    <button className="text-green-600 hover:underline flex items-center space-x-2 mb-4">
                        Back to All Sites
                    </button>
                </Link>
                <h1 className="text-blue-900">Streets of: <span>{location.name}</span> </h1>
                <div className="flex flex-row flex-wrap justify-center bg-white rounded shadow-md">
                    {streets.map((street) => (
                        <div className="w-full sm:w-auto p-4 border border-white rounded" key={street.id}>
                            <Link href={`/locations/streets/${street.id}`}>
                                <div className="flex flex-col p-6 h-48 gap-2 bg-gray-800 rounded border border-white">
                                    <h1 className="text-white" key={street.id}>{street.name}</h1>
                                    <div className="text-xs">
                                        <h1 className="text-xs text-gray-500">Last Visited By: <span className="text-gray-300 font-bold">{street.lastVisitedby}</span></h1>
                                        <h2 className="text-xs text-gray-500">Date: <span className="text-gray-300 font-bold">{street.lastVisited ? new Date(street.lastVisited).toLocaleString() : 'N/A'}</span></h2>
                                        <h3 className="text-xs text-gray-500">Total Properties: <span className="text-gray-300 font-bold">{getNumberOfHouses(street.id)}</span></h3>
                                    </div>
                                </div>
                            </Link>
                        </div>

                    ))}
                </div>
            </main >
        </>
    );
}


