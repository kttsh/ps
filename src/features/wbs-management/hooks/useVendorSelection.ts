import { useCallback, useMemo, useState } from "react";
import type { Vendor } from "../types/vendor";

/**
 * ベンダー選択テーブルの状態管理を行うカスタムフック
 */
export const useVendorSelection = (
	vendors: Vendor[],
	selectedVendorIds: number[],
	onSelectionChange: (selectedIds: number[]) => void,
) => {
	// グローバルフィルターの状態管理
	const [globalFilter, setGlobalFilter] = useState("");

	// 行選択状態の計算
	const rowSelection = useMemo(() => {
		const selection: Record<string, boolean> = {};
		for (const id of selectedVendorIds) {
			const vendorIndex = vendors.findIndex((v) => v.id === id);
			if (vendorIndex !== -1) {
				selection[vendorIndex.toString()] = true;
			}
		}
		return selection;
	}, [selectedVendorIds, vendors]);

	// 行選択状態が変更された時の処理
	const handleRowSelectionChange = useCallback(
		(
			updatedSelection:
				| Record<string, boolean>
				| ((prev: Record<string, boolean>) => Record<string, boolean>),
		) => {
			const newSelection =
				typeof updatedSelection === "function"
					? updatedSelection(rowSelection)
					: updatedSelection;

			// 選択されたインデックスから実際のベンダーIDを取得
			const selectedIds = Object.keys(newSelection)
				.filter((key) => newSelection[key])
				.map((index) => vendors[Number.parseInt(index)]?.id)
				.filter((id): id is number => id !== undefined);

			onSelectionChange(selectedIds);
		},
		[vendors, onSelectionChange, rowSelection],
	);

	return {
		globalFilter,
		setGlobalFilter,
		rowSelection,
		handleRowSelectionChange,
	};
};
