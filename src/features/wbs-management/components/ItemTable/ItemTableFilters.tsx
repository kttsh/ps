// features/wbs-management/components/ItemTable/ItemTableFilters.tsx
// 各カラムのフィルター入力を提供するコンポーネント（ドロップダウン対応版）

import React from 'react';
import type { Column } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Item } from '../../types/item';
import { fgOptions } from '../../mock/fgOptions';
import { ibsCodeOptions } from '../../mock/selectOptions';

interface ItemTableFiltersProps {
  column: Column<Item, unknown>;
}

/**
 * カラムごとのフィルターコンポーネント
 * 
 * カラムのタイプに応じて適切なフィルター入力を提供します：
 * - Function/Groupカラム: セレクトボックス（A-Zの選択肢）
 * - IBS Codeカラム: セレクトボックス（定義済み選択肢）
 * - 数量カラム: 数値入力
 * - その他（Cost Element含む）: テキスト入力
 */
export const ItemTableFilters: React.FC<ItemTableFiltersProps> = ({ column }) => {
  const columnId = column.id;
  const filterValue = column.getFilterValue();

  /**
   * Function/Groupカラム専用のセレクトフィルター
   */
  if (columnId === 'fg') {
    return (
      <Select
        value={(filterValue as string) || ''}
        onValueChange={(value) => column.setFilterValue(value === 'all' ? '' : value)}
      >
        <SelectTrigger className="h-6 text-xs px-1 rounded-sm">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          <SelectItem value="all">All</SelectItem>
          {fgOptions.map((option) => (
            <SelectItem key={option.code} value={option.code}>
              {option.code}: {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  /**
   * Cost Elementカラム専用のテキストフィルター（セレクトボックスから変更）
   */
  if (columnId === 'costElement') {
    return (
      <Input
        placeholder="Filter..."
        value={(filterValue as string) || ''}
        onChange={(e) => column.setFilterValue(e.target.value)}
        className="h-6 text-xs px-1 rounded-sm"
      />
    );
  }

  /**
   * IBS Codeカラム専用のセレクトフィルター
   */
  if (columnId === 'ibsCode') {
    return (
      <Select
        value={(filterValue as string) || ''}
        onValueChange={(value) => column.setFilterValue(value === 'all' ? '' : value)}
      >
        <SelectTrigger className="h-6 text-xs px-1 rounded-sm">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          <SelectItem value="all">All</SelectItem>
          {ibsCodeOptions.map((option) => (
            <SelectItem key={option.code} value={option.code} className="text-xs">
              {option.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  /**
   * 数量カラム専用の数値フィルター
   */
  if (columnId === 'qty') {
    return (
      <Input
        type="number"
        placeholder="Filter..."
        value={(filterValue as string) || ''}
        onChange={(e) => column.setFilterValue(e.target.value)}
        className="h-6 text-xs px-1 rounded-sm"
        min="0"
      />
    );
  }

  /**
   * その他のカラム用のテキストフィルター
   */
  return (
    <Input
      placeholder="Filter..."
      value={(filterValue as string) || ''}
      onChange={(e) => column.setFilterValue(e.target.value)}
      className="h-6 text-xs px-1 rounded-sm"
    />
  );
};