
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/supply-chain/app-shell";
import { MyProfileDashboard } from "@/components/supply-chain/my-profile-dashboard";

export const Route = createFileRoute("/my-profile")({
  head: () => ({
    meta: [
      { title: "My Profile | Supply Chain Intelligence" },
      {
        name: "description",
        content: "View and manage your workspace profile.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <MyProfileDashboard />
    </AppShell>
  ),
});
