
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { HelpSupportDashboard } from "@/components/supply-chain/help-support-dashboard";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support | Supply Chain Intelligence" },
      {
        name: "description",
        content:
          "Find help articles, browse FAQs, and manage support requests.",
      },
      {
        property: "og:title",
        content: "Help & Support | Supply Chain Intelligence",
      },
      {
        property: "og:description",
        content:
          "Find help articles, browse FAQs, and manage support requests.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <HelpSupportDashboard />
    </AppShell>
  ),
});
