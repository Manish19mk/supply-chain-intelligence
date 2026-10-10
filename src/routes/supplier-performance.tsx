import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { PlannedModulePage } from "@/components/supply-chain/planned-module-page";

export const Route = createFileRoute("/supplier-performance")({
  head: () => ({ meta: [{ title: "Supplier Performance | Supply Chain Intelligence" }, { name: "description", content: "Explore supplier reliability and delivery performance in a future Supply Chain Intelligence module." }, { property: "og:title", content: "Supplier Performance | Supply Chain Intelligence" }, { property: "og:description", content: "Explore supplier reliability and delivery performance in a future Supply Chain Intelligence module." }] }),
  component: () => <AppShell><PlannedModulePage title="Supplier Performance" description="Supplier reliability, shipment performance, and delivery risks across sourcing partners." /></AppShell>,
});