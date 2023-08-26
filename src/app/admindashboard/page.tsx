import FileUpload from "../components/FileUpload";

interface SimpleFormProps {
	params: {
		id: number,
		streetId: number,
		name: string,
		lastName: string,
		statusAttempt: string,
		consent: string,
		email: string;
		phone: string;
		notes: string,
		salesForceNotes: string;
		type: string,
		streetNumber: number,
	}
}

// Define your form input interface
interface MyIFormInput {
	id: number;
	type: string;
	lastName: string;
	name: string;
	statusAttempt: string;
	consent: string,
	email: string;
	phone: string;
	notes: string;
	salesForceNotes: string;
	isActive: boolean;
	lastUpdated: Date;
	lastUpdatedBy: string;
}

export default async function page() {
	// const { handleSubmit, control, formState: { errors } } = useForm<MyIFormInput>();

	// const onSubmit: SubmitHandler<MyIFormInput> = async (data: MyIFormInput) => {
	// 	data.lastUpdatedBy = user.fullName || "Unknown";
	// 	data.lastUpdated = DateTime.now().toJSDate();
	// 	data.name = name;
	// 	data.lastName = lastName;
	// 	data.statusAttempt = statusAttempt;
	// 	data.consent = consent;
	// 	data.email = email;
	// 	data.phone = phone;
	// 	data.type = type;
	// 	data.notes = notes;
	// 	data.salesForceNotes = salesForceNotes;
	// 	const shiftLoggerId = user?.unsafeMetadata.shiftLoggerId as number;

	// 	try {
	// 		const response = await fetch(`https://hmsapi.herokuapp.com/houses/${houseId}`, {
	// 			method: 'PUT',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify(data),
	// 		});
	// 		if (!response.ok) {
	// 			console.log(response);
	// 			throw new Error('Network response was not ok');
	// 		}

	// 		const streetData = {
	// 			lastVisited: DateTime.now().toJSDate(),
	// 			lastVisitedby: user?.fullName
	// 		}
	// 		console.log(streetData);

	// 		const streetResponse = await fetch(`https://hmsapi.herokuapp.com/streetsLastVisit/${streetId}`, {
	// 			method: 'PUT',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify(streetData),
	// 		});
	// 		if (!streetResponse.ok) {
	// 			throw new Error('Network response was not ok');
	// 		}

	// 		const updatedhousesFinalData = {
	// 			updatedHousesFinal: 1,

	// 		}


	// 		// Conditionally fetch updatedhousesfinal or shift based on statusAttempt
	// 		let endpoint = `https://hmsapi.herokuapp.com/updatedhousesfinal/${shiftLoggerId}`;
	// 		let bodyData: { updatedHousesFinal?: number, updatedHouses?: number };

	// 		if (statusAttempt !== "consent final yes" && statusAttempt !== "consent final no") {
	// 			endpoint = `https://hmsapi.herokuapp.com/updatedhouses/${shiftLoggerId}`;
	// 			bodyData = { updatedHouses: 1 };
	// 		} else {
	// 			bodyData = { updatedHousesFinal: 1 };
	// 		}

	// 		const finalFetch = await fetch(endpoint, {
	// 			method: 'PUT',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify(bodyData),
	// 		});
	// 		if (!finalFetch.ok) throw new Error('Network response was not ok');

	// 	} catch (error) {
	// 		console.error(error);
	// 	}

	// 	router.push(`/locations/streets/${streetId}`)
	// };


	return (
		<div className="container mx-auto py-8 px-4">
			<h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Main Dashboard</h1>

			<div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-lg">
				<h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Past Shifts</h1>

				<form >
					<FileUpload />
					<h1 className="flex flex-col mb-4">
						form
					</h1>
				</form>

			</div>
		</div>
	)
}