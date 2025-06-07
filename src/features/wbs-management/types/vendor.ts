/**
 * ベンダー関連の型定義
 */

/**
 * ベンダーマスターデータの型定義
 */
export interface Vendor {
	/** ベンダーID */
	id: number;
	/** ファンクション (A-Z) */
	function: string;
	/** ベンダー番号 */
	vendorNumber: number;
	/** ベンダー名 */
	name: string;
	/** ベンダーコード */
	code: string;
}

/**
 * WBS内で使用されるベンダー情報の型定義
 */
export interface XipVendor {
	/** ベンダー番号 */
	vendorNumber: number;
	/** ベンダー名 */
	name: string;
}

/**
 * YIPデータの型定義
 */
export interface Yip {
	/** YIPコード */
	yipCode: string;
	/** YIPのニックネーム */
	yipNickname: string;
	/** 割り当てられたベンダー一覧 */
	Vendor: XipVendor[];
}
