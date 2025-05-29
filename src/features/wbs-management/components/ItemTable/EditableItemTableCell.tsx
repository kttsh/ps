// features/wbs-management/components/ItemTable/EditableItemTableCell.tsx
// 編集可能なテーブルセルコンポーネント

import React from 'react';
import { flexRender } from '@tanstack/react-table';
import type { Cell } from '@tanstack/react-table';
import type { Item } from '../../types/item';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { costElementCodeMap, ibsCodeMap, costElementOptions, ibsCodeOptions } from '../../mock/selectOptions';

interface EditableItemTableCellProps {
  cell: Cell<Item, Item[keyof Item]>;
  isEditMode: boolean;
  onCellChange: (value: string | number) => void;
}

/**
 * 値を安全に文字列に変換する関数
 */
const formatCellValue = (value: Item[keyof Item]): string => {
  if (value === null || value === undefined) {
    return '';
  }
  // Item[keyof Item] は string または number のため、直接 toString() で変換可能
  return value.toString();
};

/**
 * 編集可能なテーブルセルコンポーネント
 * 
 * カラムの種類と編集モードに応じて適切なコンポーネントを表示：
 * - テキスト入力: Core Item No, Item No, Item Name
 * - 数値入力: Qty
 * - ドロップダウン: Cost Element, IBS Code
 */
export const EditableItemTableCell: React.FC<EditableItemTableCellProps> = ({ 
  cell, 
  isEditMode, 
  onCellChange 
}) => {
  const columnId = cell.column.id;
  const value = cell.getValue();
  const strValue = formatCellValue(value);

  // 編集モード時の入力コンポーネント
  if (isEditMode) {
    // 数量カラム（数値入力）
    if (columnId === 'qty') {
      return (
        <Input
          type="number"
          value={typeof value === 'number' ? value : 0}
          onChange={(e) => {
            const numValue = parseInt(e.target.value) || 0;
            onCellChange(numValue);
          }}
          className="h-6 text-xs text-right font-mono px-1 py-0 rounded-sm border-gray-300 focus:border-blue-500"
          min="0"
        />
      );
    }

    // Cost Elementカラム（ドロップダウン）
    if (columnId === 'costElement') {
      return (
        <Select
          value={strValue}
          onValueChange={(selectedValue) => onCellChange(selectedValue)}
        >
          <SelectTrigger className="h-6 text-xs px-1 py-0 rounded-sm border-gray-300">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {costElementOptions.map((option) => (
              <SelectItem key={option.code} value={option.code} className="text-xs">
                {option.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // IBS Codeカラム（ドロップダウン）
    if (columnId === 'ibsCode') {
      return (
        <Select
          value={strValue}
          onValueChange={(selectedValue) => onCellChange(selectedValue)}
        >
          <SelectTrigger className="h-6 text-xs px-1 py-0 rounded-sm border-gray-300">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {ibsCodeOptions.map((option) => (
              <SelectItem key={option.code} value={option.code} className="text-xs">
                {option.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // その他のカラム（テキスト入力）
    return (
      <Input
        type="text"
        value={strValue}
        onChange={(e) => onCellChange(e.target.value)}
        className={cn(
          'h-6 text-xs px-1 py-0 rounded-sm border-gray-300 focus:border-blue-500',
          (columnId === 'coreItemNo' || columnId === 'itemNo') && 'font-mono'
        )}
        placeholder={`Enter ${columnId}...`}
      />
    );
  }

  // 表示モード時
  
  // 数量カラムのスタイリング
  if (columnId === 'qty') {
    const numValue = typeof value === 'number' ? value : 0;
    return (
      <div className="text-right font-mono text-xs">
        {numValue.toLocaleString()}
      </div>
    );
  }

  // Cost Elementカラムのスタイリング
  if (columnId === 'costElement') {
    const label = costElementCodeMap.get(strValue);
    
    return (
      <div className="font-mono text-xs">
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
    const label = ibsCodeMap.get(strValue);
    
    return (
      <div className="font-mono text-xs">
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
    <div className={cn(
      'text-xs',
      (columnId === 'coreItemNo' || columnId === 'itemNo') && 'font-mono'
    )}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  );
};