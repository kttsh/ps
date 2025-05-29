// features/wbs-management/components/ItemTable/index.tsx
// セル編集機能対応のアイテムテーブルコンポーネント（完全版）

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { flexRender } from '@tanstack/react-table';
import type { Item } from '../../types/item';
import { useItemTable } from './useItemTable';
import { ItemTableFilters } from './ItemTableFilters';
import { EditableItemTableCell } from './EditableItemTableCell';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Edit, Save, X, Filter } from 'lucide-react';
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
 * - フィルタ表示切り替え（編集モード時は常に表示）
 * - コンパクトなUI設計
 * - Cost Elementフィルタ: テキスト入力対応
 */
export const ItemTable: React.FC<ItemTableProps> = ({ 
  data, 
  className,
  onDataChange 
}) => {
  const { table, columnDefs } = useItemTable(data);

  // 編集モードの状態管理
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingData, setEditingData] = useState<Item[]>(data);
  const [hasChanges, setHasChanges] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // 仮想スクロール用のコンテナRef
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 編集モード時のテーブルデータを更新
  const displayData = isEditMode ? editingData : data;
  const tableWithEditData = useItemTable(displayData);
  const tableRows = tableWithEditData.table.getRowModel().rows;

  // TanStack Virtualの設定
  const rowVirtualizer = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 40, // コンパクトなサイズに調整
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  // データが変更された場合に編集データを同期
  useEffect(() => {
    if (!isEditMode) {
      setEditingData([...data]);
    }
  }, [data, isEditMode]);

  /**
   * 編集モードを開始
   */
  const handleStartEdit = useCallback(() => {
    setEditingData([...data]);
    setIsEditMode(true);
    setHasChanges(false);
    // 編集モード時は必ずフィルタを表示
    setShowFilters(true);
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
      const row = tableRows[rowIndex];
      
      if (row?.original) {
        // 元のデータ配列での正しいインデックスを見つける
        const actualRowIndex = newData.findIndex(item => 
          item.jobNo === row.original.jobNo && 
          item.itemNo === row.original.itemNo &&
          item.coreItemNo === row.original.coreItemNo
        );
        
        if (actualRowIndex !== -1) {
          newData[actualRowIndex] = {
            ...newData[actualRowIndex],
            [columnId]: value
          };
          setHasChanges(true);
        }
      }
      return newData;
    });
  }, [tableRows]);

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
          {/* フィルタ切り替えボタン（編集モード時は常に表示、無効化） */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 h-8 px-3",
              showFilters || isEditMode ? "bg-gray-100 text-gray-700" : "bg-white text-gray-500"
            )}
            disabled={isEditMode} // 編集モード時は無効化（常に表示のため）
            title={isEditMode ? "Filters are always visible in edit mode" : "Toggle filter visibility"}
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          
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
          <thead className="sticky top-0 z-20 bg-gray-100 border-b border-gray-200">
            {/* カラムヘッダー行 */}
            <tr>
              {tableWithEditData.table.getFlatHeaders().map((header) => {
                const column = header.column;
                const isSorted = column.getIsSorted();
                
                return (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 bg-gray-100"
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
                      <span className="text-xs">{flexRender(header.column.columnDef.header, header.getContext())}</span>
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
            
            {/* フィルター行（編集モード時は常に表示、非編集時は切り替え可能） */}
            {(showFilters || isEditMode) && (
              <tr className="border-t border-gray-200">
                {tableWithEditData.table.getFlatHeaders().map((header) => (
                  <th
                    key={`filter-${header.id}`}
                    className="px-3 py-1 bg-gray-50"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.column.getCanFilter() && (
                      <ItemTableFilters column={header.column as import('@tanstack/react-table').Column<Item, Item[keyof Item]>} />
                    )}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          {/* テーブルボディ */}
          <tbody>
            {/* 上部パディング（仮想スクロール用） */}
            {paddingTop > 0 && (
              <tr>
                <td colSpan={tableWithEditData.table.getAllColumns().length} style={{ height: paddingTop }} />
              </tr>
            )}

            {/* 仮想化された行 */}
            {virtualRows.map((virtualRow) => {
              const row = tableRows[virtualRow.index];
              
              // 行が存在しない場合はスキップ
              if (!row) {
                return null;
              }
              
              return (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-gray-100 transition-colors bg-white',
                    isEditMode 
                      ? 'hover:bg-blue-50' 
                      : 'hover:bg-gray-50'
                  )}
                  style={{
                    height: `${virtualRow.size}px`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3 py-2"
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

            {/* 下部パディング（仮想スクロール用） */}
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
          {tableRows.length === 0 ? (
            'No rows to display'
          ) : (
            <>
              {tableRows.length === displayData.length ? (
                `Total: ${displayData.length.toLocaleString()} rows`
              ) : (
                `Filtered: ${tableRows.length.toLocaleString()} of ${displayData.length.toLocaleString()} rows`
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