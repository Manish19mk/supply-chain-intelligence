
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { LogisticsPerformanceDashboard } from "@/components/supply-chain/logistics-performance-dashboard";

export const Route = createFileRoute("/logistics-performance")({
  head: () => ({
    meta: [
      { title: "Logistics Performance | Supply Chain Intelligence" },
      {
        name: "description",
        content:
          "Monitor carrier reliability, shipment transit times, freight spend, and delivery exceptions.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <LogisticsPerformanceDashboard />
    </AppShell>
  ),
});
