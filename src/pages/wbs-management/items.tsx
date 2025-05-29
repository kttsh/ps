// pages/wbs-management/items.tsx
// ItemTableコンポーネントの使用例（更新版）

import React, { useEffect, useState } from 'react';
import { ItemTable } from '@/features/wbs-management/components/ItemTable';
import { generateMockItems } from '@/features/wbs-management/mock/itemData';
import type { Item } from '@/features/wbs-management/types/item';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * アイテム管理ページ（更新版）
 * 
 * 新機能：
 * - IBS CodeとCost Elementのドロップダウンフィルター
 * - 改善されたテーブルスタイリング（グレーヘッダー、縦線なし）
 * - コード + ラベル表示
 */
export default function ItemPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(10000);
  const [inputValue, setInputValue] = useState('10000');
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * 指定された行数のデータを生成
   */
  const generateData = async (count: number) => {
    setIsGenerating(true);
    try {
      // 大量データ生成時のUIブロッキングを防ぐため、非同期で処理
      await new Promise(resolve => setTimeout(resolve, 0));
      const newItems = generateMockItems(count);
      setItems(newItems);
      setRowCount(count);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * 初期データのロード
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        await generateData(10000);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  /**
   * 行数変更ハンドラー
   */
  const handleRowCountChange = async () => {
    const count = parseInt(inputValue);
    if (isNaN(count) || count < 0) {
      alert('Please enter a valid positive number');
      return;
    }
    if (count > 1000000) {
      const confirmed = confirm('Generating over 1 million rows may affect performance. Continue?');
      if (!confirmed) return;
    }
    await generateData(count);
  };

  /**
   * プリセットボタンのクリックハンドラー
   */
  const handlePresetClick = (count: number) => {
    setInputValue(count.toString());
    generateData(count);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading initial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* ページヘッダー */}
      <div className="px-6 py-4 border-b bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Item Management</h1>
            <p className="text-gray-600 mt-1">
              Enhanced table with dropdown filters for Cost Element and IBS Code
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {rowCount.toLocaleString()} rows loaded
            </p>
          </div>
          
          {/* 行数変更コントロール */}
          <div className="flex items-center gap-4">
            {/* プリセットボタン */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePresetClick(1000)}
                disabled={isGenerating}
              >
                1K
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePresetClick(10000)}
                disabled={isGenerating}
              >
                10K
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePresetClick(100000)}
                disabled={isGenerating}
              >
                100K
              </Button>
            </div>
            
            {/* カスタム行数入力 */}
            <div className="flex items-center gap-2">
              <Label htmlFor="rowCount" className="text-sm whitespace-nowrap">
                Rows:
              </Label>
              <Input
                id="rowCount"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-24 h-8"
                min="0"
                max="1000000"
                disabled={isGenerating}
              />
              <Button
                size="sm"
                onClick={handleRowCountChange}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 機能説明 */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">New Features:</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>Dropdown Filters:</strong> Cost Element and IBS Code columns now have dropdown filters</li>
            <li>• <strong>Enhanced Display:</strong> Codes show with descriptive labels</li>
            <li>• <strong>Improved Styling:</strong> Gray headers, no vertical lines, clean row separators</li>
            <li>• <strong>Better UX:</strong> Hover effects and consistent spacing</li>
          </ul>
        </div>
      </div>

      {/* ItemTableコンポーネント */}
      <div className="flex-1 p-6 overflow-hidden">
        {isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">
                Generating {parseInt(inputValue).toLocaleString()} rows...
              </p>
            </div>
          </div>
        ) : (
          <ItemTable data={items} className="h-full" />
        )}
      </div>
    </div>
  );
}

/* 
===================================================================
必要なファイル構成の更新
===================================================================

新しく追加するファイル:
1. features/wbs-management/mock/selectOptions.ts - Cost ElementとIBS Codeの選択肢

更新するファイル:
1. features/wbs-management/components/ItemTable/ItemTableFilters.tsx - ドロップダウン追加
2. features/wbs-management/components/ItemTable/index.tsx - スタイリング更新
3. features/wbs-management/components/ItemTable/ItemTableCell.tsx - 表示改善

主な変更点:
- IBS CodeとCost Elementにドロップダウンフィルターを追加
- テーブルヘッダーを灰色背景に変更
- 縦線（border-r）を削除
- 行間の境界線をより見やすく調整
- コード + 説明ラベルの表示を実装
*/