import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/supply-chain/app-shell";
import { OverviewDashboard } from "@/components/supply-chain/overview-dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Supply Chain Overview | Supply Chain Intelligence" },
      { name: "description", content: "Monitor network performance, identify supply chain risks, and prioritize operational action." },
      { property: "og:title", content: "Supply Chain Overview | Supply Chain Intelligence" },
      { property: "og:description", content: "Monitor network performance, identify supply chain risks, and prioritize operational action." },
    ],
  }),
  component: Index,
});

function Index() {
  const [globalSearch, setGlobalSearch] = useState("");
  return <AppShell onGlobalSearch={setGlobalSearch}><OverviewDashboard globalSearch={globalSearch} onGlobalSearch={setGlobalSearch} /></AppShell>;
}
