import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { PlannedModulePage } from "@/components/supply-chain/planned-module-page";

export const Route = createFileRoute("/inventory-intelligence")({
  head: () => ({ meta: [{ title: "Inventory Intelligence | Supply Chain Intelligence" }, { name: "description", content: "Explore inventory availability and health in a future Supply Chain Intelligence module." }, { property: "og:title", content: "Inventory Intelligence | Supply Chain Intelligence" }, { property: "og:description", content: "Explore inventory availability and health in a future Supply Chain Intelligence module." }] }),
  component: () => <AppShell><PlannedModulePage title="Inventory Intelligence" description="Inventory availability, coverage, and replenishment signals across your network." /></AppShell>,
});