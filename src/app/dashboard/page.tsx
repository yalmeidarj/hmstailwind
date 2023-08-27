import BasicTable from '../components/BasicTable'
// import { createColumnHelper } from '@tanstack/react-table'
import db from '../../lib/utils/db'
import { location, house, worker, shiftLogger, street } from '../../../drizzle/schema'
import { eq, and, lt, lte, gte, ne, desc, asc } from "drizzle-orm";
import { currentUser } from '@clerk/nextjs';


// import ExampleWithReactQueryProvider from '../components/SortingTable';
// import da from 'date-fns/locale/da';
// import { createColumnHelper } from '@tanstack/react-table';


async function getLocationsData() {
    // Use Prisma Client to get all locations from the database
    const locations = await db.select().from(location).execute();
    return locations;
}

async function getHousesData() {

    // Calculate start and end times for the current day
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Convert these dates to ISO format for comparison in the database query
    const startISO = startOfDay.toISOString();
    const endISO = endOfDay.toISOString();

    // const houses = await db.select().from(house).execute();
    const houses = await db.query.house.findMany({
        where:
            and(
                // eq(house.locationId, 97),
                // eq(house.lastUpdatedBy, 'Yuri Almeida'),
                gte(house.lastUpdated, startISO),  // Greater than or equal to start of the day
                lte(house.lastUpdated, endISO)     // Less than or equal to end of the day
            ),
        with: {
            street: true,
            location: true,
        },
    }).execute();

    // const jHouses = JSON.stringify(houses);

    const allShiftLoggerWithDatesAsStrings = houses.map(houses => ({
        ...houses,
        // streetName: street,
        // locationName: location.name,
        lastUpdated: houses.lastUpdated ? new Date(houses.lastUpdated).toISOString() : null,

    }));

    return allShiftLoggerWithDatesAsStrings;
}

async function getHousesDataFiltered() {
    // const houses = await db.select().from(house).execute();
    const houses = await db.query.house.findMany({
        with: {
            street: true
        },
    });
    const allShiftLoggerWithDatesAsStrings = houses.map(house => ({
        ...house,
        lastUpdated: house.lastUpdated ? new Date(house.lastUpdated).toISOString() : null,
    }));

    const totalHouses = allShiftLoggerWithDatesAsStrings.length;
    const visitedHouses = allShiftLoggerWithDatesAsStrings.filter(house => house.lastUpdated !== null).length;
    const consentFinalYes = allShiftLoggerWithDatesAsStrings.filter(house => house.statusAttempt === 'consent final yes').length;
    const consentFinalNo = allShiftLoggerWithDatesAsStrings.filter(house => house.statusAttempt === '2nd attempt').length;

    const nonExistent = allShiftLoggerWithDatesAsStrings.filter(house =>
        house.name === null &&
        house.locationId === null &&
        house.streetNumber === null &&
        house.lastName === null &&
        house.notes === null &&
        house.salesForceNotes === null &&
        house.email === null &&
        house.phone === null &&
        house.type === null &&
        house.streetId === null &&
        house.lastUpdatedBy === null &&
        house.statusAttempt === null &&
        house.consent === null
    ).length;

    return {
        allShiftLoggerWithDatesAsStrings,
        totalHouses,
        visitedHouses,
        consentFinalYes,
        consentFinalNo,
        nonExistent
    };
}


async function getWorkersData() {
    const workers = await db.select().from(worker).execute();
    return workers;
}


async function getShiftLoggerData() {
    const shiftLoggers = await db.select().from(shiftLogger).where(eq(shiftLogger.isActive, true)).execute();
    const allShiftLoggerWithDatesAsStrings = shiftLoggers.map(shiftLogger => ({
        ...shiftLogger,
        startingDate: shiftLogger.startingDate ? new Date(shiftLogger.startingDate).toISOString() : null,
        finishedDate: shiftLogger.finishedDate ? new Date(shiftLogger.finishedDate).toISOString() : null,
    }));

    const shiftLoggersWithWorkersAndLocations = await Promise.all(allShiftLoggerWithDatesAsStrings.map(async (logger) => {
        const workers = await db.select().from(worker).where(eq(worker.id, logger.workerId)).execute();
        const locations = await db.select().from(location).where(eq(location.id, logger.locationId)).execute();
        return {
            ...logger,
            worker: workers[0], // assuming workerId is unique and fetches only one worker
            location: locations[0], // assuming locationId is unique and fetches only one location
        };
    }));

    return shiftLoggersWithWorkersAndLocations;
}

async function getShiftLoggerPastData(workerId: any) {
    const shiftLoggers = await db.select().from(shiftLogger)
        .where(and(eq(shiftLogger.isActive, false), eq(shiftLogger.workerId, workerId)))
        .orderBy(desc(shiftLogger.startingDate))
        .execute();

    const allShiftLoggerWithDatesAsStrings = shiftLoggers.map(shiftLogger => ({
        ...shiftLogger,
        startingDate: shiftLogger.startingDate ? new Date(shiftLogger.startingDate).toISOString() : null,
        finishedDate: shiftLogger.finishedDate ? new Date(shiftLogger.finishedDate).toISOString() : null,
    }));

    const shiftLoggersWithWorkersAndLocations = await Promise.all(allShiftLoggerWithDatesAsStrings.map(async (logger) => {
        const workers = await db.select().from(worker).where(eq(worker.id, logger.workerId)).execute();
        const locations = await db.select().from(location).where(eq(location.id, logger.locationId)).execute();
        return {
            ...logger,
            worker: workers[0], // assuming workerId is unique and fetches only one worker
            location: locations[0], // assuming locationId is unique and fetches only one location
        };
    }));

    return shiftLoggersWithWorkersAndLocations;
}

// Define your row shape
type House = {
    streetNumber: string
    lastUpdatedBy: string
    lastUpdated: string
    statusAttempt: string
    type: string
}



export default async function page() {

    // const columnHelper = createColumnHelper<House>()
    // const housesColumns = [
    //     columnHelper.display({
    //         // Display Column
    //         id: 'actions',
    //         cell: props => { props.row },
    //     }),
    //     // Grouping Column
    //     columnHelper.group({
    //         header: 'Address Info',
    //         footer: props => props.column.id,
    //         columns: [
    //             // Accessor Column
    //             columnHelper.accessor('streetNumber', {
    //                 header: () => 'Street Number',
    //                 footer: props => props.column.id,
    //             }),
    //         ],
    //     }),
    //     // Grouping Column
    //     columnHelper.group({
    //         header: 'Update Info',
    //         footer: props => props.column.id,
    //         columns: [
    //             // Accessor Column
    //             columnHelper.accessor('lastUpdatedBy', {
    //                 header: 'Last Updated By',
    //                 footer: props => props.column.id,
    //             }),
    //             // Accessor Column
    //             columnHelper.accessor('lastUpdated', {
    //                 header: 'Last Updated On',
    //                 footer: props => props.column.id,
    //             }),
    //         ],
    //     }),
    //     // Grouping Column
    //     columnHelper.group({
    //         header: 'House Details',
    //         footer: props => props.column.id,
    //         columns: [
    //             // Accessor Column
    //             columnHelper.accessor('statusAttempt', {
    //                 header: 'Status Attempt',
    //                 footer: props => props.column.id,
    //             }),
    //             // Accessor Column
    //             columnHelper.accessor('type', {
    //                 header: 'Type',
    //                 footer: props => props.column.id,
    //             }),
    //         ],
    //     }),
    // ]
    const housesColumns = [
        {
            header: 'Street Number',
            accessorKey: 'streetNumber',
            footer: 'Street Number',
        },

        {
            header: 'Last Updated By',
            accessorKey: 'lastUpdatedBy',
            footer: 'Last Updated By',
        },
        {
            header: 'Location',
            accessorKey: 'location.name',
            // accessorKey: 'locationName',
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
        }
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
        {
            header: 'Worker',
            accessorKey: 'workerId',
            footer: 'Worker',
        },
        {
            header: 'Agent name',
            accessorKey: 'worker.name',
            footer: 'Agent name',
        },
        {
            header: 'Location',
            accessorKey: 'location.name',
            footer: 'Location',
        },
        {
            header: 'Pace',
            accessorKey: 'pace',
            footer: 'End Time',
        },
        {
            header: 'Start Time',
            accessorKey: 'startingDate',
            footer: 'Start Time',
        },
        {
            header: 'Final Pace',
            accessorKey: 'paceFinal',
            footer: 'End Time',
        },
        // {
        //     header: 'End Time',
        //     accessorKey: 'finishedDate',
        //     footer: 'End Time',
        // },
        // {
        //     header: 'Task Performed',
        //     accessorKey: 'updatedHouses',
        //     footer: 'Task Performed',
        // },
    ]

    const LocationColumns = [
        {
            header: 'totalHouses',
            accessorKey: 'workerId',
            footer: 'Worker',
        },
        {
            header: 'visitedHouses',
            accessorKey: 'worker.name',
            footer: 'Agent name',
        },
        {
            header: 'consentFinalYes',
            accessorKey: 'location.name',
            footer: 'Location',
        },
        {
            header: 'consentFinalNo',
            accessorKey: 'pace',
            footer: 'End Time',
        },
        {
            header: 'nonExistent',
            accessorKey: 'pace',
            footer: 'End Time',
        }
    ]

    // const dataLocations = await getLocationsData();
    // const dataWorkers = await getWorkersData();
    // const filteredData = await getHousesDataFiltered();
    const user = await currentUser();
    const id = user?.unsafeMetadata.id as number;
    const dataHouses = await getHousesData();
    const dataShiftLogger = await getShiftLoggerData();
    const dataShiftLoggerPast = await getShiftLoggerPastData(id);

    return (
        <div className="container mx-auto py-8 px-4">

            {/* No need for a table with active shifts, as it is already displayed in ShiftInfoCard
             <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Active Shifts</h1>
                <BasicTable data={dataShiftLogger} columns={ShiftLoggerColumns} />
            </div> */}

            <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Past Shifts</h1>
                <BasicTable data={dataShiftLoggerPast} columns={ShiftLoggerColumns} />
            </div>
            <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Houses</h1>
                <BasicTable data={dataHouses} columns={housesColumns} />
            </div>
            {/* <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Locations</h1>
                <BasicTable data={dataLocations} columns={locationsColumns} />
            </div>
            <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Agents</h1>
                <BasicTable data={dataWorkers} columns={workerColumns} />
            </div>
            <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Location Report</h1>
                <BasicTable data={dataWorkers} columns={workerColumns} />
            </div>
            <ExampleWithReactQueryProvider /> */}
        </div>
    )
}


