"use client"

import React, { useState, useEffect, Key } from 'react';
import { useUser } from "@clerk/nextjs";

const API_URL = 'https://hmsapi.herokuapp.com/shiftLogger';

interface ClockInProps {
    siteId: Key | null | undefined;
}

const ClockIn: React.FC<ClockInProps> = ({ siteId }) => {

    const { isLoaded, isSignedIn, user } = useUser();
    const [shiftData, setShiftData] = useState<{ workerId: number, locationId: number, isActive: boolean, startingDate: string } | null>(null);

    useEffect(() => {
        if (user && siteId) {
            const workerId = user.unsafeMetadata.id as number;
            const locationId = siteId as number;
            const isActive = true;
            setShiftData({
                workerId,
                locationId,
                isActive,
                startingDate: new Date().toISOString(),
            });
        }
    }, [user, siteId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(shiftData),
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(`POST request failed: ${responseData.error || ''}`);
            }
            const shifLoggerId = responseData.ShiftLoggerId;
            const updateUser = user?.update({
                unsafeMetadata: { "id": shiftData?.workerId, "isClockedIn": true, "ShiftLoggerId": shifLoggerId }
            });
            console.log('ShiftLogger ID:', shifLoggerId);
            if (updateUser) {
                console.log('Updated user unsafeMetadata', updateUser);
            }
        } catch (error) {
            console.error(`Error occurred: ${error}`);
        }
    };

    if (!isLoaded || !isSignedIn) {
        return (
            <div className="flex flex-col items-center mt-8">
                <h1 className="text-2xl font-bold">Waiting for page to load...</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mt-8">
            <form onSubmit={handleSubmit} className="inline-flex">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Clock In
                </button>
            </form>
        </div>
    );
};

export default ClockIn;

