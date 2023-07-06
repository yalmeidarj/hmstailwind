
import Link from 'next/link';
import styles from './styles.module.css';
import { Key, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from 'react';
import { prisma } from '../../../lib/utils/prisma';
import db from '@/lib/utils/db';
import { eq, lt, gte, ne, inArray } from "drizzle-orm";
import { location, street } from "../../../../drizzle/schema";



async function getLocations(id: string) {
    // const res = await fetch(`https://hmsapi.herokuapp.com/locations/${id}`, { cache: 'no-store' });

    // if (!res.ok) {
    //     throw new Error('Failed to fetch data');
    // }

    // const location = await res.json();
    // return location;

    // Use driizzle-orm
    const idNumber = parseInt(id);
    const locations = await db.select().from(location).where(eq(location.id, idNumber));

    return locations[0];
}

async function getStreetsByLocation(id: string) {

    const idNumber = parseInt(id);
    const streets = await db.select().from(street).where(eq(street.locationId, idNumber));
    return streets;


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
    // const location = l.location;
    const streets = await getStreetsByLocation(params.id);

    // const numberOfHouses = await getNumberOfHousesOfStreet(params.id);
    return (
        <>
            <main className="flex flex-col items-center justify-center w-full py-8 px-6">
                <Link href={`/`}>
                    <button className="text-green-600 hover:underline flex items-center space-x-2 mb-4">
                        Back to All Locations
                    </button>
                </Link>
                <h1 className={styles.heading}>Streets of: <span>{location.name}</span> </h1>
                <div className={styles.streetSection}>
                    {streets.map((street) => (
                        <div className={styles.streetCard} key={street.id}>
                            <Link href={`/locations/streets/${street.id}`}>
                                <div className={styles.streetList}>
                                    <h1 className={styles.streetName} key={street.id}>{street.name}</h1>
                                    <div className={styles.streetInfo}>
                                        <h1 className={styles.streetEntry}>Last Visited Date: <span>{street.lastVisited ? new Date(street.lastVisited).toLocaleString() : 'N/A'}</span></h1>


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


