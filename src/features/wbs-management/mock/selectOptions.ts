// features/wbs-management/mock/selectOptions.ts
// Cost ElementとIBS Codeの選択肢データ

export interface SelectOption {
	code: string;
	label: string;
}

/**
 * Cost Elementの選択肢データ
 */
export const costElementOptions: SelectOption[] = [
	{ code: "6F22", label: "Equipment - Mechanical" },
	{ code: "6F23", label: "Equipment - Electrical" },
	{ code: "6G11", label: "Piping - Main Lines" },
	{ code: "6G12", label: "Piping - Branch Lines" },
	{ code: "7A01", label: "Instrumentation - Control" },
	{ code: "7A02", label: "Instrumentation - Safety" },
	{ code: "8B15", label: "Structural - Steel" },
	{ code: "8B16", label: "Structural - Concrete" },
	{ code: "9C33", label: "Civil - Foundation" },
	{ code: "9D44", label: "Civil - Underground" },
];

/**
 * IBS Codeの選択肢データ
 */
export const ibsCodeOptions: SelectOption[] = [
	{ code: "F11", label: "Process Equipment - Primary" },
	{ code: "F12", label: "Process Equipment - Secondary" },
	{ code: "G21", label: "Utility Systems - Power" },
	{ code: "G22", label: "Utility Systems - Water" },
	{ code: "H31", label: "Control Systems - DCS" },
	{ code: "H32", label: "Control Systems - SIS" },
	{ code: "J41", label: "Infrastructure - Buildings" },
	{ code: "J42", label: "Infrastructure - Roads" },
	{ code: "K51", label: "Support Systems - Maintenance" },
	{ code: "K52", label: "Support Systems - Operations" },
];

/**
 * Cost Elementコードのマップ（高速検索用）
 */
export const costElementCodeMap = new Map(
	costElementOptions.map((option) => [option.code, option.label]),
);

/**
 * IBS Codeのマップ（高速検索用）
 */
export const ibsCodeMap = new Map(
	ibsCodeOptions.map((option) => [option.code, option.label]),
);
