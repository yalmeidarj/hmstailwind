"use client"
import { DateTime } from 'luxon';

import { useAuth } from "@clerk/nextjs";


import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";

const API_URL = 'https://hmsapi.herokuapp.com/shiftLogger';

async function addNewShift(user: any, siteId: number | null) {
    if (!user || !siteId) {
        throw new Error('User and site ID are required');
    }

    const apiResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            workerId: user,
            locationId: siteId,
            isActive: true,
            updatedHouses: 0,
            updatedHousesFinal: 0,
            startingDate: DateTime.now().setZone('America/Toronto').toISO()
        })
    });

    if (!apiResponse.ok) {
        console.log(apiResponse)
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
    }

    // After the request, get the JSON response body
    const responseBody = await apiResponse.json();

    // Make sure the responseBody contains the ShiftLoggerId
    if (!responseBody.hasOwnProperty('ShiftLoggerId')) {
        throw new Error('Response does not contain ShiftLoggerId');
    }

    // Update the user
    try {
        const response = await user.update({
            unsafeMetadata: { "id": responseBody.workerId, "isClockedIn": true, "shiftLoggerId": responseBody.ShiftLoggerId }
        });

        if (response) {
            console.log('res', response)
        }
    } catch (err) {
        console.error('error', err)
    }



    // return response.json();
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

