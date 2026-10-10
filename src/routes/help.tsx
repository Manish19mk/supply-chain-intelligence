import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { PlannedModulePage } from "@/components/supply-chain/planned-module-page";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help & Support | Supply Chain Intelligence" }, { name: "description", content: "Help resources for the Supply Chain Intelligence workspace prototype." }, { property: "og:title", content: "Help & Support | Supply Chain Intelligence" }, { property: "og:description", content: "Help resources for the Supply Chain Intelligence workspace prototype." }] }),
  component: () => <AppShell><PlannedModulePage title="Help & Support" description="Guides and support resources for planning and operations teams." /></AppShell>,
});