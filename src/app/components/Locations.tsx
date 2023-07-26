"use client"
import { useState, useEffect } from 'react';
import ClientWrapper from './ClientWrapper';
import { fetchLocations } from './actions.js'

export default function LocationList() {
	// const [page, setPage] = useState(2);
	const [locations, setLocations] = useState([{
		id: 0,           // Default values
		name: '',
		neighborhood: '',
		priorityStatus: 0,
	}]);


	return (
		<div>
			<ClientWrapper />

		</div>
	);
}
// useEffect(() => {
// 	fetchLocations(page).then(newLocations => {
// 		const processedLocations = newLocations.map(location => ({
// 			...location,
// 			name: location.name || '',
// 			priorityStatus: location.priorityStatus,
// 			id: location.id,

// 		}));
// 		setLocations(processedLocations);
// 	});
// }, [page]);
// { id: number; name: string | null; neighborhood: string; priorityStatus: number; }