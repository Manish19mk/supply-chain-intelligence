
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { SettingsDashboard } from "@/components/supply-chain/settings-dashboard";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Supply Chain Intelligence" },
      {
        name: "description",
        content:
          "Manage workspace preferences and account settings for Supply Chain Intelligence.",
      },
      { property: "og:title", content: "Settings | Supply Chain Intelligence" },
      {
        property: "og:description",
        content:
          "Manage workspace preferences and account settings for Supply Chain Intelligence.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <SettingsDashboard />
    </AppShell>
  ),
});
