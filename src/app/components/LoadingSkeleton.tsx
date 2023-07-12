const LoadingSkeleton = () => {
	return (
		<div className="animate-pulse flex flex-col items-center justify-center w-full py-8 px-6">
			<div className="w-full p-6 border border-white rounded">
				<div className="flex flex-col h-48 gap-2 bg-gray-800 p-4 rounded border border-white">
					{/* <div className="h-6 bg-gray-500 rounded w-1/4"></div>
					<div className="h-4 bg-gray-500 rounded w-1/2"></div>
					<div className="h-4 bg-gray-500 rounded w-1/3"></div>
					<div className="h-4 bg-gray-500 rounded w-1/2"></div> */}
				</div>
			</div>
		</div>
	);
}

export default LoadingSkeleton;