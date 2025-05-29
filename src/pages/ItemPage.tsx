// pages/wbs-management/items.tsx
// 編集機能付きItemTableコンポーネントの使用例

import React, { useEffect, useState, useCallback } from 'react';
import { ItemTable } from '@/features/wbs-management/components/ItemTable';
import { generateMockItems } from '@/features/wbs-management/mock/itemData';
import type { Item } from '@/features/wbs-management/types/item';
import { Loader2, RefreshCw, Save, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * アイテム管理ページ（編集機能付き）
 * 
 * 新機能：
 * - インラインセル編集
 * - データの保存・復元
 * - 変更履歴の管理
 * - データのエクスポート/インポート（デモ用）
 */
export default function ItemPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(10000);
  const [inputValue, setInputValue] = useState('10000');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  /**
   * 指定された行数のデータを生成
   */
  const generateData = async (count: number) => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 0));
      const newItems = generateMockItems(count);
      setItems(newItems);
      setRowCount(count);
      setHasUnsavedChanges(false);
      setLastSaved(null);
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
   * テーブルデータの変更ハンドラー
   */
  const handleDataChange = useCallback((updatedData: Item[]) => {
    setItems(updatedData);
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    
    // 実際のアプリケーションでは、ここでAPIに保存
    console.log('Data saved:', updatedData.length, 'items');
    
    // デモ用：保存成功の通知
    setTimeout(() => {
      // Toast通知などを表示
    }, 100);
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
    
    if (hasUnsavedChanges) {
      const confirmed = confirm('You have unsaved changes. Generating new data will discard them. Continue?');
      if (!confirmed) return;
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
    if (hasUnsavedChanges) {
      const confirmed = confirm('You have unsaved changes. This will discard them. Continue?');
      if (!confirmed) return;
    }
    
    setInputValue(count.toString());
    generateData(count);
  };

  /**
   * データのエクスポート（デモ用）
   */
  const handleExportData = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `items-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              Enhanced editable table with always-visible filters in edit mode
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{rowCount.toLocaleString()} rows loaded</span>
              {lastSaved && (
                <span>• Last saved: {lastSaved.toLocaleTimeString()}</span>
              )}
              {hasUnsavedChanges && (
                <span className="text-yellow-600">• Unsaved changes</span>
              )}
            </div>
          </div>
          
          {/* コントロールパネル */}
          <div className="flex items-center gap-4">
            {/* データ管理ボタン */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportData}
                className="flex items-center gap-2"
                disabled={items.length === 0}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
            
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
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Editing Features:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-700">
            <div>
              <strong>Editable Columns:</strong>
              <ul className="mt-1 space-y-0.5 ml-2">
                <li>• Core Item No. (Text input)</li>
                <li>• Item No. (Text input)</li>
                <li>• Item Name (Text input)</li>
                <li>• Qty (Number input)</li>
              </ul>
            </div>
            <div>
              <strong>Dropdown Columns:</strong>
              <ul className="mt-1 space-y-0.5 ml-2">
                <li>• IBS Code (Dropdown)</li>
              </ul>
              <strong className="block mt-2">Text Filter Columns:</strong>
              <ul className="mt-1 space-y-0.5 ml-2">
                <li>• Cost Element (Text input)</li>
              </ul>
              <strong className="block mt-2">Read-only:</strong>
              <ul className="mt-1 space-y-0.5 ml-2">
                <li>• Job No. • Function/Group</li>
              </ul>
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600">
            <strong>Filter Behavior:</strong> Filters are always visible during edit mode for easier data manipulation.
          </div>
        </div>

        {/* 警告メッセージ */}
        {hasUnsavedChanges && (
          <Alert className="mt-3 border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-yellow-800">
              <strong>Warning:</strong> You have unsaved changes in the table. Make sure to save your changes before generating new data or leaving the page.
            </AlertDescription>
          </Alert>
        )}
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
          <div className="h-full">
            <ItemTable 
              data={items} 
              className="h-full"
              onDataChange={handleDataChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* 
===================================================================
セル編集機能の実装完了
===================================================================

実装された機能:
✅ 編集モードの切り替え（Edit Table / Save Changes / Cancel）
✅ インラインセル編集
✅ カラム別の編集制御：
   - 編集不可: Job No, Function/Group
   - テキスト入力: Core Item No, Item No, Item Name
   - 数値入力: Qty
   - ドロップダウン: Cost Element, IBS Code
✅ 変更の追跡とハイライト
✅ データの保存・復元機能
✅ 編集モード時のソート・フィルター無効化

使用方法:
1. "Edit Table"ボタンをクリックして編集モードに入る
2. 各セルをクリックして値を編集
3. "Save Changes"で変更を確定、"Cancel"で破棄
4. 編集中は黄色の「Unsaved Changes」表示

注意事項:
- 編集モード中はソートとフィルターが無効になります
- Job NoとFunction/Groupは読み取り専用です
- 大量データでも高パフォーマンスを維持します
*/