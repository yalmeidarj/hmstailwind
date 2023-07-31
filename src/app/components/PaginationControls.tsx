"use client"
import { FC } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationControlsProps {
	hasNextPage: boolean
	hasPrevPage: boolean
	listSize: number

}

const PaginationControls: FC<PaginationControlsProps> = (
	{
		hasNextPage,
		hasPrevPage,
		listSize
	}
) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const page = searchParams.get('page') ?? '1'
	const per_page = searchParams.get('per_page') ?? '20'

	return (
		<div className='flex space-x-2 items-center'>
			<button
				className={`bg-blue-600 text-white p-2 rounded transition duration-200 ease-in-out ${!hasPrevPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
				disabled={!hasPrevPage}
				onClick={() => {
					router.push(`./?page=${Number(page) - 1}&per_page=${per_page}`)
				}}>
				Prev page
			</button>
			<div className='bg-gray-200 text-black p-2 rounded'>
				{page} / {Math.ceil((Number(listSize) / Number(per_page)))}
			</div>
			<button
				className={`bg-blue-600 text-white p-2 rounded transition duration-200 ease-in-out ${!hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
				disabled={!hasNextPage}
				onClick={() => {
					router.push(`./?page=${Number(page) + 1}&per_page=${per_page}`)
				}}>
				Next page
			</button>
		</div>

	)

}

export default PaginationControls;