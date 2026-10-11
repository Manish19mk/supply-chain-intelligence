import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { InventoryDashboard } from "@/components/supply-chain/inventory-dashboard";

export const Route = createFileRoute("/inventory-intelligence")({
  head: () => ({
    meta: [
      {
        title: "Inventory Intelligence | Supply Chain Intelligence",
      },
      {
        name: "description",
        content:
          "Monitor inventory availability, stock health, coverage, and replenishment risks across your supply chain.",
      },
    ],
  }),
  component: InventoryIntelligencePage,
});

function InventoryIntelligencePage() {
  return (
    <AppShell>
      <InventoryDashboard />
    </AppShell>
  );
}
