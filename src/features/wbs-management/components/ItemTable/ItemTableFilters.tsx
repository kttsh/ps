// features/wbs-management/components/ItemTable/ItemTableFilters.tsx
// 各カラムのフィルター入力を提供するコンポーネント（ドロップダウン対応版）

import { Input } from "@/components/ui/input";
import type { Column } from "@tanstack/react-table";
import type React from "react";
// Select関連のインポートは残す可能性がありますが、Sheet関連は削除します。
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Item } from "../../types/item";
// import { ibsCodeOptions } from '../../mock/selectOptions'; // IBS Codeのテキスト入力化に伴い不要な可能性

interface ItemTableFiltersProps {
	column: Column<Item, Item[keyof Item]>;
}

/**
 * カラムごとのフィルターコンポーネント
 *
 * カラムのタイプに応じて適切なフィルター入力を提供します：
 * - IBS Codeカラム: テキスト入力（以前はセレクトボックス）
 * - 数量カラム: 数値入力
 * - その他（Cost Element含む）: テキスト入力
 */
export const ItemTableFilters: React.FC<ItemTableFiltersProps> = ({
	column,
}) => {
	const columnId = column.id;
	const filterValue = column.getFilterValue();

	// filterValueの型を安全に扱うための準備
	const currentFilter =
		typeof filterValue === "string" || typeof filterValue === "number"
			? String(filterValue)
			: "";

	/**
	 * Cost Elementカラム専用のテキストフィルター
	 */
	if (columnId === "costElement") {
		return (
			<Input
				placeholder="Filter Cost Element..."
				value={currentFilter}
				onChange={(e) => column.setFilterValue(e.target.value || undefined)}
				className="h-6 text-xs px-1 rounded-sm"
			/>
		);
	}

	/**
	 * IBS Codeカラム専用のフィルター (テキスト入力に変更)
	 */
	if (columnId === "ibsCode") {
		return (
			<Input
				placeholder="Filter IBS Code..."
				value={currentFilter}
				onChange={(e) => column.setFilterValue(e.target.value || undefined)}
				className="h-6 text-xs px-1 rounded-sm"
			/>
		);
	}

	/**
	 * 数量カラム専用の数値フィルター
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
	 * その他のカラム用のテキストフィルター
	 */
	return (
		<Input
			placeholder={`Filter ${columnId}...`}
			value={currentFilter}
			onChange={(e) => column.setFilterValue(e.target.value || undefined)}
			className="h-6 text-xs px-1 rounded-sm"
		/>
	);
};
