// features/wbs-management/components/ItemTable/ItemTableCell.tsx
// テーブルの各セルを描画するコンポーネント（ドロップダウン対応版）

import React from 'react';
import { flexRender } from '@tanstack/react-table';
import type { Cell } from '@tanstack/react-table';
import type { Item } from '../../types/item';
import { cn } from '@/lib/utils';
import { fgCodeMap } from '../../mock/fgOptions';
import { costElementCodeMap, ibsCodeMap } from '../../mock/selectOptions';

interface ItemTableCellProps {
  cell: Cell<Item, unknown>;
}

/**
 * 値を安全に文字列に変換する関数
 * unknown型の値をReactNodeとして表示可能な形式に変換
 */
const formatCellValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  if (typeof value === 'boolean') {
    return value.toString();
  }
  // その他の型は JSON.stringify でフォールバック
  return JSON.stringify(value);
};

/**
 * Function/Groupカラムの色を取得する関数
 * A-Zの各コードに対して異なる色を割り当て
 */
const getFGColor = (code: string): { bg: string; text: string } => {
  const colors = [
    { bg: 'bg-blue-100', text: 'text-blue-800' },
    { bg: 'bg-green-100', text: 'text-green-800' },
    { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    { bg: 'bg-red-100', text: 'text-red-800' },
    { bg: 'bg-purple-100', text: 'text-purple-800' },
    { bg: 'bg-pink-100', text: 'text-pink-800' },
    { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    { bg: 'bg-gray-100', text: 'text-gray-800' },
  ];
  
  const index = code.charCodeAt(0) - 'A'.charCodeAt(0);
  return colors[index % colors.length];
};

/**
 * テーブルセルコンポーネント
 * 
 * セルの種類に応じて適切なスタイリングを適用します：
 * - 数量: 右寄せ、数値フォーマット
 * - Function/Group: 中央寄せ、バッジスタイル  
 * - Cost Element: コード + ラベル表示
 * - IBS Code: コード + ラベル表示
 * - その他: 左寄せ、テキストスタイル
 */
export const ItemTableCell: React.FC<ItemTableCellProps> = ({ cell }) => {
  const columnId = cell.column.id;
  const value = cell.getValue();

  // 数量カラムのスタイリング
  if (columnId === 'qty') {
    const numValue = typeof value === 'number' ? value : 0;
    return (
      <div className="text-right font-mono text-sm">
        {numValue.toLocaleString()}
      </div>
    );
  }

  // Function/Groupカラムのスタイリング
  if (columnId === 'fg') {
    const strValue = formatCellValue(value);
    const color = getFGColor(strValue);
    const label = fgCodeMap.get(strValue) || strValue;
    
    return (
      <div className="text-center">
        <span
          className={cn(
            'inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded',
            color.bg,
            color.text
          )}
          title={label}
        >
          {strValue}
        </span>
      </div>
    );
  }

  // Cost Elementカラムのスタイリング
  if (columnId === 'costElement') {
    const strValue = formatCellValue(value);
    const label = costElementCodeMap.get(strValue);
    
    return (
      <div className="font-mono text-sm">
        <div className="font-semibold">{strValue}</div>
        {label && (
          <div className="text-xs text-gray-500 truncate" title={label}>
            {label}
          </div>
        )}
      </div>
    );
  }

  // IBS Codeカラムのスタイリング
  if (columnId === 'ibsCode') {
    const strValue = formatCellValue(value);
    const label = ibsCodeMap.get(strValue);
    
    return (
      <div className="font-mono text-sm">
        <div className="font-semibold">{strValue}</div>
        {label && (
          <div className="text-xs text-gray-500 truncate" title={label}>
            {label}
          </div>
        )}
      </div>
    );
  }

  // その他のカラムはデフォルトスタイル
  return (
    <div className="text-sm">
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  );
};