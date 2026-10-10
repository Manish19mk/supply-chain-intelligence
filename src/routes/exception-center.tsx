import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { PlannedModulePage } from "@/components/supply-chain/planned-module-page";

export const Route = createFileRoute("/exception-center")({
  head: () => ({ meta: [{ title: "Exception Center | Supply Chain Intelligence" }, { name: "description", content: "Explore a dedicated supply-chain exception workflow in a future module." }, { property: "og:title", content: "Exception Center | Supply Chain Intelligence" }, { property: "og:description", content: "Explore a dedicated supply-chain exception workflow in a future module." }] }),
  component: () => <AppShell><PlannedModulePage title="Exception Center" description="A dedicated queue for triaging, assigning, and resolving supply-chain exceptions." /></AppShell>,
});