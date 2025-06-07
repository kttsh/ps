import type { Vendor, Yip } from "../types/vendor";

/**
 * ベンダーマスターデータ
 * 全てのベンダー情報を格納
 */
export const masterVendors: Vendor[] = [
	{
		id: 1,
		function: "A",
		vendorNumber: 1001,
		name: "Acme Engineering Corp",
		code: "ACME-001",
	},
	{
		id: 2,
		function: "B",
		vendorNumber: 1002,
		name: "Tokyo Steel Works",
		code: "TSW-002",
	},
	{
		id: 3,
		function: "C",
		vendorNumber: 1003,
		name: "Nordic Construction AB",
		code: "NORDIC-003",
	},
	{
		id: 4,
		function: "D",
		vendorNumber: 1004,
		name: "Global Consulting Ltd",
		code: "GCL-004",
	},
	{
		id: 5,
		function: "E",
		vendorNumber: 1005,
		name: "Precision Parts Inc",
		code: "PPI-005",
	},
	{
		id: 6,
		function: "F",
		vendorNumber: 1006,
		name: "Asia Pacific Builders",
		code: "APB-006",
	},
	{
		id: 7,
		function: "G",
		vendorNumber: 1007,
		name: "Euro Materials Group",
		code: "EMG-007",
	},
	{
		id: 8,
		function: "H",
		vendorNumber: 1008,
		name: "Australian Mining Services",
		code: "AMS-008",
	},
	{
		id: 9,
		function: "I",
		vendorNumber: 1009,
		name: "Canadian Industrial Solutions",
		code: "CIS-009",
	},
	{
		id: 10,
		function: "J",
		vendorNumber: 1010,
		name: "Brazilian Engineering Partners",
		code: "BEP-010",
	},
];

/**
 * 初期YIPデータ
 * 複数のプロジェクトとその割り当てベンダー情報
 */
export const initialYipList: Yip[] = [
	{
		yipCode: "YIP-123",
		yipNickname: "基盤建設プロジェクト Alpha",
		Vendor: [
			{ vendorNumber: 1001, name: "Acme Engineering Corp" },
			{ vendorNumber: 1002, name: "Tokyo Steel Works" },
		],
	},
	{
		yipCode: "YIP-456",
		yipNickname: "インフラ整備プロジェクト Beta",
		Vendor: [{ vendorNumber: 1003, name: "Nordic Construction AB" }],
	},
	{
		yipCode: "YIP-789",
		yipNickname: "設備導入プロジェクト Gamma",
		Vendor: [],
	},
];
