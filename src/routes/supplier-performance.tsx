
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { SupplierPerformanceDashboard } from "@/components/supply-chain/supplier-performance-dashboard";

export const Route = createFileRoute("/supplier-performance")({
  head: () => ({
    meta: [
      { title: "Supplier Performance | Supply Chain Intelligence" },
      {
        name: "description",
        content:
          "Monitor supplier delivery reliability, quality, lead times, and sourcing risks.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <SupplierPerformanceDashboard />
    </AppShell>
  ),
});
