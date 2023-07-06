"use client"
// components/ClockIn.tsx
import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { Key } from 'react';
import { worker } from '../../../drizzle/schema';
import { el } from 'date-fns/locale';
import { ClientResource, ActiveSessionResource, UserResource } from '@clerk/types';
// import { userInfo } from 'os';

interface ClockInProps {
    // workerId: Key | null | undefined;
    locationId: Key | null | undefined;
}

interface Resources {
    client: ClientResource;
    session?: ActiveSessionResource | null;
    user?: UserResource | null;
}


const ClockIn: React.FC<ClockInProps> = ({ locationId }) => {

    const { isLoaded, isSignedIn, user } = useUser();
    const workerId = user?.unsafeMetadata.id as number
    const [shiftData, setShiftData] = useState({
        workerId,
        locationId,
        startingDate: new Date().toISOString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();


        console.log(user?.unsafeMetadata)
        console.log(shiftData);
        fetch('https://hmsapi.herokuapp.com/shiftLogger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shiftData),
        })
    };


    if (!isLoaded || !isSignedIn) {
        return (
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-center">Please Sign In</h1>
            </div>

        );
    }

    // const role: React.ReactNode = user.unsafeMetadata.role || "Unknown";
    // const userI = await userInfo();
    return (
        <div className="flex flex-col">
            <form onSubmit={handleSubmit}>
                <label htmlFor="workerId">Worker ID</label>
                <h2>{(user?.unsafeMetadata.role as string || "no-role")} </h2>
                <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Clock In
                </button>
            </form>
        </div>
    );
};

export default ClockIn;
