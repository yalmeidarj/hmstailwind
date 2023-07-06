import BasicTable from '../components/BasicTable'
import db from '../../lib/utils/db'
import { location, house, worker, shiftLogger } from '../../../drizzle/schema'




async function getLocationsData() {
    // Use Prisma Client to get all locations from the database
    const locations = await db.select().from(location);
    return locations;
}

async function getHousesData() {
    const houses = await db.select().from(house);
    const allShiftLoggerWithDatesAsStrings = houses.map(houses => ({
        ...houses,
        lastUpdated: houses.lastUpdated ? new Date(houses.lastUpdated).toISOString() : null,
        // finishedDate: houses.finishedDate ? new Date(houses.finishedDate).toISOString() : null,
    }));

    return allShiftLoggerWithDatesAsStrings;
}

async function getWorkersData() {
    const workers = await db.select().from(worker);
    return workers;
}

async function getShiftLoggerData() {
    const allShiftLogger = await db.select().from(shiftLogger);
    // const allShiftLoggerWithDatesAsStrings = allShiftLogger.map(shiftLogger => ({
    //     ...shiftLogger,
    //     startingDate: shiftLogger.startingDate ? new Date(shiftLogger.startingDate).toISOString() : null,
    //     finishedDate: shiftLogger.finishedDate ? new Date(shiftLogger.finishedDate).toISOString() : null,
    // }));

    return allShiftLogger;
    // return allShiftLoggerWithDatesAsStrings;
}





export default async function page() {
    // const response = await fetch('https://hmsapi.herokuapp.com/houses')
    // const data = await response.json()
    // const responseLocations = await fetch('https://hmsapi.herokuapp.com/locations')
    // const dataLocations = await responseLocations.json()
    // const responseWorkers = await fetch('https://hmsapi.herokuapp.com/workers')
    // const dataWorkers = await responseWorkers.json()
    // const responseShiftLogger = await fetch('https://hmsapi.herokuapp.com/shiftLogger')
    // const dataShiftLogger = await responseShiftLogger.json()

    // a function that returns the date and time in the format of "2021-09-28T15:00:00.000Z"

    const housesColumns = [
        {
            header: 'Street Number',
            accessorKey: 'streetNumber',
            footer: 'Street Number',
        },
        {
            header: 'Street',
            accessorKey: 'Street.name',
            footer: 'Street',
        },
        {
            header: 'Last Updated By',
            accessorKey: 'lastUpdatedBy',
            footer: 'Last Updated By',
        },
        {
            header: 'Location',
            accessorKey: 'Location.name',
            footer: 'Location',
        },
        // {
        //     accessorFn: row => row.lastName,
        //     header: () => <span>Last Name</span>,
        // },

        {
            header: 'Last Updated',
            accessorKey: 'lastUpdated',
            footer: 'Last Updated',
        },
        //     cell: info => DateTime.fromISO(RowSelection.
        //     // cell: info => DateTime.fromISO(info.getValue('lastUpdated')).toLocaleString(DateTime.DATETIME_MED),
        // },
        {
            header: 'Status Attempt',
            accessorKey: 'statusAttempt',
            footer: 'Status Attempt',
        },
        {
            header: 'Type',
            accessorKey: 'type',
            footer: 'Type',
        },

    ]

    const locationsColumns = [
        {
            header: 'ID',
            accessorKey: 'id',
            footer: 'ID',
        },
        {
            header: 'Name',
            accessorKey: 'name',
            footer: 'Name',
        },
        {
            header: 'Neighborhood',
            accessorKey: 'neighborhood',
            footer: 'Neighborhood',
        },
        {
            header: 'Priority',
            accessorKey: 'priorityStatus',
            footer: 'Priority',
        },
    ]

    const workerColumns = [
        {
            header: 'ID',
            accessorKey: 'id',
            footer: 'ID',
        },
        {
            header: 'First Name',
            accessorKey: 'name',
            footer: 'First Name',
        },
        {
            header: 'User Name',
            accessorKey: 'userName',
            footer: 'User Name',
        },
        {
            header: 'Email',
            accessorKey: 'email',
            footer: 'Email',
        }
    ]

    const ShiftLoggerColumns = [
        // {
        //     header: 'Worker',
        //     accessorKey: 'workerId',
        //     footer: 'Worker',
        // },
        {
            header: 'Agent name',
            accessorKey: 'Worker.name',
            footer: 'Agent name',
        },
        {
            header: 'Location',
            accessorKey: 'Location.name',
            footer: 'Location',
        },
        {
            header: 'Pace',
            accessorKey: 'pace',
            footer: 'End Time',
        },
        {
            header: 'Final Pace',
            accessorKey: 'paceFinal',
            footer: 'End Time',
        },
        // {
        //     header: 'Start Time',
        //     accessorKey: 'startingDate',
        //     footer: 'Start Time',
        // },
        // {
        //     header: 'End Time',
        //     accessorKey: 'finishedDate',
        //     footer: 'End Time',
        // },
        {
            header: 'Task Performed',
            accessorKey: 'updatedHouses',
            footer: 'Task Performed',
        },
    ]

    const dataLocations = await getLocationsData();
    const dataHouses = await getHousesData();
    const dataWorkers = await getWorkersData();
    const dataShiftLogger = await getShiftLoggerData();


    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Houses</h1>
                <BasicTable data={dataHouses} columns={housesColumns} />
            </div>
            <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Locations</h1>
                <BasicTable data={dataLocations} columns={locationsColumns} />
            </div>
            <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Agents</h1>
                <BasicTable data={dataWorkers} columns={workerColumns} />
            </div>
            <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Shifts</h1>
                <BasicTable data={dataShiftLogger} columns={ShiftLoggerColumns} />
            </div>
            <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Update Location Priority</h1>
            </div>
        </div>

    )
}

// export default App
