// features/wbs-management/types/item.ts
// アイテムテーブルで使用する型定義

/**
 * Function/Groupの選択肢型
 */
export interface FGOption {
    code: string;
    label: string;
}

/**
 * Function/Groupコードの型
 */
export type FGCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' |
    'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' |
    'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

/**
 * アイテムの基本データ型
 * 
 * 各フィールドの説明：
 * - jobNo: ジョブ番号（4桁の数字文字列）
 * - fg: Function/Groupコード（A-Z）
 * - coreItemNo: コアアイテム番号
 * - itemNo: アイテム番号
 * - itemName: アイテム名
 * - qty: 数量
 * - costElement: コスト要素コード
 * - ibsCode: IBSコード
 */
export interface Item {
    jobNo: string;
    fg: FGCode;
    coreItemNo: string;
    itemNo: string;
    itemName: string;
    qty: number;
    costElement: string;
    ibsCode: string;
}

/**
 * フィルターの状態を管理する型
 * 各カラムごとにフィルター値を保持
 */
export interface ItemFilters {
    jobNo?: string;
    fg?: string;
    coreItemNo?: string;
    itemNo?: string;
    itemName?: string;
    qty?: string;
    costElement?: string;
    ibsCode?: string;
}

/**
 * カラムの定義型
 * TanStack Tableで使用するカラム設定を拡張
 */
export interface ItemColumn {
    id: keyof Item | 'select';
    header: string;
    accessorKey: keyof Item | 'select';
    size?: number;
    minSize?: number;
    maxSize?: number;
}

/**
 * テーブルの状態を管理する型
 */
export interface ItemTableState {
    filters: ItemFilters;
    sorting: Array<{
        id: string;
        desc: boolean;
    }>;
    globalFilter?: string;
}