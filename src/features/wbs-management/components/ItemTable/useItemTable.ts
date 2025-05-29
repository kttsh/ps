// features/wbs-management/components/ItemTable/useItemTable.ts
// ItemTableの状態管理とロジックを担当するカスタムフック

import { useState, useMemo } from 'react';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
} from '@tanstack/react-table';
import type { Item, ItemColumn } from '../../types/item';

/**
 * ItemTableのカスタムフック
 * 
 * このフックは以下の機能を提供します：
 * - テーブルの状態管理（フィルター、ソート）
 * - カラム定義の生成
 * - TanStack Tableインスタンスの作成と管理
 * 
 * @param data - 表示するアイテムデータの配列
 * @param onDataChange - (オプション) データ変更時に呼び出されるコールバック関数
 */
export const useItemTable = (data: Item[], onDataChange?: (updatedData: Item[]) => void) => {
    // フィルター状態の管理
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    // ソート状態の管理
    const [sorting, setSorting] = useState<SortingState>([]);

    /**
     * カラム定義
     * 各カラムの設定とカスタマイズを定義
     */
    const columnDefs: ItemColumn[] = [
        {
            id: 'jobNo',
            header: 'Job No',
            accessorKey: 'jobNo',
            size: 100,
            minSize: 80,
            maxSize: 120,
        },
        {
            id: 'fg',
            header: 'Function/Group',
            accessorKey: 'fg',
            size: 120,
            minSize: 100,
            maxSize: 150,
        },
        {
            id: 'coreItemNo',
            header: 'Core Item No.',
            accessorKey: 'coreItemNo',
            size: 150,
            minSize: 120,
            maxSize: 200,
        },
        {
            id: 'itemNo',
            header: 'Item No.',
            accessorKey: 'itemNo',
            size: 150,
            minSize: 120,
            maxSize: 200,
        },
        {
            id: 'itemName',
            header: 'Item Name',
            accessorKey: 'itemName',
            size: 200,
            minSize: 150,
            maxSize: 300,
        },
        {
            id: 'qty',
            header: 'Qty',
            accessorKey: 'qty',
            size: 80,
            minSize: 60,
            maxSize: 100,
        },
        {
            id: 'costElement',
            header: 'Cost Element',
            accessorKey: 'costElement',
            size: 120,
            minSize: 100,
            maxSize: 150,
        },
        {
            id: 'ibsCode',
            header: 'IBS Code',
            accessorKey: 'ibsCode',
            size: 100,
            minSize: 80,
            maxSize: 120,
        },
    ];

    /**
     * TanStack Tableのカラム定義を生成
     * フィルター機能を含む完全なカラム定義
     */
    const columns = useMemo<ColumnDef<Item>[]>(
        () =>
            columnDefs.map((col) => ({
                id: col.id,
                header: col.header,
                accessorKey: col.accessorKey,
                size: col.size,
                minSize: col.minSize,
                maxSize: col.maxSize,
                filterFn: 'includesString',
                // 各カラムのフィルター入力を有効化
                enableColumnFilter: true,
                // ソート機能を有効化
                enableSorting: true,
                // セルのレンダリング（型安全性の向上）
                cell: ({ getValue }) => {
                    const value = getValue();
                    // 各カラムタイプに応じた適切な表示処理
                    if (col.id === 'qty' && typeof value === 'number') {
                        return value;
                    }
                    if (value === null || value === undefined) {
                        return '';
                    }
                    return String(value);
                },
            })),
        []
    );

    /**
     * TanStack Tableインスタンスの作成
     * フィルタリングとソート機能を統合
     * 仮想スクロールは@tanstack/react-virtualで別途実装
     */
    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
            sorting,
        },
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // デバッグ情報の出力（開発時のみ）
        debugTable: process.env.NODE_ENV === 'development',
        // テーブルのメタデータを介して onDataChange を渡す
        meta: {
            onDataChange,
        },
    });

    return {
        table,
        columnDefs,
        columnFilters,
        sorting,
    };
};