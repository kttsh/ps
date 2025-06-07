/**
 * 共通型定義
 * ItemTable、VendorAssignment、YipItemTableで共有される型定義
 */

/**
 * テーブルカラム定義のジェネリック型
 * @template T - データの型
 */
export interface TableColumn<T = any> {
	/** カラムID */
	id: string;
	/** カラムヘッダー名 */
	header: string;
	/** データアクセサーキー */
	accessorKey: keyof T;
	/** カラム幅 */
	size?: number;
	/** 最小幅 */
	minSize?: number;
	/** 最大幅 */
	maxSize?: number;
}

/**
 * 選択変更ハンドラーの型
 * @template T - 選択アイテムのID型（通常はnumberまたはstring）
 */
export type SelectionChangeHandler<T = number> = (selectedIds: T[]) => void;

/**
 * 削除ハンドラーの型
 */
export type RemovalHandler = (itemId: string, subItemId: number) => void;

/**
 * ベンダー割り当て統計情報
 */
export interface VendorAssignmentStats {
	/** 総ベンダー数 */
	totalVendors: number;
	/** 割り当て済み数 */
	totalAssigned: number;
	/** ユニーク割り当て数 */
	uniqueAssignedCount: number;
	/** 未割り当て数 */
	totalUnassigned: number;
	/** 総YIP数 */
	totalYip: number;
}

/**
 * チェックボックスのProps
 */
export interface CheckboxProps {
	/** チェック状態 */
	checked?: boolean;
	/** 不確定状態 */
	indeterminate?: boolean;
	/** 変更時のコールバック */
	onChange?: (checked: boolean) => void;
	/** 無効状態 */
	disabled?: boolean;
	/** アクセシビリティラベル */
	"aria-label"?: string;
}

/**
 * YIPアイテムデータ
 */
export interface YIPItem {
	/** アイテム番号 */
	itemNo: string;
	/** ケアアイテム番号 */
	CareItemNo: string;
	/** アイテム名 */
	itemName: string;
	/** 数量 */
	Qty: number;
	/** 費目 */
	Himoku: string;
	/** GBA */
	GBA: string;
}

/**
 * YIPデータ
 */
export interface YIP {
	/** 初期フラグ */
	IsInitial: boolean;
	/** YIPコード */
	code: string;
	/** ニックネーム */
	Nickname: string;
	/** 配下アイテムリスト */
	items: YIPItem[];
}

/**
 * YIPデータコンテナ
 */
export interface YIPData {
	/** YIPリスト */
	YIP: YIP[];
}

/**
 * テーブル行データ（階層構造用）
 */
export interface TableRow {
	/** 行ID */
	id: string;
	/** 行タイプ */
	type: "yip" | "item";
	/** YIPデータ（YIP行の場合） */
	yip?: YIP;
	/** アイテムデータ（アイテム行の場合） */
	item?: YIPItem;
	/** 親YIPコード */
	yipCode?: string;
	/** 親行ID */
	parentId?: string;
}
