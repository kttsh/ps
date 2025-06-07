import VendorAssignmentPage from "@/features/wbs-management/components/VendorAssignmentPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vendor-assignment")({
	component: VendorAssignmentPage,
});
