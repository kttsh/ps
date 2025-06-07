import type React from "react";

interface StatsPanelProps {
	/** 統計情報 */
	stats: {
		/** 総ベンダー数 */
		totalVendors: number;
		/** 延べ割当て数（重複含む） */
		totalAssigned: number;
		/** ユニークな割り当てベンダー数 */
		uniqueAssignedCount: number;
		/** 未割当てベンダー数 */
		totalUnassigned: number;
		/** YIP数 */
		totalYip: number;
	};
}

/**
 * 統計パネルコンポーネント（ヘッダー用コンパクト版）
 * ベンダー割り当ての統計情報を横並びで表示
 */
const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
	return (
		<div className="flex items-center gap-4">
			{/* 総ベンダー数 */}
			<div className="bg-white rounded-lg shadow-sm px-3 py-2 text-center">
				<div className="text-lg font-bold text-blue-600">
					{stats.totalVendors}
				</div>
				<div className="text-xs text-gray-600">総ベンダー</div>
			</div>

			{/* 延べ割当て数 */}
			<div className="bg-white rounded-lg shadow-sm px-3 py-2 text-center">
				<div className="text-lg font-bold text-green-600">
					{stats.totalAssigned}
				</div>
				<div className="text-xs text-gray-600">延べ割当て</div>
			</div>

			{/* 未割当て数 */}
			<div className="bg-white rounded-lg shadow-sm px-3 py-2 text-center">
				<div className="text-lg font-bold text-orange-600">
					{stats.totalUnassigned}
				</div>
				<div className="text-xs text-gray-600">未割当て</div>
			</div>

			{/* YIP数 */}
			<div className="bg-white rounded-lg shadow-sm px-3 py-2 text-center">
				<div className="text-lg font-bold text-purple-600">
					{stats.totalYip}
				</div>
				<div className="text-xs text-gray-600">YIP数</div>
			</div>
		</div>
	);
};

export default StatsPanel;
