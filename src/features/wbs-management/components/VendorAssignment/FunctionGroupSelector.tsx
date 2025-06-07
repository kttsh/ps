import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import type React from "react";

interface FunctionGroupSelectorProps {
	/** 選択されたファンクション */
	selectedFunction: string;
	/** ファンクション選択変更時のコールバック */
	onFunctionChange: (value: string) => void;
	/** 利用可能なファンクション一覧 */
	availableFunctions: string[];
}

/**
 * ファンクショングループ選択コンポーネント
 * ベンダーのファンクション(A-Z)による絞り込み機能を提供
 */
const FunctionGroupSelector: React.FC<FunctionGroupSelectorProps> = ({
	selectedFunction,
	onFunctionChange,
	availableFunctions,
}) => {
	return (
		<div className="flex items-center gap-2">
			<Filter size={16} className="text-gray-500" />
			<span className="text-sm font-medium text-gray-700">ファンクション:</span>
			<Select value={selectedFunction} onValueChange={onFunctionChange}>
				<SelectTrigger className="w-32">
					<SelectValue placeholder="全て" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">全て</SelectItem>
					{availableFunctions.map((func) => (
						<SelectItem key={func} value={func}>
							{func}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default FunctionGroupSelector;
