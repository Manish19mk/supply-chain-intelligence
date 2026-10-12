import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { ExceptionCenterDashboard } from "@/components/supply-chain/exception-center-dashboard";

export const Route = createFileRoute("/exception-center")({
  head: () => ({
    meta: [
      { title: "Exception Center | Supply Chain Intelligence" },
      {
        name: "description",
        content:
          "Monitor, investigate, assign, and resolve supply chain exceptions.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <ExceptionCenterDashboard />
    </AppShell>
  ),
});
