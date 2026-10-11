import { describe, expect, it } from "vitest";
import { calculateKpis, deliveryTrend, exceptions, filterExceptions, getDeliveryTrend, getInventoryHealth, inventoryHealth, sampleDataSnapshot } from "@/data/supply-chain";

describe("supply chain overview mock data", () => {
  it("shows the four specified default KPI values", () => {
    expect(calculateKpis({ dateRange: "Last 30 days", region: "All Regions", businessUnit: "All Business Units" }).map((metric) => [metric.label, metric.value, metric.change])).toEqual([
      ["On-Time Delivery", "94.3%", "+1.8%"],
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
    expect(metrics.map((metric) => metric.changeMeaning)).toEqual(["relative percent change", "relative percent change", "turns change", "percentage-point change"]);
  });

  it("derives the delivery KPI from observations in the selected range", () => {
    const filters = { region: "All Regions", businessUnit: "All Business Units" };
    expect(calculateKpis({ ...filters, dateRange: "Last 30 days" })[0]?.value).toBe("94.3%");
    expect(calculateKpis({ ...filters, dateRange: "Last 7 days" })[0]?.value).toBe("95.1%");
  });

  it("keeps delivery observations on their source dates while applying the selected date range", () => {
    const week = getDeliveryTrend("Last 7 days");
    const month = getDeliveryTrend("Last 30 days");
    const quarter = getDeliveryTrend("Last 90 days");
    expect(week.map((point) => point.day)).toEqual(["Apr 25", "Apr 27", "Apr 29"]);
    expect(week.map((point) => point.actual)).toEqual([94.8, 95.6, 94.9]);
    expect(month.map((point) => point.day)).toEqual(deliveryTrend.map((point) => point.day));
    expect(quarter).toEqual(month);
  });

  it("keeps the source observation period consistent with its illustrative snapshot timestamp", () => {
    expect(sampleDataSnapshot).toBe("2026-04-30T09:42:00Z");
    expect(new Date(sampleDataSnapshot).getTime()).toBeGreaterThan(Date.UTC(2026, 3, 29));
    expect(getDeliveryTrend("Last 30 days").at(-1)?.day).toBe("Apr 29");
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