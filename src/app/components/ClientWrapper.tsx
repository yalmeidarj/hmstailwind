'use client'
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, Suspense, useState } from 'react'
import { useTransition } from 'react'
import { fetchLocations, getShiftLoggerData, getNumberOfStreets, getNumberOfHouses } from './actions.js'

import Link from 'next/link.js'
// import SiteLoadingSkeleton from './SiteLoadingSkeleton.jsx'

type LocationType = {
	id: number;
	name: string | null;
	neighborhood: string;
	priorityStatus: number;
};


function ClientWrapper() {
	const [page, setPage] = useState(1)
	const [locations, setLocations] = useState<LocationType[]>([])
	const [isPending, startTransition] = useTransition()

	// const [page, setPage] = useState(1);

	async function handlePrevPage(e: { preventDefault: () => void }) {
		e.preventDefault()
		if (page > 1) {
			startTransition(() => {
				fetchLocations(page - 1, 20)
					.then(newLocations => {
						setPage(page - 1)
						setLocations(newLocations)
					})
			})
		}
	}


	async function handleNextPage(e: { preventDefault: () => void }) {
		e.preventDefault()
		if (page <= 1) {
			startTransition(() => {
				fetchLocations(page + 1, 20)
					.then(newLocations => {
						setPage(page + 1)
						setLocations(newLocations)
					})
			})
		}
	}

	return (
		<div className="flex flex-col items-center justify-center w-full py-8 px-6">
			<form onSubmit={handleNextPage}>
				<button className="font-semibold text-black" type="submit" disabled={isPending}>
					Next Page
				</button>
				<button onClick={handlePrevPage} className="font-semibold text-black" type="submit" disabled={isPending}>
					Previous Page
				</button>

				{locations.map((location: { id: Key | null | undefined; priorityStatus: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) => (
					<Suspense fallback={<h1>Loading</h1>} key={location.id}>
						<li className="p-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-md shadow-md">
							<Link href={`/locations/${location.id}`}>
								<div className="block">
									<div className="flex items-center justify-center mb-3 bg-white rounded-md shadow-sm p-3">
										<h2 className="text-xs font-semibold text-teal-500">
											Priority
										</h2>
										<span className="text-xs font-semibold text-teal-500">
											{" "}
											{location.priorityStatus}
										</span>
									</div>
									<h2 className="text-blue-700 text-center text-lg font-semibold mb-1">
										{location.name}
									</h2>
									<div className="flex items-center justify-center">
										<p className="text-sm text-gray-500 mt-1">
											{/* {location.neighborhood} | Streets:{" "} */}
											{getNumberOfStreets(location.id)} | Houses:{" "}
											{getNumberOfHouses(location.id)}
										</p>
									</div>
									<p className="text-sm text-gray-500 mt-1">
										Currently working: {getShiftLoggerData(location.id)}
									</p>
								</div>
							</Link>
						</li>
					</Suspense>
				))}

			</form>
		</div>
	)
}

export default ClientWrapper;
