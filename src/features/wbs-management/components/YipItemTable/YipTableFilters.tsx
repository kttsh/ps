import { Input } from "@/components/ui/input";
import type { Column } from "@tanstack/react-table";
import type React from "react";
import type { TableRow } from "../../types/common";

interface YipTableFiltersProps {
	column: Column<TableRow, any>;
}

/**
 * YipItemTable用のフィルターコンポーネント
 * カラムのタイプに応じて適切なフィルター入力を提供
 */
export const YipTableFilters: React.FC<YipTableFiltersProps> = ({ column }) => {
	const columnId = column.id;
	const filterValue = column.getFilterValue();

	// filterValueの型を安全に扱うための準備
	const currentFilter =
		typeof filterValue === "string" || typeof filterValue === "number"
			? String(filterValue)
			: "";

	/**
	 * YIP/アイテム名フィルター
	 */
	if (columnId === "main") {
		return (
			<Input
				placeholder="Filter YIP/Item..."
				value={currentFilter}
				onChange={(e) => column.setFilterValue(e.target.value || undefined)}
				className="h-6 text-xs px-1 rounded-sm"
			/>
		);
	}

	/**
	 * コアアイテム番号フィルター
	 */
	if (columnId === "coreItemNo") {
		return (
			<Input
				placeholder="Filter Core Item..."
				value={currentFilter}
				onChange={(e) => column.setFilterValue(e.target.value || undefined)}
				className="h-6 text-xs px-1 rounded-sm"
			/>
		);
	}

	/**
	 * 数量フィルター
	 */
	if (columnId === "qty") {
		return (
			<Input
				type="number"
				placeholder="Filter Qty..."
				value={currentFilter}
				onChange={(e) => column.setFilterValue(e.target.value || undefined)}
				className="h-6 text-xs px-1 rounded-sm"
				min="0"
			/>
		);
	}

	/**
	 * Himoku/GBAフィルター
	 */
	if (columnId === "himoku" || columnId === "gba") {
		return (
			<Input
				placeholder={`Filter ${columnId === "himoku" ? "Himoku" : "GBA"}...`}
				value={currentFilter}
				onChange={(e) => column.setFilterValue(e.target.value || undefined)}
				className="h-6 text-xs px-1 rounded-sm"
			/>
		);
	}

	return null;
};