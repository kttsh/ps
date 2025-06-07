import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Home, Package, Users } from "lucide-react";

function HomePage() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					PS Management System
				</h1>
				<p className="text-lg text-gray-600">
					WBS管理とベンダー割り当てのためのシステム
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
				{/* Vendor Assignment Card */}
				<Card className="hover:shadow-lg transition-shadow duration-200">
					<CardHeader className="pb-4">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
								<Users size={24} className="text-white" />
							</div>
							<div>
								<h2 className="text-xl font-semibold text-gray-900">
									Vendor Assignment
								</h2>
								<p className="text-sm text-gray-600">AIP生成とベンダー管理</p>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600 mb-4">
							PIPごとのベンダー割り当てと管理を行います。複数のベンダーを効率的に配置し、プロジェクトの進行をスムーズにします。
						</p>
						<Link to="/vendor-assignment">
							<Button className="w-full">Open Vendor Assignment</Button>
						</Link>
					</CardContent>
				</Card>

				{/* Item Table Card */}
				<Card className="hover:shadow-lg transition-shadow duration-200">
					<CardHeader className="pb-4">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
								<Package size={24} className="text-white" />
							</div>
							<div>
								<h2 className="text-xl font-semibold text-gray-900">
									Item Table
								</h2>
								<p className="text-sm text-gray-600">
									アイテム管理とテーブル表示
								</p>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600 mb-4">
							プロジェクトアイテムの詳細管理を行います。仮想化されたテーブルで大量のデータを効率的に表示・編集できます。
						</p>
						<Link to="/item-table">
							<Button className="w-full" variant="outline">
								Open Item Table
							</Button>
						</Link>
					</CardContent>
				</Card>

				{/* YIP Item Table Card */}
				<Card className="hover:shadow-lg transition-shadow duration-200">
					<CardHeader className="pb-4">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
								<Package size={24} className="text-white" />
							</div>
							<div>
								<h2 className="text-xl font-semibold text-gray-900">
									YIP Item Table
								</h2>
								<p className="text-sm text-gray-600">YIP管理とアイテム表示</p>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600 mb-4">
							YIPごとのアイテム管理を行います。階層構造でYIPとその配下アイテムを効率的に表示・管理できます。
						</p>
						<Link to="/yip-item-table">
							<Button className="w-full" variant="secondary">
								Open YIP Item Table
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>

			{/* Quick Stats Section */}
			<div className="mt-12">
				<h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
					システム概要
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
					<div className="text-center p-4 bg-white rounded-lg shadow-sm">
						<div className="w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
							<Home size={16} className="text-blue-600" />
						</div>
						<div className="text-sm font-medium text-gray-900">統合管理</div>
						<div className="text-xs text-gray-600">すべての機能を一元管理</div>
					</div>
					<div className="text-center p-4 bg-white rounded-lg shadow-sm">
						<div className="w-8 h-8 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
							<Users size={16} className="text-green-600" />
						</div>
						<div className="text-sm font-medium text-gray-900">
							効率的な配置
						</div>
						<div className="text-xs text-gray-600">ベンダーの最適配置</div>
					</div>
					<div className="text-center p-4 bg-white rounded-lg shadow-sm">
						<div className="w-8 h-8 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
							<Package size={16} className="text-purple-600" />
						</div>
						<div className="text-sm font-medium text-gray-900">高速処理</div>
						<div className="text-xs text-gray-600">仮想化による高速表示</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
