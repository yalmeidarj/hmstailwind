// import { Key } from 'react';
// import styles from './styles.module.css';
// import Link from 'next/link';
// import SimpleForm from '../../../../../../components/simpleForm/SimpleForm';
// import { type } from 'os';




// type House = {
//     id: string;
//     lastName: string;
//     notes: string;
//     name: string;
//     streetNumber: string;
//     phoneOrEmail: string;
//     status: string;
//     type: string;
// }

// async function getHouseInfo(id: string) {

//     const res = await fetch(`http://localhost:9000/houses/${id}`);

//     return res.json();
// }

// async function updateHouseInfo(id: string, data: House) {
//     const res = await fetch(`http://localhost:9000/houses/${id}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     });
//     return res.json();
// }





// export default async function Page({
//     params: { id },
// }: {
//     params: { id: string };
// }) {

//     const onSubmit = async (data: House) => {
//         await updateHouseInfo(id, data);
//     };

//     const house = await getLocations(id);
//     const info = await getHouseInfo(id);
//     async function handleSubmit(onSubmit: any) {
//         // implement onSubmit function
//         await onSubmit();
//     }


//     return (
//         <main>
//             <div>
//                 <h1>PROPERTY DETAILS</h1>
//                 <div className={styles.container}>
//                     <div className={styles.propertyContainer}>
//                         <h1>
//                             {house.streetNumber}
//                         </h1>
//                         <h2>
//                             {house.name}
//                         </h2>
//                         <span>
//                             {house.status}
//                         </span>
//                         <span>
//                             {house.type}
//                         </span>
//                     </div>
//                     <h1>
//                         {id}
//                     </h1>
//                     <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
//                         <div className={styles.formGroup}>
//                             <label>House Type: {house.id}</label>
//                             <div>
//                                 <label>
//                                     <input
//                                         type="radio"
//                                         // name={`houseType${.id}}`}
//                                         value="Easy"
//                                     // checked={houseType === 'Easy'}
//                                     />
//                                     Easy
//                                 </label>
//                                 <label>
//                                     <input
//                                         type="radio"
//                                         name="houseType"
//                                         value="Medium"
//                                     // checked={houseType === 'Medium'}
//                                     />
//                                     Medium
//                                 </label>
//                                 <label>
//                                     <input
//                                         type="radio"
//                                         name="houseType"
//                                         value="Hard"
//                                     // checked={houseType === 'Hard'}
//                                     />
//                                     Hard
//                                 </label>
//                             </div>
//                         </div>
//                         <div className={styles.formGroup}>
//                             <label>Last Name:</label>
//                             <input type="text" name="lastName" value={"lastName"} />
//                         </div>
//                         <div className={styles.formGroup}>
//                             <label>Name:</label>
//                             <input type="text" name="name" value={"name"} />
//                         </div>
//                         <div className={styles.formGroup}>
//                             <label>Email:</label>
//                             <input type="email" name="email" value={"email"} />
//                         </div>
//                         <div className={styles.formGroup}>
//                             <label>Phone:</label>
//                             <input type="text" name="phone" value={"phone"} />
//                         </div>
//                         <div className={styles.formGroup}>
//                             <label>Notes:</label>
//                             <textarea name="notes" value={"notes"} />
//                         </div>
//                         <button type="submit" className={styles.submitButton}>Update Property Details</button>
//                     </form>
//                 </div>
//             </div>
//         </main >
//     );
// }



// app/form/page.tsx (Server Component)

import { NextResponse } from 'next/server';
import styles from './styles.module.css';
import SimpleForm from '../../../../components/simpleForm/SimpleForm'
// import { PrismaClient, Prisma } from '@prisma/client'
import { AiFillHome } from 'react-icons/ai';




// const prisma = new PrismaClient()
async function getHouse(id: string) {
    //    Use prisma
    // const house = await prisma.house.findUnique({
    //     where: { id: parseInt(id) },
    // })
    // await prisma.$disconnect()
    // return house

    //    Use the fetch API
    const res = await fetch(`https://hmsapi.herokuapp.com/property/${id}`, { next: { revalidate: 60 } })
    const house = await res.json()
    return house

}


interface House {
    streetId: string;
    id: string;
    name: string;
    lastName: string;
    statusAttempt: string;
    emailOrPhone: string;
    notes: string;
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

    // const handleSubmit = async (data: any) => {
    //     const updatedHouse = {
    //         type: data.houseType,
    //         lastName: data.lastName,
    //         name: data.name,
    //         statusAttempt: data.statusAttempt,
    //         phoneOrEmail: `${data.email}, ${data.phone}`,
    //         notes: data.notes,
    //     };

    //     const response = await fetch(`https://hmsapi.herokuapp.com/property/${house?.id}`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(updatedHouse),
    //     });

    //     if (!response.ok) {
    //         console.error("There was an error updating the house!");
    //         console.log(house?.id);
    //     }

    //     return 'Update Successfully';
    // };

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
        <main>
            <div>
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

                        <SimpleForm
                            params={{
                                id: house.id,
                                streetId: house.streetId,
                            }}
                        // onSubmit={handleSubmit}
                        // name={house.name}
                        // lastName={house.lastName}
                        // statusAttempt={house.statusAttempt}
                        // emailOrPhone={house.emailOrPhone}
                        // notes={house.notes}
                        // type={house.type}
                        // streetNumber={house.streetNumber}
                        />
                    </div>
                </div>
            </div>
        </main>
    );

}



