// features/wbs-management/components/ItemTable/index.tsx
// セル編集機能対応のアイテムテーブルコンポーネント

import React, { useRef, useState, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { flexRender } from '@tanstack/react-table';
import type { Item } from '../../types/item';
import { useItemTable } from './useItemTable';
import { ItemTableFilters } from './ItemTableFilters';
import { EditableItemTableCell } from './EditableItemTableCell';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ItemTableProps {
  data: Item[];
  className?: string;
  onDataChange?: (updatedData: Item[]) => void;
}

/**
 * ItemTableコンポーネント（セル編集機能付き）
 * 
 * 新機能:
 * - 編集モードの切り替え
 * - インラインセル編集
 * - データの保存・キャンセル機能
 * - 編集不可能なカラムの制御
 */
export const ItemTable: React.FC<ItemTableProps> = ({ 
  data, 
  className,
  onDataChange 
}) => {
  const { table, columnDefs } = useItemTable(data);
  const rows = table.getRowModel().rows;

  // 編集モードの状態管理
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingData, setEditingData] = useState<Item[]>(data);
  const [hasChanges, setHasChanges] = useState(false);

  // 仮想スクロール用のコンテナRef
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // TanStack Virtualの設定
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50, // 編集モード時は少し高めに設定
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  /**
   * 編集モードを開始
   */
  const handleStartEdit = useCallback(() => {
    setEditingData([...data]);
    setIsEditMode(true);
    setHasChanges(false);
  }, [data]);

  /**
   * 編集を保存
   */
  const handleSaveEdit = useCallback(() => {
    setIsEditMode(false);
    setHasChanges(false);
    onDataChange?.(editingData);
  }, [editingData, onDataChange]);

  /**
   * 編集をキャンセル
   */
  const handleCancelEdit = useCallback(() => {
    setEditingData([...data]);
    setIsEditMode(false);
    setHasChanges(false);
  }, [data]);

  /**
   * セルの値を更新
   */
  const handleCellChange = useCallback((
    rowIndex: number, 
    columnId: keyof Item, 
    value: string | number
  ) => {
    setEditingData(prevData => {
      const newData = [...prevData];
      const actualRowIndex = rows[rowIndex]?.original ? 
        editingData.findIndex(item => 
          item.jobNo === rows[rowIndex].original.jobNo && 
          item.itemNo === rows[rowIndex].original.itemNo
        ) : -1;
      
      if (actualRowIndex !== -1) {
        newData[actualRowIndex] = {
          ...newData[actualRowIndex],
          [columnId]: value
        };
        setHasChanges(true);
      }
      return newData;
    });
  }, [rows, editingData]);

  // 編集モード時のテーブルデータを更新
  const displayData = isEditMode ? editingData : data;
  const tableWithEditData = useItemTable(displayData);

  return (
    <div className={cn('w-full h-full flex flex-col', className)}>
      {/* 編集コントロール - 常に表示 */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Item Table</h3>
          {isEditMode && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Edit Mode
            </span>
          )}
          {hasChanges && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              Unsaved Changes
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                className="flex items-center gap-2 h-8 px-3"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="flex items-center gap-2 h-8 px-3"
                disabled={!hasChanges}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={handleStartEdit}
              className="flex items-center gap-2 h-8 px-3 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
            >
              <Edit className="w-4 h-4" />
              Edit Table
            </Button>
          )}
        </div>
      </div>

      {/* テーブルコンテナ */}
      <div 
        ref={tableContainerRef}
        className="flex-1 overflow-auto border border-gray-200 rounded-lg"
      >
        <table className="w-full">
          {/* テーブルヘッダー */}
          <thead className="sticky top-0 z-20 bg-gray-100">
            {/* カラムヘッダー行 */}
            <tr className="border-b border-gray-200">
              {tableWithEditData.table.getFlatHeaders().map((header) => {
                const column = header.column;
                const isSorted = column.getIsSorted();
                
                return (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 bg-gray-100"
                    style={{
                      width: header.getSize(),
                      minWidth: columnDefs.find(c => c.id === column.id)?.minSize,
                      maxWidth: columnDefs.find(c => c.id === column.id)?.maxSize,
                    }}
                  >
                    <button
                      className="flex items-center justify-between w-full text-left text-xs font-semibold text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded px-1 py-0.5 bg-transparent border-0"
                      onClick={column.getToggleSortingHandler()}
                      type="button"
                      disabled={isEditMode}
                      aria-label={`Sort by ${header.column.columnDef.header}`}
                    >
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      {isSorted && !isEditMode && (
                        <span className="ml-1" aria-hidden="true">
                          {isSorted === 'asc' ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
            
            {/* フィルター行（編集モード時は非表示） */}
            {!isEditMode && (
              <tr className="border-b border-gray-200">
                {tableWithEditData.table.getFlatHeaders().map((header) => (
                  <th
                    key={`filter-${header.id}`}
                    className="px-4 py-2 bg-gray-50"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.column.getCanFilter() && (
                      <ItemTableFilters column={header.column} />
                    )}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          {/* テーブルボディ */}
          <tbody>
            {/* 上部パディング */}
            {paddingTop > 0 && (
              <tr>
                <td colSpan={tableWithEditData.table.getAllColumns().length} style={{ height: paddingTop }} />
              </tr>
            )}

            {/* 仮想化された行 */}
            {virtualRows.map((virtualRow) => {
              const row = tableWithEditData.table.getRowModel().rows[virtualRow.index];
              
              return (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-gray-100 transition-colors',
                    isEditMode 
                      ? 'hover:bg-blue-50' 
                      : 'hover:bg-gray-50',
                    virtualRow.index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  )}
                  style={{
                    height: `${virtualRow.size}px`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3"
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      <EditableItemTableCell 
                        cell={cell}
                        isEditMode={isEditMode}
                        onCellChange={(value) => 
                          handleCellChange(
                            virtualRow.index, 
                            cell.column.id as keyof Item, 
                            value
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* 下部パディング */}
            {paddingBottom > 0 && (
              <tr>
                <td colSpan={tableWithEditData.table.getAllColumns().length} style={{ height: paddingBottom }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* フッター情報 */}
      <div className="flex items-center justify-between p-3 text-sm text-gray-600 border-t border-gray-200 bg-white">
        <div>
          {tableWithEditData.table.getRowModel().rows.length === 0 ? (
            'No rows to display'
          ) : (
            <>
              {tableWithEditData.table.getRowModel().rows.length === displayData.length ? (
                `Total: ${displayData.length.toLocaleString()} rows`
              ) : (
                `Filtered: ${tableWithEditData.table.getRowModel().rows.length.toLocaleString()} of ${displayData.length.toLocaleString()} rows`
              )}
              {isEditMode && hasChanges && (
                <span className="ml-2 text-yellow-600">• Unsaved changes</span>
              )}
            </>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {isEditMode ? 'Edit mode active' : 'Virtual scroll enabled'}
        </div>
      </div>
    </div>
  );
};