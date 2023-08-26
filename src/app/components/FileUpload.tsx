// components/FileUpload.tsx
"use client"
import { useState } from 'react';

const FileUpload: React.FC = () => {
	const [file, setFile] = useState<File | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileList = event.target.files;

		if (fileList) {
			setFile(fileList[0]);
		}
	};

	const handleUpload = async () => {
		if (file) {
			// Here you can send the file to the backend to seed the database
			const formData = new FormData();
			formData.append('csv', file);

			try {
				// Replace '/api/upload' with your API endpoint
				const response = await fetch('/api/upload', {
					method: 'POST',
					body: formData,
				});

				const data = await response.json();
				console.log(data);

			} catch (error) {
				console.error('There was an error uploading the file:', error);
			}
		}
	};

	return (
		<div className="flex flex-col items-center">
			<input
				type="file"
				accept=".csv"
				onChange={handleFileChange}
				className="my-4"
			/>
			<button
				onClick={handleUpload}
				className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>
				Upload
			</button>
		</div>
	);
}

export default FileUpload;
