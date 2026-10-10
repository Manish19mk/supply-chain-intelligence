import { describe, expect, it } from "vitest";
import { calculateKpis, exceptions, filterExceptions } from "@/data/supply-chain";

describe("supply chain overview mock data", () => {
  it("shows the four specified default KPI values", () => {
    expect(calculateKpis({ dateRange: "Last 30 days", region: "All Regions", businessUnit: "All Business Units" }).map((metric) => [metric.label, metric.value, metric.change])).toEqual([
      ["On-Time Delivery", "94.2%", "+1.8%"],
      ["Fill Rate", "96.8%", "+0.6%"],
      ["Inventory Turns", "8.4x", "−0.3x"],
      ["Stockout Rate", "2.7%", "+0.4 pp"],
    ]);
  });

  it("applies region and business unit filters to the same exception records", () => {
    const result = filterExceptions(exceptions, { region: "Europe", businessUnit: "Industrial" });
    expect(result.map((record) => record.id)).toEqual(["EX-2838", "EX-2827"]);
    expect(result.every((record) => record.region === "Europe" && record.businessUnit === "Industrial")).toBe(true);
  });

  it("marks improving and worsening KPI directions appropriately", () => {
    const metrics = calculateKpis({ dateRange: "Last 30 days", region: "All Regions", businessUnit: "All Business Units" });
    expect(metrics.map((metric) => metric.positive)).toEqual([true, true, false, false]);
  });
});