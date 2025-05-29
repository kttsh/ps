import React, { useMemo, useState } from 'react';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    type Table,
    type Row,
} from '@tanstack/react-table';
import type {
    ColumnDef,
    ColumnFiltersState,
    RowSelectionState,
    SortingState,
} from '@tanstack/react-table';
import type { Item } from '../../types/item';
import { IndeterminateCheckbox } from './IndeterminateCheckbox';
import type { Table as TableInstance } from '@tanstack/react-table';

export type BusinessColumn = {
    id: string;
    header: string;
    accessorKey: keyof Item;
    size?: number;
    minSize?: number;
    maxSize?: number;
};

const businessDefs: BusinessColumn[] = [
    { id: 'jobNo', header: 'Job No', accessorKey: 'jobNo', size: 90 },
    { id: 'fg', header: 'FG', accessorKey: 'fg', size: 50 },
    { id: 'coreItemNo', header: 'Core Item No', accessorKey: 'coreItemNo', size: 120 },
    { id: 'itemNo', header: 'Item No', accessorKey: 'itemNo', size: 120 },
    { id: 'itemName', header: 'Item Name', accessorKey: 'itemName', size: 200 },
    { id: 'qty', header: 'Qty', accessorKey: 'qty', size: 60 },
    { id: 'costElement', header: 'Cost Element', accessorKey: 'costElement', size: 110 },
    { id: 'ibsCode', header: 'IBS Code', accessorKey: 'ibsCode', size: 90 },
];

export interface UseItemTableReturn {
    table: TableInstance<Item>;
    columnDefs: BusinessColumn[];
    columnFilters: ColumnFiltersState;
    sorting: SortingState;
    rowSelection: RowSelectionState;
}

export const useItemTable = (data: Item[]): UseItemTableReturn => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const columns = useMemo<ColumnDef<Item>[]>(() => {
        const selectColumn: ColumnDef<Item> = {
            id: 'select',
            size: 36,
            enableSorting: false,
            enableColumnFilter: false,
            header: ({ table }: { table: Table<Item> }) => {
                return (
                    <IndeterminateCheckbox
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                );
            },
            cell: ({ row }: { row: Row<Item> }) => {
                return (
                    <IndeterminateCheckbox
                        checked={row.getIsSelected()}
                        indeterminate={row.getIsSomeSelected()}
                        onChange={row.getToggleSelectedHandler()}
                    />
                );
            },
        };

        const businessColumns = businessDefs.map((def) => ({
            id: def.id,
            accessorKey: def.accessorKey,
            header: def.header,
            size: def.size,
            meta: {
                minSize: def.minSize,
                maxSize: def.maxSize,
            },
        }));

        return [selectColumn, ...businessColumns];
    }, []);

    const table = useReactTable({
        data,
        columns,
        state: { columnFilters, sorting, rowSelection },
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: process.env.NODE_ENV === 'development',
    });

    return {
        table,
        columnDefs: businessDefs,
        columnFilters,
        sorting,
        rowSelection,
    };
}; 