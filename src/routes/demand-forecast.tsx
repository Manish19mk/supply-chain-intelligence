import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { PlannedModulePage } from "@/components/supply-chain/planned-module-page";

export const Route = createFileRoute("/demand-forecast")({
  head: () => ({ meta: [{ title: "Demand & Forecast | Supply Chain Intelligence" }, { name: "description", content: "Explore demand planning and forecast accuracy in a future Supply Chain Intelligence module." }, { property: "og:title", content: "Demand & Forecast | Supply Chain Intelligence" }, { property: "og:description", content: "Explore demand planning and forecast accuracy in a future Supply Chain Intelligence module." }] }),
  component: () => <AppShell><PlannedModulePage title="Demand & Forecast" description="Demand planning, forecast accuracy, and emerging shifts across your network." /></AppShell>,
});