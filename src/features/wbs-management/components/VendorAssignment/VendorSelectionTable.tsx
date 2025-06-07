import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Apple, ArrowRight, Building2, Search, Users } from "lucide-react";
import type React from "react";
import { useCallback, useMemo } from "react";

import { useVendorSelection } from "../../hooks/useVendorSelection";
import type { Vendor } from "../../types/vendor";
import IndeterminateCheckbox from "./IndeterminateCheckbox";

interface VendorSelectionTableProps {
	/** ベンダー一覧 */
	vendors: Vendor[];
	/** 選択されたベンダーIDのリスト */
	selectedVendorIds: number[];
	/** ベンダー選択状態変更時のコールバック */
	onSelectionChange: (selectedIds: number[]) => void;
	/** 全YIPへの一括割り当て処理 */
	onAssignToAllYip: (selectedVendors: Vendor[]) => void;
	/** 割り当て処理中フラグ */
	isAssigning: boolean;
}

/**
 * ベンダー選択テーブルコンポーネント
 * 未割り当てベンダーの表示・選択・一括割り当て機能を提供
 */
const VendorSelectionTable: React.FC<VendorSelectionTableProps> = ({
	vendors,
	selectedVendorIds,
	onSelectionChange,
	onAssignToAllYip,
	isAssigning,
}) => {
	// カスタムフックを使用して選択状態を管理
	const {
		globalFilter,
		setGlobalFilter,
		rowSelection,
		handleRowSelectionChange,
	} = useVendorSelection(vendors, selectedVendorIds, onSelectionChange);

	// 全YIPへの割り当てボタンクリック時の処理
	const handleAssignToAll = useCallback(() => {
		const selectedVendors = vendors.filter((vendor) =>
			selectedVendorIds.includes(vendor.id),
		);
		onAssignToAllYip(selectedVendors);
	}, [vendors, selectedVendorIds, onAssignToAllYip]);

	// テーブルカラム定義
	const columns = useMemo<ColumnDef<Vendor>[]>(
		() => [
			{
				id: "select",
				size: 50,
				header: ({ table }) => (
					<div className="flex items-center justify-center">
						<IndeterminateCheckbox
							checked={table.getIsAllPageRowsSelected()}
							indeterminate={table.getIsSomePageRowsSelected()}
							onChange={(value: boolean) =>
								table.toggleAllPageRowsSelected(value)
							}
						/>
					</div>
				),
				cell: ({ row }) => (
					<div className="flex items-center justify-center">
						<IndeterminateCheckbox
							checked={row.getIsSelected()}
							onChange={(value: boolean) => row.toggleSelected(value)}
						/>
					</div>
				),
				enableSorting: false,
				enableHiding: false,
			},
			{
				accessorKey: "name",
				header: "ベンダー名",
				cell: ({ row }) => (
					<div className="flex items-center gap-3">
						<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
							<Building2 size={14} className="text-white" />
						</div>
						<div>
							<div className="font-medium text-gray-900 text-sm">
								{row.original.name}
							</div>
							<div className="text-xs text-gray-500 font-mono">
								{row.original.code}
							</div>
						</div>
					</div>
				),
			},
			{
				accessorKey: "vendorNumber",
				header: "ベンダー番号",
				size: 120,
				cell: ({ row }) => (
					<span className="text-gray-700 text-sm font-mono">
						{row.original.vendorNumber}
					</span>
				),
			},
		],
		[],
	);

	// React Tableの設定
	const table = useReactTable({
		data: vendors,
		columns,
		state: {
			rowSelection,
			globalFilter,
		},
		enableRowSelection: true,
		onRowSelectionChange: handleRowSelectionChange,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		globalFilterFn: "includesString",
	});

	const selectedCount = selectedVendorIds.length;

	return (
		<div className="h-full flex flex-col">
			{/* ヘッダー部分 */}
			<div className="mb-4">
				<h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
					<Users size={20} />
					未割り当てベンダー
				</h2>
				<div className="relative">
					<Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
					<Input
						placeholder="ベンダー名・番号で検索..."
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						className="pl-10 text-sm"
					/>
				</div>
			</div>

			{/* テーブル部分 */}
			<div className="flex-1 rounded-lg border border-gray-200 overflow-hidden">
				<table className="w-full">
					<thead className="bg-gray-50">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
										style={{ width: header.getSize() }}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody className="bg-white divide-y divide-gray-100">
						{table.getRowModel().rows.map((row) => {
							const handleRowInteraction = () => row.toggleSelected();

							return (
								<tr
									key={row.id}
									className={`hover:bg-gray-50 transition-colors ${
										row.getIsSelected() ? "bg-blue-50" : ""
									}`}
								>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-4 py-3">
											{/* チェックボックス以外のセルをクリック可能にする */}
											{cell.column.id === "select" ? (
												flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)
											) : (
												<button
													type="button"
													onClick={handleRowInteraction}
													className="w-full text-left p-0 bg-transparent border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded"
													aria-label={`ベンダー ${row.original.name} を${
														row.getIsSelected() ? "選択解除" : "選択"
													}する`}
													aria-pressed={row.getIsSelected()}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</button>
											)}
										</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* フッター部分 - 全YIP割り当てボタン */}
			<div className="mt-4 flex items-center justify-between">
				<div className="text-sm text-gray-600">
					{selectedCount > 0 ? (
						<div className="flex items-center gap-2">
							<span>{selectedCount}件選択中</span>
							<Badge
								variant="outline"
								className="bg-amber-50 text-amber-700 border-amber-200"
							>
								全YIPに一括割り当て
							</Badge>
						</div>
					) : (
						`${vendors.length}件のベンダー`
					)}
				</div>
				<Button
					onClick={handleAssignToAll}
					disabled={selectedCount === 0 || isAssigning}
					className="flex items-center gap-2"
					size="default"
				>
					<Apple size={16} />
					{isAssigning
						? "割り当て中..."
						: `全YIPに割り当て (${selectedCount}件)`}
					<ArrowRight size={16} />
				</Button>
			</div>
		</div>
	);
};

export default VendorSelectionTable;
