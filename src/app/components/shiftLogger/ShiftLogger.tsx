"use client"
import React, { useMemo, useState, useEffect } from 'react';
import { useReactTable } from '@tanstack/react-table';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

type Shift = {
    workerName: string;
    startTime: string;
    endTime: string;
    taskPerformed: string;
};

function ShiftLogger() {
    const [data, setData] = useState<Shift[]>([]);

    useEffect(() => {
        (async () => {
            const result = await axios('https://your-api-url/shifts');
            setData(result.data);
        })();
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: 'Worker Name',
                accessor: 'workerName',
            },
            {
                Header: 'Start Time',
                accessor: 'startTime',
            },
            {
                Header: 'End Time',
                accessor: 'endTime',
            },
            {
                Header: 'Task Performed',
                accessor: 'taskPerformed',
            },
        ],
        []
    );

    return (
        <div className="App">
            <Table columns={columns} data={data} />
        </div>
    );
}

function Table({ columns, data }: { columns: any; data: Shift[] }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useReactTable({ columns, data });

    return (
        <table {...getTableProps()} className="table-auto w-full">
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()} className="px-4 py-2">{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td {...cell.getCellProps()} className="border px-4 py-2">{cell.render('Cell')}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default ShiftLogger;
