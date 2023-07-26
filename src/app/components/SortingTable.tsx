"use client"

import React, { useMemo, useState } from 'react';
import {
	MaterialReactTable,
	type MRT_ColumnDef,
	type MRT_ColumnFiltersState,
	type MRT_PaginationState,
	type MRT_SortingState,
} from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from '@tanstack/react-query';

type ShiftLoggerApiResponse = {
	data: Array<ShiftLogger>;
	meta: {
		totalRowCount: number;
	};
};

type ShiftLogger = {
	ShiftLoggerId: number;
	workerId: number;
	locationId: number;
	startingDate: string;
	finishedDate: string;
	updatedHouses: number | null;
	updatedHousesFinal: number | null;
	pace: number | null;
	paceFinal: number | null;
	userProviderUserId: number | null;
	isActive: boolean;
};

const Example = () => {
	const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
		[],
	);
	const [globalFilter, setGlobalFilter] = useState('');
	const [sorting, setSorting] = useState<MRT_SortingState>([]);
	const [pagination, setPagination] = useState<MRT_PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const { data, isError, isFetching, isLoading, refetch } =
		useQuery<ShiftLoggerApiResponse>({
			queryKey: [
				'table-data',
				columnFilters, //refetch when columnFilters changes
				globalFilter, //refetch when globalFilter changes
				pagination.pageIndex, //refetch when pagination.pageIndex changes
				pagination.pageSize, //refetch when pagination.pageSize changes
				sorting, //refetch when sorting changes
			],
			queryFn: async () => {
				const fetchURL = new URL(
					'https://hmsapi.herokuapp.com/shiftLogger',
				);
				fetchURL.searchParams.set(
					'start',
					`${pagination.pageIndex * pagination.pageSize}`,
				);
				fetchURL.searchParams.set('size', `${pagination.pageSize}`);
				fetchURL.searchParams.set(
					'filters',
					JSON.stringify(columnFilters ?? []),
				);
				fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
				fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

				const response = await fetch(fetchURL.href);
				const json = (await response.json()) as ShiftLoggerApiResponse;
				return json;
			},
			keepPreviousData: true,
		});



	const columns = useMemo<MRT_ColumnDef<ShiftLogger>[]>(
		() => [
			{
				accessorKey: 'ShiftLoggerId',
				header: 'Shift Logger ID',
			},
			{
				accessorKey: 'workerId',
				header: 'Worker ID',
			},
			{
				accessorKey: 'locationId',
				header: 'Location ID',
			},
			{
				accessorKey: 'startingDate',
				header: 'Starting Date',
			},
			{
				accessorKey: 'finishedDate',
				header: 'Finished Date',
			},
			{
				accessorKey: 'updatedHouses',
				header: 'Updated Houses',
			},
			{
				accessorKey: 'updatedHousesFinal',
				header: 'Updated Houses Final',
			},
			{
				accessorKey: 'pace',
				header: 'Pace',
			},
			{
				accessorKey: 'paceFinal',
				header: 'Pace Final',
			},
			{
				accessorKey: 'userProviderUserId',
				header: 'User Provider User ID',
			},
			{
				accessorKey: 'isActive',
				header: 'Is Active',
			},
		],
		[],
	);



	return (
		<MaterialReactTable
			columns={columns}
			data={data?.data ?? []} //data is undefined on first render
			initialState={{ showColumnFilters: true }}
			manualFiltering
			manualPagination
			manualSorting
			muiToolbarAlertBannerProps={
				isError
					? {
						color: 'error',
						children: 'Error loading data',
					}
					: undefined
			}
			onColumnFiltersChange={setColumnFilters}
			onGlobalFilterChange={setGlobalFilter}
			onPaginationChange={setPagination}
			onSortingChange={setSorting}
			renderTopToolbarCustomActions={() => (
				<Tooltip arrow title="Refresh Data">
					<IconButton onClick={() => refetch()}>
						<RefreshIcon />
					</IconButton>
				</Tooltip>
			)}
			rowCount={data?.meta?.totalRowCount ?? 0}
			state={{
				columnFilters,
				globalFilter,
				isLoading,
				pagination,
				showAlertBanner: isError,
				showProgressBars: isFetching,
				sorting,
			}}
		/>
	);
};

const queryClient = new QueryClient();

const ExampleWithReactQueryProvider = () => (
	<QueryClientProvider client={queryClient}>
		<Example />
	</QueryClientProvider>
);

export default ExampleWithReactQueryProvider;