import React, { useState, useMemo } from 'react';
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
  UserPlus,
  AlertCircle 
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

// パッケージデータの型定義
interface Package {
  PackageCode: string;
  PackageName: string;
  Vendor: PackageVendor[];
}

// 全体のベンダーマスターデータ（実際はAPIから取得）
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

// サンプルパッケージデータ
const initialPackage: Package = {
  PackageCode: "PKG-123",
  PackageName: "基盤建設プロジェクト Alpha",
  Vendor: [
    { VendorCode: "ACME-001", VendorName: "Acme Engineering Corp" },
    { VendorCode: "TSW-002", VendorName: "Tokyo Steel Works" }
  ]
};

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

// ベンダーテーブルコンポーネント
const VendorSelectionTable: React.FC<{
  vendors: Vendor[];
  selectedVendors: string[];
  onSelectionChange: (selection: Record<string, boolean>) => void;
  onAssign: () => void;
  isAssigning: boolean;
}> = ({ vendors, selectedVendors, onSelectionChange, onAssign, isAssigning }) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [globalFilter, setGlobalFilter] = useState('');

  // 選択状態が変更されたら親に通知
  React.useEffect(() => {
    onSelectionChange(rowSelection);
  }, [rowSelection, onSelectionChange]);

  // カラム定義
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
    state: { rowSelection, globalFilter },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
  });

  const selectedCount = Object.keys(rowSelection).length;

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

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {selectedCount > 0 ? `${selectedCount}件選択中` : `${vendors.length}件のベンダー`}
        </span>
        <Button
          onClick={onAssign}
          disabled={selectedCount === 0 || isAssigning}
          className="flex items-center gap-2"
        >
          <UserPlus size={16} />
          {isAssigning ? '割り当て中...' : 'ベンダー割り当て'}
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

// パッケージカードコンポーネント
const PackageCard: React.FC<{
  packageData: Package;
  onRemoveVendor: (vendorCode: string) => void;
}> = ({ packageData, onRemoveVendor }) => {
  return (
    <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-200">
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
                左のテーブルからベンダーを選択して割り当ててください
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {packageData.Vendor.map((vendor, _) => (
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
                    onClick={() => onRemoveVendor(vendor.VendorCode)}
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

// メインコンポーネント
export default function VendorAssignmentPage() {
  // 状態管理 - すべての状態を親コンポーネントで一元管理
  const [packageData, setPackageData] = useState<Package>(initialPackage);
  const [selectedVendorIds, setSelectedVendorIds] = useState<Record<string, boolean>>({});
  const [isAssigning, setIsAssigning] = useState(false);

  // 未割り当てベンダーの計算（派生状態）
  // パッケージに既に割り当てられているベンダーを除外
  const unassignedVendors = useMemo(() => {
    const assignedVendorCodes = new Set(packageData.Vendor.map(v => v.VendorCode));
    return masterVendors.filter(vendor => !assignedVendorCodes.has(vendor.VendorCode));
  }, [packageData.Vendor]);

  // 選択されたベンダーを取得
  const selectedVendors = useMemo(() => {
    const selectedIds = Object.keys(selectedVendorIds).filter(id => selectedVendorIds[id]);
    return unassignedVendors.filter(vendor => selectedIds.includes(vendor.id));
  }, [selectedVendorIds, unassignedVendors]);

  // ベンダー割り当て処理
  const handleAssignVendors = async () => {
    if (selectedVendors.length === 0) return;

    setIsAssigning(true);
    
    // 実際のシステムでは、ここでAPI呼び出しを行う
    // await assignVendorsToPackage(packageData.PackageCode, selectedVendors);
    
    // UIの応答性のため少し遅延を追加
    await new Promise(resolve => setTimeout(resolve, 500));

    // 新しいベンダーをパッケージに追加（イミュータブルな更新）
    const newVendors: PackageVendor[] = selectedVendors.map(vendor => ({
      VendorCode: vendor.VendorCode,
      VendorName: vendor.VendorName
    }));

    setPackageData(prev => ({
      ...prev,
      Vendor: [...prev.Vendor, ...newVendors]
    }));

    // 選択状態をクリア
    setSelectedVendorIds({});
    setIsAssigning(false);
  };

  // ベンダー削除処理
  const handleRemoveVendor = (vendorCode: string) => {
    // 確認ダイアログ（実際のシステムではより洗練されたモーダルを使用）
    const vendor = packageData.Vendor.find(v => v.VendorCode === vendorCode);
    if (!vendor) return;

    const confirmed = window.confirm(`${vendor.VendorName} をパッケージから削除しますか？`);
    if (!confirmed) return;

    // ベンダーを削除（イミュータブルな更新）
    setPackageData(prev => ({
      ...prev,
      Vendor: prev.Vendor.filter(v => v.VendorCode !== vendorCode)
    }));
  };

  return (
    <div className="h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* ページヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ベンダー割り当て管理
          </h1>
          <p className="text-gray-600">
            パッケージにベンダーを割り当て、プロジェクトチームを構成できます
          </p>
        </div>

        {/* メインコンテンツエリア */}
        <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
          {/* 左側: ベンダー選択テーブル */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <VendorSelectionTable
              vendors={unassignedVendors}
              selectedVendors={Object.keys(selectedVendorIds).filter(id => selectedVendorIds[id])}
              onSelectionChange={setSelectedVendorIds}
              onAssign={handleAssignVendors}
              isAssigning={isAssigning}
            />
          </div>

          {/* 右側: パッケージカード */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <PackageCard
              packageData={packageData}
              onRemoveVendor={handleRemoveVendor}
            />
          </div>
        </div>

        {/* 統計情報 */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {masterVendors.length}
            </div>
            <div className="text-sm text-gray-600">総ベンダー数</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {packageData.Vendor.length}
            </div>
            <div className="text-sm text-gray-600">割り当て済み</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {unassignedVendors.length}
            </div>
            <div className="text-sm text-gray-600">未割り当て</div>
          </div>
        </div>
      </div>
    </div>
  );
}