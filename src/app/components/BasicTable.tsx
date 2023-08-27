"use client"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { CSVLink, CSVDownload } from "react-csv";


interface BasicTableProps {
    data: Array<any>; // Replace 'any' with the appropriate type for your data
    columns: Array<any>; // Replace 'any' with the appropriate type for your columns
}

import { useState } from 'react'

export default function BasicTable({ data,
    columns,

}: BasicTableProps) {

    const [sorting, setSorting] = useState([])
    const [filtering, setFiltering] = useState('')


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filtering,
        },
        // onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
    })

    return (
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <CSVLink className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" data={data}>
                Download me!
            </CSVLink>
            {/* <CSVDownload data={data} target="_blank" /> */}
            <input
                type='text'
                value={filtering}
                onChange={e => setFiltering(e.target.value)}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4'
            />
            <div className="mb-4 overflow-x-auto">
                <table className=' divide-y md:table-fixed divide-gray-200'>
                    <thead className='bg-gray-200'>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className='flex items-center'>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200 text-gray-700'>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className='hover:bg-gray-100'>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-row sm:flex-col items-center justify-between my-4">
                <div className="mb-2 sm:mb-0">
                    <button
                        onClick={() => table.setPageIndex(0)}
                        className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        disabled={!table.getCanPreviousPage()}
                    >
                        First
                    </button>
                </div>
                <div className="space-x-0 sm:space-x-2 space-y-2 sm:space-y-0">
                    <button
                        onClick={() => table.previousPage()}
                        className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        disabled={!table.getCanPreviousPage()}
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                    <button
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        disabled={!table.getCanNextPage()}
                    >
                        Last
                    </button>
                </div>
            </div>

        </div>
    )
}