// features/wbs-management/components/ItemTable/EditableItemTableCell.tsx
// 編集可能なテーブルセルコンポーネント

import React from 'react';
import { flexRender } from '@tanstack/react-table';
import type { Cell } from '@tanstack/react-table';
import type { Item } from '../../types/item';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fgCodeMap } from '../../mock/fgOptions';
import { costElementCodeMap, ibsCodeMap, costElementOptions, ibsCodeOptions } from '../../mock/selectOptions';

interface EditableItemTableCellProps {
  cell: Cell<Item, unknown>;
  isEditMode: boolean;
  onCellChange: (value: string | number) => void;
}

/**
 * 値を安全に文字列に変換する関数
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
  return JSON.stringify(value);
};

/**
 * Function/Groupカラムの色を取得する関数
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
 * 編集可能なテーブルセルコンポーネント
 * 
 * カラムの種類と編集モードに応じて適切なコンポーネントを表示：
 * - 編集不可: Job No, Function/Group
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

  // 編集不可能なカラム（Job No, Function/Group）
  if (columnId === 'jobNo' || columnId === 'fg') {
    if (columnId === 'fg') {
      const color = getFGColor(strValue);
      const label = fgCodeMap.get(strValue) || strValue;
      
      return (
        <div className="text-center">
          <span
            className={cn(
              'inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded',
              color.bg,
              color.text,
              isEditMode && 'opacity-60' // 編集モード時は少し薄く表示
            )}
            title={`${label} (Read-only)`}
          >
            {strValue}
          </span>
        </div>
      );
    }
    
    return (
      <div className={cn(
        'text-xs font-mono',
        isEditMode && 'text-gray-500 opacity-60'
      )} title="Read-only">
        {strValue}
      </div>
    );
  }

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

  // 表示モード時（既存のロジック）
  
  // 数量カラムのスタイリング
  if (columnId === 'qty') {
    const numValue = typeof value === 'number' ? value : 0;
    return (
      <div className="text-right font-mono text-xs">
        {numValue.toLocaleString()}
      </div>
    );
  }

  // Function/Groupカラムのスタイリング（上で処理済み）
  if (columnId === 'fg') {
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