import { Checkbox } from "@/components/ui/checkbox";
import type { CheckboxProps } from "@/features/wbs-management/types/common";
import type React from "react";

/**
 * 不確定状態をサポートするチェックボックスコンポーネント
 * ItemTable、VendorAssignment、YipItemTableで共通利用
 */
export const IndeterminateCheckbox: React.FC<CheckboxProps> = ({
	checked = false,
	indeterminate = false,
	onChange,
	disabled = false,
	"aria-label": ariaLabel,
}) => {
	return (
		<Checkbox
			checked={indeterminate ? "indeterminate" : checked}
			onCheckedChange={(value) => {
				if (onChange && typeof value === "boolean") {
					onChange(value);
				}
			}}
			disabled={disabled}
			aria-label={ariaLabel}
		/>
	);
};
