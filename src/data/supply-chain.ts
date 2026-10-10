export type Severity = "Critical" | "High" | "Medium" | "Low";
export type ExceptionStatus = "Open" | "Investigating" | "Resolved";

export type SupplyChainException = {
  id: string;
  title: string;
  category: string;
  location: string;
  region: string;
  businessUnit: string;
  severity: Severity;
  detected: string;
  status: ExceptionStatus;
  owner: string;
  impact: string;
};

export const exceptions: SupplyChainException[] = [
  {
    id: "EX-2841",
    title: "Stockout risk on high-velocity SKU",
    category: "Inventory",
    location: "Chicago DC",
    region: "North America",
    businessUnit: "Consumer Goods",
    severity: "Critical",
    detected: "18 min ago",
    status: "Open",
    owner: "Unassigned",
    impact: "Estimated 1,240 units at risk across 3 customer orders.",
  },
  {
    id: "EX-2838",
    title: "Supplier shipment 2 days behind schedule",
    category: "Supplier",
    location: "Rotterdam Port",
    region: "Europe",
    businessUnit: "Industrial",
    severity: "High",
    detected: "46 min ago",
    status: "Investigating",
    owner: "Maya Chen",
    impact: "Inbound components for 2 production lines may arrive late.",
  },
  {
    id: "EX-2832",
    title: "Demand forecast deviation above threshold",
    category: "Planning",
    location: "Austin Hub",
    region: "North America",
    businessUnit: "Consumer Goods",
    severity: "High",
    detected: "2 hours ago",
    status: "Open",
    owner: "Unassigned",
    impact: "Weekly demand is 24% higher than forecast for the top-selling line.",
  },
  {
    id: "EX-2827",
    title: "Excess inventory above target coverage",
    category: "Inventory",
    location: "Hamburg Warehouse",
    region: "Europe",
    businessUnit: "Industrial",
    severity: "Medium",
    detected: "4 hours ago",
    status: "Investigating",
    owner: "Jonas Weber",
    impact: "€184k in stock is above the 60-day coverage target.",
  },
  {
    id: "EX-2821",
    title: "Inbound shipment missed delivery window",
    category: "Logistics",
    location: "Singapore DC",
    region: "Asia Pacific",
    businessUnit: "Healthcare",
    severity: "Medium",
    detected: "Yesterday",
    status: "Open",
    owner: "Unassigned",
    impact: "Four purchase orders require a revised arrival estimate.",
  },
  {
    id: "EX-2814",
    title: "Fill rate below service-level commitment",
    category: "Service",
    location: "Toronto DC",
    region: "North America",
    businessUnit: "Healthcare",
    severity: "Low",
    detected: "Yesterday",
    status: "Resolved",
    owner: "Priya Nair",
    impact: "Fill rate briefly dipped to 92.1% against a 95% target.",
  },
  {
    id: "EX-2809",
    title: "Carrier capacity constraint on priority lane",
    category: "Logistics",
    location: "Lyon Cross-dock",
    region: "Europe",
    businessUnit: "Consumer Goods",
    severity: "High",
    detected: "2 days ago",
    status: "Investigating",
    owner: "Elena Rossi",
    impact: "Capacity is 18% below plan for the next scheduled dispatch.",
  },
];

export const deliveryTrend = [
  { day: "Apr 01", actual: 92.8 },
  { day: "Apr 03", actual: 93.4 },
  { day: "Apr 05", actual: 92.9 },
  { day: "Apr 07", actual: 94.1 },
  { day: "Apr 09", actual: 93.8 },
  { day: "Apr 11", actual: 94.6 },
  { day: "Apr 13", actual: 93.9 },
  { day: "Apr 15", actual: 94.8 },
  { day: "Apr 17", actual: 94.4 },
  { day: "Apr 19", actual: 95.2 },
  { day: "Apr 21", actual: 94.5 },
  { day: "Apr 23", actual: 95.4 },
  { day: "Apr 25", actual: 94.8 },
  { day: "Apr 27", actual: 95.6 },
  { day: "Apr 29", actual: 94.9 },
];

export function getDeliveryTrend(range: string, adjustment: number) {
  const sample = range === "Last 7 days" ? deliveryTrend.slice(-4) : deliveryTrend;
  const periodDays = range === "Last 7 days" ? 7 : range === "Last 90 days" ? 90 : 30;
  const endDate = new Date("2026-04-30T00:00:00Z");

  return sample.map((point, index) => {
    const dateOffset = Math.round(((sample.length - 1 - index) / Math.max(sample.length - 1, 1)) * (periodDays - 1));
    const date = new Date(endDate.getTime() - dateOffset * 24 * 60 * 60 * 1000);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "2-digit", timeZone: "UTC" });
    return { ...point, day: label, actual: Math.min(99, Math.max(90, point.actual + adjustment)) };
  });
}

export const inventoryHealth = [
  { name: "Healthy", units: 18400, fill: "var(--chart-series-2)" },
  { name: "At Risk", units: 4260, fill: "var(--chart-series-3)" },
  { name: "Overstocked", units: 3180, fill: "var(--chart-series-4)" },
  { name: "Stockout", units: 740, fill: "var(--chart-series-5)" },
];

export function getInventoryHealth(region: string, businessUnit: string) {
  const regionScale = region === "All Regions" ? 1 : region === "North America" ? 0.52 : region === "Europe" ? 0.31 : 0.17;
  const unitScale = businessUnit === "All Business Units" ? 1 : businessUnit === "Consumer Goods" ? 0.48 : businessUnit === "Industrial" ? 0.33 : 0.19;
  const scale = businessUnit === "All Business Units" ? regionScale : region === "All Regions" ? unitScale : regionScale * unitScale * 1.9;

  return inventoryHealth.map((category) => ({
    ...category,
    units: Math.max(1, Math.round(category.units * scale)),
  }));
}

export const regions = ["All Regions", "North America", "Europe", "Asia Pacific"];
export const businessUnits = ["All Business Units", "Consumer Goods", "Industrial", "Healthcare"];

export type DashboardFilters = {
  dateRange: string;
  region: string;
  businessUnit: string;
};

export function filterExceptions(
  records: SupplyChainException[],
  filters: Pick<DashboardFilters, "region" | "businessUnit">,
) {
  return records.filter(
    (record) =>
      (filters.region === "All Regions" || record.region === filters.region) &&
      (filters.businessUnit === "All Business Units" || record.businessUnit === filters.businessUnit),
  );
}

export function calculateKpis(filters: DashboardFilters) {
  const regionShift = filters.region === "All Regions" ? 0 : filters.region === "Europe" ? -0.4 : 0.2;
  const unitShift = filters.businessUnit === "All Business Units" ? 0 : filters.businessUnit === "Healthcare" ? -0.3 : 0.1;
  const rangeShift = filters.dateRange === "Last 7 days" ? -0.5 : filters.dateRange === "Last 90 days" ? 0.3 : 0;
  const shift = regionShift + unitShift + rangeShift;

  return [
    { label: "On-Time Delivery", value: `${(94.2 + shift).toFixed(1)}%`, change: "+1.8%", direction: "up", positive: true, note: "vs. previous period", icon: "truck" },
    { label: "Fill Rate", value: `${(96.8 + shift / 2).toFixed(1)}%`, change: "+0.6%", direction: "up", positive: true, note: "vs. previous period", icon: "boxes" },
    { label: "Inventory Turns", value: `${(8.4 + shift / 10).toFixed(1)}x`, change: "−0.3x", direction: "down", positive: false, note: "vs. previous period", icon: "rotate" },
    { label: "Stockout Rate", value: `${(2.7 - shift / 5).toFixed(1)}%`, change: "+0.4 pp", direction: "up", positive: false, note: "vs. previous period", icon: "alert" },
  ];
}