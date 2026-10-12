import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { ReportsDashboard } from "@/components/supply-chain/reports-dashboard";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports | Supply Chain Intelligence" },
      {
        name: "description",
        content:
          "Access, generate, and manage supply chain reports and exports.",
      },
      { property: "og:title", content: "Reports | Supply Chain Intelligence" },
      {
        property: "og:description",
        content:
          "Access, generate, and manage supply chain reports and exports.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <ReportsDashboard />
    </AppShell>
  ),
});
