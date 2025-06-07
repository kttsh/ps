import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, Building2, Package, Trash2 } from "lucide-react";
import type React from "react";

import type { Yip } from "../../types/vendor";

interface YipCardProps {
	/** YIPデータ */
	yipData: Yip;
	/** ベンダー削除時のコールバック */
	onRemoveVendor: (yipCode: string, vendorNumber: number) => void;
}

/**
 * YIPカードコンポーネント
 * 各YIP（プロジェクト）に割り当てられたベンダー情報を表示
 */
const YipCard: React.FC<YipCardProps> = ({ yipData, onRemoveVendor }) => {
	return (
		<Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
			{/* カードヘッダー - YIP情報 */}
			<CardHeader className="pb-4">
				<div className="flex items-center gap-3">
					<div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
						<Package size={20} className="text-white" />
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="text-lg font-semibold text-gray-900 truncate">
							{yipData.yipNickname}
						</h3>
						<p className="text-sm text-gray-500 font-mono">{yipData.yipCode}</p>
					</div>
				</div>
			</CardHeader>

			{/* カードコンテンツ - 割り当てベンダー一覧 */}
			<CardContent>
				<div className="border-t border-gray-200 pt-4">
					<h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
						<Building2 size={16} />
						割り当てベンダー ({yipData.Vendor.length}件)
					</h4>

					{/* ベンダーが割り当てられていない場合 */}
					{yipData.Vendor.length === 0 ? (
						<div className="text-center py-8 text-gray-400">
							<AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
							<p className="text-sm">まだベンダーが割り当てられていません</p>
							<p className="text-xs text-gray-400 mt-1">
								左のテーブルからベンダーを選択して一括割り当てしてください
							</p>
						</div>
					) : (
						/* 割り当てベンダー一覧 */
						<div className="space-y-2">
							{yipData.Vendor.map((vendor) => (
								<div
									key={vendor.vendorNumber}
									className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
								>
									{/* ベンダーアイコン */}
									<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
										<Building2 size={14} className="text-white" />
									</div>

									{/* ベンダー情報 */}
									<div className="flex-1 min-w-0">
										<div className="text-sm font-medium text-gray-900 truncate">
											{vendor.name}
										</div>
										<div className="text-xs text-gray-500 font-mono">
											No.{vendor.vendorNumber}
										</div>
									</div>

									{/* 削除ボタン */}
									<button
										type="button"
										onClick={() =>
											onRemoveVendor(yipData.yipCode, vendor.vendorNumber)
										}
										className="p-1 rounded-full hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
										title="ベンダーを削除"
									>
										<Trash2 size={14} />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default YipCard;
