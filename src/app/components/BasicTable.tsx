"use client"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'

interface BasicTableProps {
    data: Array<any>; // Replace 'any' with the appropriate type for your data
    columns: Array<any>; // Replace 'any' with the appropriate type for your columns
}

import { useState } from 'react'

export default function BasicTable({ data, columns }: BasicTableProps) {

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
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
    })

    return (
        <div className='container mx-auto px-4'>
            <input
                type='text'
                value={filtering}
                onChange={e => setFiltering(e.target.value)}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            <table className='table-auto w-full mt-4'>
                <thead className='bg-gray-200'>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className='px-4 py-2'
                                >
                                    {header.isPlaceholder ? null : (
                                        <div className='flex items-center'>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {
                                                { asc: '🔼', desc: '🔽' }[header.column.getIsSorted() ?? undefined]
                                            }
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>


                <tbody className='text-gray-700'>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className='border-t border-gray-200 hover:bg-gray-100'>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className='px-4 py-2'>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex mt-4'>
                <button onClick={() => table.setPageIndex(0)} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2'>First page</button>
                <button
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                    className={`px-4 py-2 rounded ${table.getCanPreviousPage() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'} mr-2`}
                >
                    Previous page
                </button>
                <button
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}
                    className={`px-4 py-2 rounded ${table.getCanNextPage() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'} mr-2`}
                >
                    Next page
                </button>
                <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>Last page</button>
            </div>
        </div>
    )
}