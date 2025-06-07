import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="min-h-screen bg-gray-50">
				<nav className="bg-white border-b border-gray-200 shadow-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center h-16">
							<div className="flex items-center">
								<Link to="/" className="text-xl font-bold text-gray-900">
									PS
								</Link>
							</div>
							<div className="flex space-x-8">
								<Link
									to="/"
									className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium [&.active]:text-blue-600 [&.active]:bg-blue-50"
								>
									Home
								</Link>
								<Link
									to="/vendor-assignment"
									className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium [&.active]:text-blue-600 [&.active]:bg-blue-50"
								>
									Vendor Assignment
								</Link>
								<Link
									to="/item-table"
									className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium [&.active]:text-blue-600 [&.active]:bg-blue-50"
								>
									Item Table
								</Link>
								<Link
									to="/yip-item-table"
									className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium [&.active]:text-blue-600 [&.active]:bg-blue-50"
								>
									YIP Item Table
								</Link>
							</div>
						</div>
					</div>
				</nav>
				<div className="flex-1">
					<Outlet />
				</div>
			</div>
			<TanStackRouterDevtools />
		</>
	),
});
