import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { PlannedModulePage } from "@/components/supply-chain/planned-module-page";

export const Route = createFileRoute("/logistics-performance")({
  head: () => ({ meta: [{ title: "Logistics Performance | Supply Chain Intelligence" }, { name: "description", content: "Explore carrier, lane, and delivery performance in a future Supply Chain Intelligence module." }, { property: "og:title", content: "Logistics Performance | Supply Chain Intelligence" }, { property: "og:description", content: "Explore carrier, lane, and delivery performance in a future Supply Chain Intelligence module." }] }),
  component: () => <AppShell><PlannedModulePage title="Logistics Performance" description="Carrier performance, network lanes, and inbound and outbound delivery visibility." /></AppShell>,
});