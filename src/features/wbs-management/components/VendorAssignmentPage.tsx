import React, { useState, useMemo, useCallback } from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Search, 
  Building2, 
  Users, 
  ArrowRight, 
  Trash2, 
  Package, 
  AlertCircle,
  Radio,
} from 'lucide-react';

// ベンダーデータの型定義
interface Vendor {
  id: string;
  VendorCode: string;
  VendorName: string;
  country: string;
  type: 'Supplier' | 'Contractor' | 'Consultant';
  status: 'Active' | 'Inactive' | 'Pending';
}

// パッケージ内のベンダー型定義
interface PackageVendor {
  VendorCode: string;
  VendorName: string;
}

// パッケージデータの型定義（選択機能は不要になったのでidのみ保持）
interface Package {
  id: string;
  PackageCode: string;
  PackageName: string;
  Vendor: PackageVendor[];
}

// 全体のベンダーマスターデータ
const masterVendors: Vendor[] = [
  { id: '1', VendorCode: 'ACME-001', VendorName: 'Acme Engineering Corp', country: 'USA', type: 'Contractor', status: 'Active' },
  { id: '2', VendorCode: 'TSW-002', VendorName: 'Tokyo Steel Works', country: 'Japan', type: 'Supplier', status: 'Active' },
  { id: '3', VendorCode: 'NORDIC-003', VendorName: 'Nordic Construction AB', country: 'Sweden', type: 'Contractor', status: 'Active' },
  { id: '4', VendorCode: 'GCL-004', VendorName: 'Global Consulting Ltd', country: 'UK', type: 'Consultant', status: 'Pending' },
  { id: '5', VendorCode: 'PPI-005', VendorName: 'Precision Parts Inc', country: 'Germany', type: 'Supplier', status: 'Active' },
  { id: '6', VendorCode: 'APB-006', VendorName: 'Asia Pacific Builders', country: 'Singapore', type: 'Contractor', status: 'Active' },
  { id: '7', VendorCode: 'EMG-007', VendorName: 'Euro Materials Group', country: 'France', type: 'Supplier', status: 'Active' },
  { id: '8', VendorCode: 'AMS-008', VendorName: 'Australian Mining Services', country: 'Australia', type: 'Consultant', status: 'Active' },
  { id: '9', VendorCode: 'CIS-009', VendorName: 'Canadian Industrial Solutions', country: 'Canada', type: 'Supplier', status: 'Active' },
  { id: '10', VendorCode: 'BEP-010', VendorName: 'Brazilian Engineering Partners', country: 'Brazil', type: 'Contractor', status: 'Active' },
];

// 複数のサンプルパッケージデータ
const initialPackages: Package[] = [
  {
    id: '1',
    PackageCode: "PKG-123",
    PackageName: "基盤建設プロジェクト Alpha",
    Vendor: [
      { VendorCode: "ACME-001", VendorName: "Acme Engineering Corp" },
      { VendorCode: "TSW-002", VendorName: "Tokyo Steel Works" }
    ]
  },
  {
    id: '2',
    PackageCode: "PKG-456",
    PackageName: "インフラ整備プロジェクト Beta",
    Vendor: [
      { VendorCode: "NORDIC-003", VendorName: "Nordic Construction AB" }
    ]
  },
  {
    id: '3',
    PackageCode: "PKG-789",
    PackageName: "設備導入プロジェクト Gamma",
    Vendor: []
  }
];

// 不確定状態対応のチェックボックス
const IndeterminateCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  { 
    checked: boolean; 
    indeterminate?: boolean; 
    onCheckedChange: (value: boolean | 'indeterminate') => void;
  }
>(({ checked, indeterminate, onCheckedChange, ...rest }, ref) => (
  <Checkbox 
    ref={ref} 
    checked={indeterminate ? 'indeterminate' : checked} 
    onCheckedChange={onCheckedChange}
    className="h-4 w-4" 
    {...rest} 
  />
));
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';

// ベンダーテーブルコンポーネント - 全パッケージ割り当て対応
const VendorSelectionTable: React.FC<{
  vendors: Vendor[];
  selectedVendorIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onAssignToAllPackages: (selectedVendors: Vendor[]) => void; // 名前を変更して意図を明確化
  isAssigning: boolean;
}> = ({ vendors, selectedVendorIds, onSelectionChange, onAssignToAllPackages, isAssigning }) => {
  const [globalFilter, setGlobalFilter] = useState('');

  // TanStack Tableの行選択状態を、親から受け取った選択状態で初期化
  const rowSelection = useMemo(() => {
    const selection: Record<string, boolean> = {};
    selectedVendorIds.forEach(id => {
      const vendorIndex = vendors.findIndex(v => v.id === id);
      if (vendorIndex !== -1) {
        selection[vendorIndex.toString()] = true;
      }
    });
    return selection;
  }, [selectedVendorIds, vendors]);

  // 行選択状態が変更された時の処理
  const handleRowSelectionChange = useCallback((updatedSelection: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => {
    const newSelection = typeof updatedSelection === 'function' 
      ? updatedSelection(rowSelection) 
      : updatedSelection;
    
    // 選択されたインデックスから実際のベンダーIDを取得
    const selectedIds = Object.keys(newSelection)
      .filter(key => newSelection[key])
      .map(index => vendors[parseInt(index)]?.id)
      .filter(Boolean);

    onSelectionChange(selectedIds);
  }, [vendors, onSelectionChange, rowSelection]);

  // 全パッケージへの割り当てボタンクリック時の処理
  const handleAssignToAll = useCallback(() => {
    const selectedVendors = vendors.filter(vendor => selectedVendorIds.includes(vendor.id));
    onAssignToAllPackages(selectedVendors);
  }, [vendors, selectedVendorIds, onAssignToAllPackages]);

  // カラム定義（変更なし）
  const columns = useMemo<ColumnDef<Vendor>[]>(
    () => [
      {
        id: 'select',
        size: 50,
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <IndeterminateCheckbox
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={table.getIsSomePageRowsSelected()}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <IndeterminateCheckbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'VendorName',
        header: 'ベンダー名',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <Building2 size={14} className="text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm">{row.original.VendorName}</div>
              <div className="text-xs text-gray-500 font-mono">{row.original.VendorCode}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'country',
        header: '国',
        size: 80,
        cell: ({ row }) => (
          <span className="text-gray-700 text-sm">{row.original.country}</span>
        ),
      },
      {
        accessorKey: 'type',
        header: 'タイプ',
        size: 100,
        cell: ({ row }) => {
          const typeColors = {
            'Supplier': 'bg-blue-100 text-blue-800',
            'Contractor': 'bg-purple-100 text-purple-800',
            'Consultant': 'bg-indigo-100 text-indigo-800'
          };
          return (
            <Badge 
              variant="outline" 
              className={`text-xs ${typeColors[row.original.type]}`}
            >
              {row.original.type}
            </Badge>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: vendors,
    columns,
    state: { 
      rowSelection,
      globalFilter 
    },
    enableRowSelection: true,
    onRowSelectionChange: handleRowSelectionChange,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
  });

  const selectedCount = selectedVendorIds.length;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Users size={20} />
          未割り当てベンダー
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ベンダー名で検索..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                  row.getIsSelected() ? 'bg-blue-50' : ''
                }`}
                onClick={() => row.toggleSelected()}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 全パッケージ割り当てボタン - より明確なUIとメッセージ */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {selectedCount > 0 ? (
            <div className="flex items-center gap-2">
              <span>{selectedCount}件選択中</span>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                全パッケージに一括割り当て
              </Badge>
            </div>
          ) : (
            `${vendors.length}件のベンダー`
          )}
        </div>
        <Button
          onClick={handleAssignToAll}
          disabled={selectedCount === 0 || isAssigning}
          className="flex items-center gap-2"
          size="default"
        >
          <Radio size={16} />
          {isAssigning ? '割り当て中...' : `全パッケージに割り当て (${selectedCount}件)`}
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

// パッケージカードコンポーネント - 選択機能を削除し表示専用に
const PackageCard: React.FC<{
  packageData: Package;
  onRemoveVendor: (packageId: string, vendorCode: string) => void;
}> = ({ packageData, onRemoveVendor }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Package size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {packageData.PackageName}
            </h3>
            <p className="text-sm text-gray-500 font-mono">
              {packageData.PackageCode}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Building2 size={16} />
            割り当てベンダー ({packageData.Vendor.length}件)
          </h4>
          
          {packageData.Vendor.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">まだベンダーが割り当てられていません</p>
              <p className="text-xs text-gray-400 mt-1">
                左のテーブルからベンダーを選択して一括割り当てしてください
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {packageData.Vendor.map((vendor, index) => (
                <div
                  key={vendor.VendorCode}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Building2 size={14} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {vendor.VendorName}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {vendor.VendorCode}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveVendor(packageData.id, vendor.VendorCode)}
                    className="p-1 rounded-full hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
                    title="ベンダーを削除"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// メインコンポーネント - パッケージ選択機能を削除し、全パッケージ一括割り当て対応
export default function VendorAssignmentPage() {
  // 状態管理を簡素化：パッケージ選択関連の状態を削除
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  // 全パッケージに割り当て済みのベンダーコードを集計
  const allAssignedVendorCodes = useMemo(() => {
    const codes = new Set<string>();
    packages.forEach(pkg => {
      pkg.Vendor.forEach(vendor => {
        codes.add(vendor.VendorCode);
      });
    });
    return codes;
  }, [packages]);

  // 未割り当てベンダーの計算（すべてのパッケージを考慮）
  const unassignedVendors = useMemo(() => {
    return masterVendors.filter(vendor => !allAssignedVendorCodes.has(vendor.VendorCode));
  }, [allAssignedVendorCodes]);

  // 全パッケージへのベンダー割り当て処理 - これが今回の核心機能
  const handleAssignToAllPackages = useCallback(async (selectedVendors: Vendor[]) => {
    if (selectedVendors.length === 0) return;

    setIsAssigning(true);
    
    try {
      // 実際のシステムでは、ここで全パッケージへの一括割り当てAPI呼び出しを行う
      // await bulkAssignVendorsToAllPackages(selectedVendors);
      
      // UIの応答性とわかりやすさのため、少し長めの遅延を追加
      await new Promise(resolve => setTimeout(resolve, 1200));

      // 選択されたベンダーを、すべてのパッケージに追加
      const newVendors: PackageVendor[] = selectedVendors.map(vendor => ({
        VendorCode: vendor.VendorCode,
        VendorName: vendor.VendorName
      }));

      // 各パッケージに新しいベンダーを追加（イミュータブルな更新）
      setPackages(prevPackages => 
        prevPackages.map(pkg => ({
          ...pkg,
          Vendor: [...pkg.Vendor, ...newVendors]
        }))
      );

      // 選択状態をクリア
      setSelectedVendorIds([]);
      
    } catch (error) {
      console.error('ベンダー一括割り当てエラー:', error);
      alert(`ベンダーの一括割り当てに失敗しました。もう一度お試しください。\nエラー詳細: ${error}`);
    } finally {
      setIsAssigning(false);
    }
  }, []); // 依存配列を空にして、関数の再生成を最小限に

  // ベンダー削除処理（変更なし）
  const handleRemoveVendor = useCallback((packageId: string, vendorCode: string) => {
    const targetPackage = packages.find(pkg => pkg.id === packageId);
    if (!targetPackage) return;
    const vendor = targetPackage.Vendor.find(v => v.VendorCode === vendorCode);
    
    if (!vendor) return;

    const confirmed = window.confirm(`${vendor.VendorName} を${targetPackage.PackageName}から削除しますか？`);
    if (!confirmed) return;

    setPackages(prevPackages =>
      prevPackages.map(pkg =>
        pkg.id === packageId
          ? { ...pkg, Vendor: pkg.Vendor.filter(v => v.VendorCode !== vendorCode) }
          : pkg
      )
    );
  }, [packages]);

  // 統計情報の計算
  const stats = useMemo(() => {
    const totalAssigned = packages.reduce((sum, pkg) => sum + pkg.Vendor.length, 0);
    const uniqueAssignedCount = allAssignedVendorCodes.size;
    return {
      totalVendors: masterVendors.length,
      totalAssigned, // 延べ割り当て数（重複含む）
      uniqueAssignedCount, // ユニークな割り当てベンダー数
      totalUnassigned: masterVendors.length - uniqueAssignedCount,
      totalPackages: packages.length,
      averageVendorsPerPackage: packages.length > 0 ? (totalAssigned / packages.length).toFixed(1) : '0'
    };
  }, [packages, allAssignedVendorCodes.size]);

  return (
    <div className="h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* ページヘッダー - 説明文を更新 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ベンダー一括割り当て管理
          </h1>
          <p className="text-gray-600">
            選択したベンダーを全てのパッケージに一括で割り当てできます。効率的なプロジェクトチーム構成を支援します。
          </p>
        </div>

        {/* メインコンテンツエリア */}
        <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
          {/* 左側: ベンダー選択テーブル */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <VendorSelectionTable
              vendors={unassignedVendors}
              selectedVendorIds={selectedVendorIds}
              onSelectionChange={setSelectedVendorIds}
              onAssignToAllPackages={handleAssignToAllPackages}
              isAssigning={isAssigning}
            />
          </div>

          {/* 右側: パッケージカード一覧（選択機能なし） */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-full flex flex-col">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={20} />
                プロジェクトパッケージ一覧
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                  全パッケージ対象
                </Badge>
              </h2>
              
              <div className="flex-1 space-y-4 overflow-y-auto">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    packageData={pkg}
                    onRemoveVendor={handleRemoveVendor}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 統計情報 - より詳細な情報を追加 */}
        <div className="mt-6 grid grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalVendors}
            </div>
            <div className="text-sm text-gray-600">総ベンダー数</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.totalAssigned}
            </div>
            <div className="text-sm text-gray-600">延べ割り当て数</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalUnassigned}
            </div>
            <div className="text-sm text-gray-600">未割り当て</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalPackages}
            </div>
            <div className="text-sm text-gray-600">パッケージ数</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.averageVendorsPerPackage}
            </div>
            <div className="text-sm text-gray-600">平均割り当て数</div>
          </div>
        </div>
      </div>
    </div>
  );
}