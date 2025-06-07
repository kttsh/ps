import YipItemTable from "@/features/wbs-management/components/YipItemTable";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/yip-item-table")({
	component: YipItemTable,
});
