import { describe, expect, it } from "vitest";
import { calculateKpis, exceptions, filterExceptions, getDeliveryTrend } from "@/data/supply-chain";

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
    expect(metrics.map((metric) => metric.direction)).toEqual(["up", "up", "down", "up"]);
  });

  it("adapts delivery chart points and date labels to the selected range", () => {
    const week = getDeliveryTrend("Last 7 days", 0);
    const quarter = getDeliveryTrend("Last 90 days", 0);
    expect(week).toHaveLength(4);
    expect(week[0].day).toBe("Apr 24");
    expect(week.at(-1)?.day).toBe("Apr 30");
    expect(quarter[0].day).toBe("Feb 01");
    expect(quarter.at(-1)?.day).toBe("Apr 30");
  });
});