import { IndeterminateCheckbox } from "@/components/ui/IndeterminateCheckbox";
import { Button } from "@/components/ui/button";
import {
	type TableRow,
	type YIPData,
} from "@/features/wbs-management/types/common";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight, FileText, Package, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type React from "react";
import { useMemo, useState } from "react";
import { YipTableFilters } from "./YipTableFilters";

/**
 * サンプルデータ
 * 実際の運用では外部APIまたはpropsから取得
 */
const sampleData: YIPData = {
	YIP: [
		{
			IsInitial: true,
			code: "ABC_123_123",
			Nickname: "scholarly writing utensils",
			items: [
				{
					itemNo: "01-21-A-1",
					CareItemNo: "01-21-A",
					itemName: "ball pen",
					Qty: 4,
					Himoku: "12A1",
					GBA: "A12",
				},
				{
					itemNo: "01-21-A-2",
					CareItemNo: "01-21-A",
					itemName: "keshigomu",
					Qty: 4,
					Himoku: "12A1",
					GBA: "A12",
				},
				{
					itemNo: "01-21-A-3",
					CareItemNo: "01-21-A",
					itemName: "文土器",
					Qty: 4,
					Himoku: "12A1",
					GBA: "A12",
				},
			],
		},
		{
			IsInitial: true,
			code: "ABC_123_456",
			Nickname: "scholarly tornoa utensils",
			items: [
				{
					itemNo: "01-21-A-1",
					CareItemNo: "01-21-A",
					itemName: "ball pen",
					Qty: 4,
					Himoku: "12A1",
					GBA: "A12",
				},
				{
					itemNo: "01-21-A-2",
					CareItemNo: "01-21-A",
					itemName: "keshigomu",
					Qty: 4,
					Himoku: "12A1",
					GBA: "A12",
				},
				{
					itemNo: "01-21-A-3",
					CareItemNo: "01-21-A",
					itemName: "文土器",
					Qty: 4,
					Himoku: "12A1",
					GBA: "A12",
				},
			],
		},
	],
};

/**
 * YIPアイテムテーブルコンポーネント
 * YIPとその配下アイテムを階層構造で表示・管理する
 */
const YipItemTable: React.FC = () => {
	// 選択されたYIPのIDセット（YIPのみ選択可能）
	const [selectedYips, setSelectedYips] = useState<Set<string>>(new Set());
	// 展開された行の状態管理
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
	// フィルタ表示状態
	const [showFilters, setShowFilters] = useState(true);

	/**
	 * データを平坦化してテーブル用の形式に変換
	 * YIPとアイテムを単一の配列に変換し、親子関係を維持
	 */
	const tableData = useMemo<TableRow[]>(() => {
		const rows: TableRow[] = [];

		sampleData.YIP.forEach((yip, yipIndex) => {
			// YIP行を追加
			const yipId = `yip-${yipIndex}`;
			rows.push({
				id: yipId,
				type: "yip",
				yip,
			});

			// YIP配下のアイテム行を追加（子行として）
			yip.items.forEach((item, itemIndex) => {
				const itemId = `item-${yipIndex}-${itemIndex}`;
				rows.push({
					id: itemId,
					type: "item",
					item,
					yipCode: yip.code,
					parentId: yipId,
				});
			});
		});

		return rows;
	}, []);

	const columnHelper = createColumnHelper<TableRow>();

	/**
	 * テーブルカラム定義
	 * チェックボックス、メインコンテンツ、アイテム詳細情報を含む
	 */
	const columns = useMemo(
		() => [
			// チェックボックス列 - YIPのみ選択可能
			columnHelper.display({
				id: "select",
				size: 50,
				header: ({ table }) => {
					const yipRows = table.getRowModel().rows.filter(row => row.original.type === "yip");
					const allYipsSelected = yipRows.length > 0 && yipRows.every(row => selectedYips.has(row.original.id));
					const someYipsSelected = yipRows.some(row => selectedYips.has(row.original.id));

					return (
						<IndeterminateCheckbox
							checked={allYipsSelected}
							indeterminate={someYipsSelected && !allYipsSelected}
							onChange={(checked) => {
								if (checked) {
									const yipIds = yipRows.map(row => row.original.id);
									setSelectedYips(new Set(yipIds));
								} else {
									setSelectedYips(new Set());
								}
							}}
							aria-label="全YIP選択"
						/>
					);
				},
				cell: ({ row }) => {
					const data = row.original;
					// YIP行のみチェックボックスを表示
					if (data.type === "yip") {
						return (
							<IndeterminateCheckbox
								checked={selectedYips.has(data.id)}
								onChange={(checked) => {
									const newSelected = new Set(selectedYips);
									if (checked) {
										newSelected.add(data.id);
									} else {
										newSelected.delete(data.id);
									}
									setSelectedYips(newSelected);
								}}
								aria-label={`YIPを選択: ${data.id}`}
							/>
						);
					}
					// アイテム行は空のセル
					return null;
				},
			}),

			// メイン列 - YIP/アイテムの階層表示と展開/折りたたみ機能
			columnHelper.accessor("type", {
				id: "main",
				header: "YIP / Items",
				size: 400,
				filterFn: (row, _, filterValue) => {
					if (!filterValue) return true;
					const data = row.original;
					if (data.type === "yip" && data.yip) {
						return data.yip.code.toLowerCase().includes(filterValue.toLowerCase()) ||
							   data.yip.Nickname.toLowerCase().includes(filterValue.toLowerCase());
					}
					if (data.type === "item" && data.item) {
						return data.item.itemNo.toLowerCase().includes(filterValue.toLowerCase()) ||
							   data.item.itemName.toLowerCase().includes(filterValue.toLowerCase());
					}
					return false;
				},
				cell: ({ row }) => {
					const data = row.original;

					// YIP行の表示 - 展開/折りたたみボタンとYIP情報
					if (data.type === "yip" && data.yip) {
						const isExpanded = expandedRows[data.id] || false;
						return (
							<div className="flex items-center gap-2">
								{/* 展開/折りたたみボタン */}
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setExpandedRows((prev) => ({
											...prev,
											[data.id]: !isExpanded,
										}));
									}}
									className="p-1 h-6 w-6"
									aria-label={
										isExpanded ? "アイテムを非表示" : "アイテムを表示"
									}
								>
									{isExpanded ? (
										<ChevronDown className="h-4 w-4" />
									) : (
										<ChevronRight className="h-4 w-4" />
									)}
								</Button>
								{/* YIPアイコンと情報 */}
								<FileText className="h-4 w-4 text-blue-600" />
								<div>
									<div className="font-semibold text-sm">{data.yip.code}</div>
									<div className="text-xs text-gray-600">
										{data.yip.Nickname}
									</div>
								</div>
								{/* アイテム数バッジ */}
								<div className="ml-auto">
									<span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
										{data.yip.items.length} items
									</span>
								</div>
							</div>
						);
					}

					// アイテム行の表示 - 親YIPが展開されている場合のみ表示
					if (data.type === "item" && data.item) {
						const parentExpanded = expandedRows[data.parentId || ""] || false;

						// 親YIPが展開されていない場合は非表示
						if (!parentExpanded) return null;

						return (
							<div className="flex items-center gap-2 ml-8">
								{/* アイテムアイコン */}
								<Package className="h-3 w-3 text-gray-400" />
								<div className="text-sm">
									{/* アイテム番号（等幅フォント） */}
									<span className="font-mono text-xs text-gray-500 mr-2">
										{data.item.itemNo}
									</span>
									{/* アイテム名 */}
									<span>{data.item.itemName}</span>
								</div>
							</div>
						);
					}

					return null;
				},
			}),

			// コアアイテム番号列 - アイテム行のみ表示
			columnHelper.accessor("type", {
				id: "coreItemNo",
				header: "Core Item No",
				size: 120,
				filterFn: (row, _, filterValue) => {
					if (!filterValue) return true;
					const data = row.original;
					if (data.type === "item" && data.item) {
						return data.item.CareItemNo.toLowerCase().includes(filterValue.toLowerCase());
					}
					return false;
				},
				cell: ({ row }) => {
					const data = row.original;
					// アイテム行かつ親が展開されている場合のみ表示
					if (data.type === "item" && data.item) {
						const parentExpanded = expandedRows[data.parentId || ""] || false;
						if (!parentExpanded) return null;
						return (
							<span className="font-mono text-xs text-gray-700">
								{data.item.CareItemNo}
							</span>
						);
					}
					return null;
				},
			}),

			// 数量列 - アイテム行のみ表示、数値は右寄せでカンマ区切り
			columnHelper.accessor("type", {
				id: "qty",
				header: "Qty",
				size: 80,
				filterFn: (row, _, filterValue) => {
					if (!filterValue) return true;
					const data = row.original;
					if (data.type === "item" && data.item) {
						return data.item.Qty.toString().includes(filterValue);
					}
					return false;
				},
				cell: ({ row }) => {
					const data = row.original;
					if (data.type === "item" && data.item) {
						const parentExpanded = expandedRows[data.parentId || ""] || false;
						if (!parentExpanded) return null;
						return (
							<span className="font-semibold text-right block">
								{data.item.Qty.toLocaleString()}
							</span>
						);
					}
					return null;
				},
			}),

			// 費目列 - アイテム行のみ表示、等幅フォント
			columnHelper.accessor("type", {
				id: "himoku",
				header: "Himoku",
				size: 100,
				filterFn: (row, _, filterValue) => {
					if (!filterValue) return true;
					const data = row.original;
					if (data.type === "item" && data.item) {
						return data.item.Himoku.toLowerCase().includes(filterValue.toLowerCase());
					}
					return false;
				},
				cell: ({ row }) => {
					const data = row.original;
					if (data.type === "item" && data.item) {
						const parentExpanded = expandedRows[data.parentId || ""] || false;
						if (!parentExpanded) return null;
						return (
							<span className="font-mono text-xs">{data.item.Himoku}</span>
						);
					}
					return null;
				},
			}),

			// GBA列 - アイテム行のみ表示、等幅フォント
			columnHelper.accessor("type", {
				id: "gba",
				header: "GBA",
				size: 80,
				filterFn: (row, _, filterValue) => {
					if (!filterValue) return true;
					const data = row.original;
					if (data.type === "item" && data.item) {
						return data.item.GBA.toLowerCase().includes(filterValue.toLowerCase());
					}
					return false;
				},
				cell: ({ row }) => {
					const data = row.original;
					if (data.type === "item" && data.item) {
						const parentExpanded = expandedRows[data.parentId || ""] || false;
						if (!parentExpanded) return null;
						return <span className="font-mono text-xs">{data.item.GBA}</span>;
					}
					return null;
				},
			}),
		],
		[selectedYips, expandedRows],
	);

	/**
	 * React Tableインスタンスの作成
	 * コア機能、展開機能、フィルタ機能を有効化
	 */
	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<div className="w-full h-screen flex flex-col bg-gray-50">
			{/* ページヘッダー - タイトル、統計情報、アクションボタン */}
			<div className="px-6 py-4 bg-white border-b shadow-sm">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">YIP Management</h1>
						<p className="text-gray-600 mt-1">
							{sampleData.YIP.length} YIP エントリ,{" "}
							{sampleData.YIP.reduce((acc, yip) => acc + yip.items.length, 0)}{" "}
							総アイテム数
						</p>
					</div>
					{/* アクションボタン群 */}
					<div className="flex gap-2">
						{/* フィルタ切り替えボタン */}
						<Button
							size="sm"
							variant="outline"
							onClick={() => setShowFilters(!showFilters)}
							className={cn(
								"flex items-center gap-2 h-8 px-3",
								showFilters
									? "bg-gray-100 text-gray-700"
									: "bg-white text-gray-500",
							)}
						>
							<Filter className="w-4 h-4" />
							Filter
						</Button>
						<Button variant="outline" size="sm">
							エクスポート
						</Button>
						<Button size="sm">YIP追加</Button>
					</div>
				</div>
			</div>

			{/* メインテーブル - 階層構造でYIPとアイテムを表示 */}
			<div className="flex-1 p-6 overflow-hidden">
				<div className="bg-white rounded-lg border shadow-sm h-full overflow-auto">
					<table className="w-full">
						{/* テーブルヘッダー - 固定位置でスクロール時も表示 */}
						<thead className="sticky top-0 bg-gray-50 border-b">
							{/* カラムヘッダー行 */}
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wide"
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
							
							{/* フィルター行 */}
							{showFilters && (
								<tr className="border-t border-gray-200">
									{table.getFlatHeaders().map((header) => (
										<th
											key={`filter-${header.id}`}
											className="px-4 py-2 bg-gray-50"
											style={{
												width: header.getSize(),
											}}
										>
											{header.column.getCanFilter() && (
												<YipTableFilters
													column={header.column as any}
												/>
											)}
										</th>
									))}
								</tr>
							)}
						</thead>
						{/* テーブルボディ - YIPとアイテムの階層表示 */}
						<tbody className="divide-y divide-gray-200">
							{table.getRowModel().rows.map((row) => {
								const data = row.original;

								// アイテム行で親YIPが展開されていない場合は非表示
								if (data.type === "item") {
									const parentExpanded =
										expandedRows[data.parentId || ""] || false;
									if (!parentExpanded) return null;
								}

								return (
									<tr
										key={row.id}
										className={`hover:bg-gray-50 transition-colors ${
											data.type === "yip"
												? "bg-white border-b-2 border-gray-100" // YIP行のスタイル
												: "bg-gray-50/50" // アイテム行のスタイル
										}`}
									>
										{row.getVisibleCells().map((cell) => (
											<td
												key={cell.id}
												className="px-4 py-3 text-sm"
												style={{ width: cell.column.getSize() }}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										))}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			{/* フッター - 選択状態と展開状態の表示 */}
			<div className="px-6 py-3 bg-white border-t">
				<div className="flex items-center justify-between text-sm text-gray-600">
					<div>選択中: {selectedYips.size} YIP</div>
					<div>
						展開中: {Object.values(expandedRows).filter(Boolean).length}{" "}
						YIPセクション
					</div>
				</div>
			</div>
		</div>
	);
};

export default YipItemTable;