import React from 'react';

const SiteLoadingSkeleton: React.FC = () => {
	return (
		<div className="block min-w-[298px]">
			<li className=" p-4 flex flex-col justify-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-md shadow-md">
				<div className="block">
					<div className="animate-pulse">
						<div className="h-4 bg-gray-400 rounded w-3/4"></div> {/* Placeholder for Priority */}
						<div className="h-4 mt-2 bg-gray-400 rounded w-1/2"></div> {/* Placeholder for location name */}
						<div className="h-4 mt-2 bg-gray-400 rounded w-3/4"></div> {/* Placeholder for location info */}
						<div className="h-4 mt-2 bg-gray-400 rounded w-1/2"></div> {/* Placeholder for worker info */}
					</div>
				</div>
			</li>
		</div>
	);
};

export default SiteLoadingSkeleton;
