"use client"

import { useAuth } from "@clerk/nextjs";
// import React, { useState, useEffect, Key } from 'react';
// import { useUser } from "@clerk/nextjs";

// const API_URL = 'https://hmsapi.herokuapp.com/shiftLogger';

// interface ClockInProps {
//     siteId: Key | null | undefined;
// }

// const ClockIn: React.FC<ClockInProps> = ({ siteId }) => {

//     const [response, setResponse] = useState(null)


//     const { isLoaded, isSignedIn, user } = useUser();
//     const [shiftData, setShiftData] = useState<{ workerId: number, locationId: number, isActive: boolean, startingDate: string } | null>(null);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {
//             const response = await fetch(API_URL, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(shiftData),
//             });
//             const responseData = await response.json();
//             if (!response.ok) {
//                 throw new Error(`POST request failed: ${responseData.error || ''}`);
//             }
//             const shifLoggerId = responseData.ShiftLoggerId;
//             // const updateUser = user?.update({
//             //     publicMetadata: { "publicMetadata": { "id": shiftData.workerId, "isClockedIn": true, "ShiftLoggerId": shifLoggerId } }
//             // });
//             // console.log('ShiftLogger ID:', shifLoggerId);
//             // if (updateUser) {
//             //     console.log('Updated user unsafeMetadata', updateUser);
//             // }
//         } catch (error) {
//             console.error(`Error occurred: ${error}`);
//         }
//     };

//     if (!isLoaded || !isSignedIn) {
//         console.log(user)
//         return (
//             <div className="flex flex-col items-center mt-8">
//                 {/* {user.publicMetadata.id} */}
//                 <h1 className="text-black font-bold">Waiting for page to load...</h1>
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col items-center mt-8">

//             <form onSubmit={handleSubmit} className="inline-flex">
//                 <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                     Clock In
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default ClockIn;

// components/ClockIn.tsx
import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";

const API_URL = 'https://hmsapi.herokuapp.com/shiftLogger';

async function addNewShift(user: any, siteId: number | null) {
    if (!user || !siteId) {
        throw new Error('User and site ID are required');
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            workerId: user,
            locationId: siteId,
            isActive: true,
            startingDate: new Date().toISOString()
        })

    });

    if (!response.ok) {
        console.log(response)
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

interface ClockInProps {
    siteId: number | null;
}

const ClockIn: React.FC<ClockInProps> = ({ siteId }) => {
    // const [response, setRe]
    const { user } = useUser();


    const [workerId, setWorkerId] = useState(user?.unsafeMetadata.id as number)
    const [locationId, setLocationId] = useState(siteId as number)

    useEffect(() => {
        if (user && siteId) {
            setWorkerId(user?.unsafeMetadata.id as number)
            setLocationId(siteId as number);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await addNewShift(workerId, locationId);
            alert("Successfully clocked in.");
        } catch (error) {
            alert("Failed to clock in. Please try again.");
            console.log(workerId)
            console.log(siteId)
            console.error(error);
        }
    };

    return (
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            Clock In
        </button>
    );
};

export default ClockIn;

