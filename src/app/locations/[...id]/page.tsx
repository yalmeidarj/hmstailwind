// pages/locations/[id].tsx

import LocationCard from '../../../../../../web/my-app/components/LocationCard';
import StreetCard from '../../../../../../web/my-app/components/StreetCard';
import Link from 'next/link';
import styles from './styles.module.css';
import { Key, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from 'react';
import { prisma } from '../../lib/prisma'
// async function getLocations(id: string) {
// Get the location with the given id, using Prisma Client
// const location = await prisma.location.findMany({
//     where: {
//         id: parseInt(id),
//     },
//     include: {
//         Street: true,
//     },

// });
// const houses = await prisma.house.count({
//     where: {
//         locationId: parseInt(id),
//     },
// });
// await prisma.$disconnect();

// return { location, houses };


// return location;

// Use the fetch API to get the data from the API.

// }

// async function getNumberOfHousesOfStreet(id: string) {
//     const houses = await prisma.house.count({
//         where: {
//             streetId: parseInt(id),
//         },
//     });
//     await prisma.$disconnect();
//     return houses;
// }
async function getLocations(id: string) {
    const res = await fetch(`https://hmsapi.herokuapp.com/locations/${id}`, { cache: 'no-store' });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    const location = await res.json();

    return location;
    // Use Prisma
    // const location = await prisma.location.findMany({
    //     where: {
    //         id: parseInt(id),
    //     },
    //     include: {
    //         Street: true,
    //     },

    // });

    // await prisma.$disconnect();

    // return location
}

async function getStreetsByLocation(id: string) {
    const res = await fetch(`https://hmsapi.herokuapp.com/streets/${id}`, { cache: 'no-store' });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    const houses = await res.json();

    return houses;

    // Use Prisma
    // const houses = await prisma.street.findMany({
    //     where: {
    //         locationId: parseInt(id),
    //     },
    // });
    // await prisma.$disconnect();

    // return houses;

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
            <main className={styles.mainContainer}>
                <h1 className={styles.heading}>All Streets</h1>
                <div className={styles.streetSection}>
                    <div className={styles.locationInfoContainer}>
                        <h1>{location.name} </h1>
                        <h2> Area:{location.neighborhood}</h2>
                        {/* <h2>City: {location.city}</h2> */}
                    </div>
                    {streets.map((street: { id: Key | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined; lastVisited: string | number | Date; }) => (
                        <div className={styles.streetCard} key={street.id}>
                            <Link href={`/locations/streets/${street.id}`}>
                                <div className={styles.streetList}>
                                    <h1 className={styles.streetName} key={street.id}>{street.name}</h1>
                                    <div className={styles.streetInfo}>
                                        <h1 className={styles.streetEntry}>Last Visited Date: <span>{new Date(street.lastVisited)?.toLocaleDateString()}</span></h1>
                                        <h2 className={styles.streetEntry}>Time: <span>{new Date(street.lastVisited)?.toLocaleTimeString()}</span></h2>
                                        {/* <p className={styles.streetEntry}>Last Visited  <span></span></p> */}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}


