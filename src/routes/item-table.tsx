import { ItemTable } from "@/features/wbs-management/components/ItemTable";
import { mockItems } from "@/features/wbs-management/mock/itemData";
import { createFileRoute } from "@tanstack/react-router";

function ItemTablePage() {
	return (
		<div className="h-screen p-6">
			<ItemTable
				data={mockItems}
				className="h-full"
				onDataChange={(updatedData) => {
					console.log("Data updated:", updatedData);
				}}
			/>
		</div>
	);
}

export const Route = createFileRoute("/item-table")({
	component: ItemTablePage,
});
