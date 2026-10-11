import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { DemandForecastDashboard } from "@/components/supply-chain/demand-forecast-dashboard";

export const Route = createFileRoute("/demand-forecast")({
  head: () => ({
    meta: [
      { title: "Demand & Forecast | Supply Chain Intelligence" },
      {
        name: "description",
        content:
          "Explore demand planning, forecast accuracy, and demand shifts across your supply chain.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <DemandForecastDashboard />
    </AppShell>
  ),
});
