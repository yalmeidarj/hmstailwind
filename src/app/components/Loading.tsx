import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Loading = () => {
	return (
		<div className='flex justify-center items-center h-full'>
			<AiOutlineLoading3Quarters className='animate-spin h-6 w-6 text-black mr-3' />
			<p className='text-black'>Loading...</p>
		</div>
	);
};

export default Loading;