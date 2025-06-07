import { useCallback, useMemo, useState } from "react";
import type { Vendor, XipVendor, Yip } from "../types/vendor";

/**
 * ベンダー割り当て処理を管理するカスタムフック
 */
export const useVendorAssignment = (
	initialYipList: Yip[],
	masterVendors: Vendor[],
) => {
	// YIPリストの状態管理
	const [yipList, setYipList] = useState<Yip[]>(initialYipList);

	// 選択されたベンダーIDの状態管理
	const [selectedVendorIds, setSelectedVendorIds] = useState<number[]>([]);

	// 割り当て処理中フラグ
	const [isAssigning, setIsAssigning] = useState(false);

	// 選択されたファンクション
	const [selectedFunction, setSelectedFunction] = useState<string>("all");

	// 全YIPに割り当て済みのベンダー番号を集計
	const allAssignedVendorNumbers = useMemo(() => {
		const numbers = new Set<number>();
		for (const yip of yipList) {
			for (const vendor of yip.Vendor) {
				numbers.add(vendor.vendorNumber);
			}
		}
		return numbers;
	}, [yipList]);

	// 利用可能なファンクション一覧を取得
	const availableFunctions = useMemo(() => {
		const functions = new Set<string>();
		for (const vendor of masterVendors) {
			functions.add(vendor.function);
		}
		return Array.from(functions).sort();
	}, [masterVendors]);

	// 未割り当てベンダーの計算（ファンクション絞り込み適用）
	const unassignedVendors = useMemo(() => {
		let filtered = masterVendors.filter(
			(vendor) => !allAssignedVendorNumbers.has(vendor.vendorNumber),
		);

		// ファンクション絞り込み
		if (selectedFunction !== "all") {
			filtered = filtered.filter(
				(vendor) => vendor.function === selectedFunction,
			);
		}

		return filtered;
	}, [masterVendors, allAssignedVendorNumbers, selectedFunction]);

	// 統計情報の計算
	const stats = useMemo(() => {
		let totalAssigned = 0;
		for (const yip of yipList) {
			totalAssigned += yip.Vendor.length;
		}

		const uniqueAssignedCount = allAssignedVendorNumbers.size;
		return {
			totalVendors: masterVendors.length,
			totalAssigned, // 延べ割り当て数（重複含む）
			uniqueAssignedCount, // ユニークな割り当てベンダー数
			totalUnassigned: masterVendors.length - uniqueAssignedCount,
			totalYip: yipList.length,
		};
	}, [yipList, allAssignedVendorNumbers.size, masterVendors.length]);

	// 全YIPへのベンダー割り当て処理
	const handleAssignToAllYip = useCallback(
		async (selectedVendors: Vendor[]) => {
			if (selectedVendors.length === 0) return;

			setIsAssigning(true);

			try {
				// 実際のシステムでは、ここで全YIP（旧Package）への一括割り当てAPI呼び出しを行う
				await new Promise((resolve) => setTimeout(resolve, 1200));

				// 選択されたベンダーを、すべてのYIPに追加
				const newVendors: XipVendor[] = selectedVendors.map((vendor) => ({
					vendorNumber: vendor.vendorNumber,
					name: vendor.name,
				}));

				setYipList((prevYipList) =>
					prevYipList.map((yip) => ({
						...yip,
						Vendor: [...yip.Vendor, ...newVendors],
					})),
				);

				// 選択状態をクリア
				setSelectedVendorIds([]);
			} catch (error) {
				console.error("ベンダー一括割り当てエラー:", error);
				alert(
					`ベンダーの一括割り当てに失敗しました。もう一度お試しください。\nエラー詳細: ${error}`,
				);
			} finally {
				setIsAssigning(false);
			}
		},
		[],
	);

	// ベンダー削除処理
	const handleRemoveVendor = useCallback(
		(yipCode: string, vendorNumber: number) => {
			const targetYip = yipList.find((yip) => yip.yipCode === yipCode);

			if (!targetYip) {
				console.error(`YIPが見つかりません: ${yipCode}`);
				return;
			}

			const vendor = targetYip.Vendor.find(
				(v) => v.vendorNumber === vendorNumber,
			);

			if (!vendor) {
				console.error(
					`ベンダーが見つかりません: ${vendorNumber} in YIP ${yipCode}`,
				);
				return;
			}

			const confirmed = window.confirm(
				`${vendor.name} を${targetYip.yipNickname}から削除しますか？`,
			);
			if (!confirmed) return;

			setYipList((prevYipList) =>
				prevYipList.map((yip) =>
					yip.yipCode === yipCode
						? {
								...yip,
								Vendor: yip.Vendor.filter(
									(v) => v.vendorNumber !== vendorNumber,
								),
							}
						: yip,
				),
			);
		},
		[yipList],
	);

	return {
		yipList,
		selectedVendorIds,
		setSelectedVendorIds,
		isAssigning,
		unassignedVendors,
		stats,
		selectedFunction,
		setSelectedFunction,
		availableFunctions,
		handleAssignToAllYip,
		handleRemoveVendor,
	};
};
