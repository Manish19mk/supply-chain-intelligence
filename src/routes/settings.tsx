import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { PlannedModulePage } from "@/components/supply-chain/planned-module-page";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings | Supply Chain Intelligence" }, { name: "description", content: "Workspace preferences for the Supply Chain Intelligence prototype." }, { property: "og:title", content: "Settings | Supply Chain Intelligence" }, { property: "og:description", content: "Workspace preferences for the Supply Chain Intelligence prototype." }] }),
  component: () => <AppShell><PlannedModulePage title="Settings" description="Workspace preferences and account settings for Supply Chain Intelligence." /></AppShell>,
});