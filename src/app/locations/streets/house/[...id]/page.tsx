
import { NextResponse } from 'next/server';
import styles from './styles.module.css';
import SimpleForm from '../../../../components/simpleForm/SimpleForm'
// import { PrismaClient, Prisma } from '@prisma/client'
import { AiFillHome } from 'react-icons/ai';
import { Suspense } from 'react';
import Link from 'next/link';
import db from '../../../../../lib/utils/db';
import { house } from '../../../../../../drizzle/schema';
import { eq } from "drizzle-orm";


// const prisma = new PrismaClient()
async function getHouse(id: string) {

    const houseId = parseInt(id);
    const houseData = await db.select().from(house).where(eq(house.id, houseId)).execute();
    return houseData[0]

}




interface House {
    streetId: number;
    id: number;
    name: string;
    lastName: string;
    statusAttempt: string;
    email: string;
    phone: string;
    notes: string;
    salesForceNotes: string;
    type: string;
    streetNumber: string;
}

type Params = {
    House: {
        id: string;
    };
};

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const house = await getHouse(id);


    if (house === null) {
        return (
            <main>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="flex flex-col items-center justify-center text-2xl font-semibold text-gray-700 mb-4">Property Not Found</h1>
                    <p>The requested property could not be found.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center w-full py-8 px-6">

            <Link href={`/locations/streets/${house.streetId}`}>
                <button className="text-green-600 hover:underline flex items-center space-x-2 mb-4">
                    Go back to view all houses
                </button>
            </Link>
            <h1 className="flex flex-col items-center justify-center text-2xl font-semibold text-gray-700 mb-4">PROPERTY DETAILS</h1>
            <div className="flex flex-col items-center justify-center w-full">
                Street id: {house.name}
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="w-full max-w-xs text-white bg-gray-700 rounded p-4 m-4 flex flex-col items-center justify-center">
                        <h1><AiFillHome /> {house.streetNumber}</h1>
                        <h2>{house.lastName}, {house.name}</h2>
                        {/* <h3>{house?.emailOrPhone}</h3> */}
                        <h4>{house.type} | {house.statusAttempt}</h4>
                        <p>{house.notes}</p>
                    </div>
                    <Suspense fallback={<h2 className='text-black'>🌀 Loading...</h2>}>
                        <SimpleForm
                            params={{
                                id: house.id,
                                streetId: house.streetId,
                                name: house.name || " ",
                                lastName: house.lastName || " ",
                                statusAttempt: house.statusAttempt || " ",
                                email: house.email || " ",
                                phone: house.phone || " ",
                                salesForceNotes: house.salesForceNotes || " ",
                                notes: house.notes || " ",
                                type: house.type || " ",
                                streetNumber: house.streetNumber
                            }}
                        // onSubmit={handleSubmit}
                        />
                    </Suspense>
                </div>
            </div>
        </main>
    );

}


