import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type React from "react";

import { useVendorAssignment } from "../hooks/useVendorAssignment";
import { initialYipList, masterVendors } from "../mock/vendorData";
import {
	FunctionGroupSelector,
	StatsPanel,
	VendorSelectionTable,
	YipCard,
} from "./VendorAssignment";

/**
 * ベンダー割り当てページのメインコンポーネント
 * XIP生成における未割り当てベンダーの表示・選択・一括割り当て機能を提供
 */
const VendorAssignmentPage: React.FC = () => {
	// カスタムフックを使用してベンダー割り当て機能を管理
	const {
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
	} = useVendorAssignment(initialYipList, masterVendors);

	return (
		<div className="h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto h-full flex flex-col">
				{/* ページヘッダー */}
				<div className="mb-6 flex items-center justify-between">
					<div className="flex items-center gap-6">
						<h1 className="text-2xl font-bold text-gray-900">XIP生成</h1>
						<FunctionGroupSelector
							selectedFunction={selectedFunction}
							onFunctionChange={setSelectedFunction}
							availableFunctions={availableFunctions}
						/>
					</div>
					<StatsPanel stats={stats} />
				</div>

				{/* メインコンテンツエリア */}
				<div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
					{/* 左側: ベンダー選択テーブル */}
					<div className="bg-white rounded-lg shadow-sm p-6">
						<VendorSelectionTable
							vendors={unassignedVendors}
							selectedVendorIds={selectedVendorIds}
							onSelectionChange={setSelectedVendorIds}
							onAssignToAllYip={handleAssignToAllYip}
							isAssigning={isAssigning}
						/>
					</div>

					{/* 右側: YIPカード一覧 */}
					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="h-full flex flex-col">
							<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
								<Package size={20} />
								YIP一覧
								<Badge
									variant="outline"
									className="ml-2 bg-green-50 text-green-700 border-green-200"
								>
									全YIP対象
								</Badge>
							</h2>

							<div className="flex-1 space-y-4 overflow-y-auto">
								{yipList.map((yip) => (
									<YipCard
										key={yip.yipCode}
										yipData={yip}
										onRemoveVendor={handleRemoveVendor}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VendorAssignmentPage;
