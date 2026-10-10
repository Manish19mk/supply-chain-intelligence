import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { PlannedModulePage } from "@/components/supply-chain/planned-module-page";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports | Supply Chain Intelligence" }, { name: "description", content: "Explore supply-chain reporting and analytics exports in a future module." }, { property: "og:title", content: "Reports | Supply Chain Intelligence" }, { property: "og:description", content: "Explore supply-chain reporting and analytics exports in a future module." }] }),
  component: () => <AppShell><PlannedModulePage title="Reports" description="Shareable operational reports and recurring network performance summaries." /></AppShell>,
});