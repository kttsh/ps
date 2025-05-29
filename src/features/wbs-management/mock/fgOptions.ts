// features/wbs-management/mock/fgOptions.ts
// Function/Groupの選択肢定義

import type { FGOption } from '../types';

/**
 * Function/Groupの選択肢データ
 * キー: 選択肢のコード（1文字）
 * 値: 選択肢の説明
 */
export const fgOptions: FGOption[] = [
    { code: 'A', label: 'Air' },
    { code: 'B', label: 'Boring' },
    { code: 'C', label: 'Construction' },
    { code: 'D', label: 'Doraemon' },
    { code: 'E', label: 'Electric' },
    { code: 'F', label: 'Fabrication' },
    { code: 'G', label: 'General' },
    { code: 'H', label: 'Hydraulic' },
    { code: 'I', label: 'Instrumentation' },
    { code: 'J', label: 'Jacking' },
    { code: 'K', label: 'Kinetic' },
    { code: 'L', label: 'Lighting' },
    { code: 'M', label: 'Mechanical' },
    { code: 'N', label: 'Navigation' },
    { code: 'O', label: 'Operation' },
    { code: 'P', label: 'Piping' },
    { code: 'Q', label: 'Quality' },
    { code: 'R', label: 'Rotating' },
    { code: 'S', label: 'Structure' },
    { code: 'T', label: 'Transport' },
    { code: 'U', label: 'Utility' },
    { code: 'V', label: 'Ventilation' },
    { code: 'W', label: 'Welding' },
    { code: 'X', label: 'X-ray' },
    { code: 'Y', label: 'Yard' },
    { code: 'Z', label: 'Zone' }
];

/**
 * FGコードのマップ（高速検索用）
 */
export const fgCodeMap = new Map(
    fgOptions.map(option => [option.code, option.label])
);

/**
 * FGコードのリスト（バリデーション用）
 */
export const fgCodes = fgOptions.map(option => option.code) as FGCode[];

/**
 * FGコードの型定義（型ガード用）
 */
export type FGCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' |
    'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' |
    'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

/**
 * FGコードの型ガード
 */
export const isFGCode = (value: string): value is FGCode => {
    return fgCodes.includes(value as FGCode);
};