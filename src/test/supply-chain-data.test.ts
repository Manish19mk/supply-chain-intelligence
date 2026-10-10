import { describe, expect, it } from "vitest";
import { calculateKpis, exceptions, filterExceptions, getDeliveryTrend, getInventoryHealth, inventoryHealth } from "@/data/supply-chain";

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

  it("keeps delivery observations on their source dates while applying the selected date range", () => {
    const week = getDeliveryTrend("Last 7 days", 0);
    const month = getDeliveryTrend("Last 30 days", 0);
    const quarter = getDeliveryTrend("Last 90 days", 0);
    expect(week.map((point) => point.day)).toEqual(["Apr 25", "Apr 27", "Apr 29"]);
    expect(week.map((point) => point.actual)).toEqual([94.8, 95.6, 94.9]);
    expect(month.map((point) => point.day)).toEqual(deliveryTrend.map((point) => point.day));
    expect(quarter).toEqual(month);
  });

  it("uses semantic category colors and calculates tracked units from the four inventory values", () => {
    expect(getInventoryHealth("All Regions", "All Business Units")).toEqual(inventoryHealth);
    expect(inventoryHealth.map(({ name, fill }) => [name, fill])).toEqual([
      ["Healthy", "var(--inventory-healthy)"],
      ["At Risk", "var(--inventory-at-risk)"],
      ["Overstocked", "var(--inventory-overstocked)"],
      ["Stockout", "var(--inventory-stockout)"],
    ]);
    expect(inventoryHealth.reduce((sum, category) => sum + category.units, 0)).toBe(26580);
    expect(getInventoryHealth("Europe", "All Business Units").reduce((sum, category) => sum + category.units, 0)).toBe(8240);
  });
});