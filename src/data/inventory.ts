
export type InventoryStatus =
  | "Healthy"
  | "At Risk"
  | "Overstocked"
  | "Stockout";

export type InventoryItem = {
  id: string;
  sku: string;
  product: string;
  category: string;
  location: string;
  region: string;
  onHand: number;
  reorderPoint: number;
  dailyDemand: number;
  unitCost: number;
  status: InventoryStatus;
};

export const inventoryItems: InventoryItem[] = [
  {
    id: "INV-1001",
    sku: "SKU-10482",
    product: "Premium Packaging Film",
    category: "Packaging",
    location: "Chicago DC",
    region: "North America",
    onHand: 1840,
    reorderPoint: 900,
    dailyDemand: 92,
    unitCost: 12.5,
    status: "Healthy",
  },
  {
    id: "INV-1002",
    sku: "SKU-10496",
    product: "Industrial Fasteners",
    category: "Components",
    location: "Rotterdam Warehouse",
    region: "Europe",
    onHand: 340,
    reorderPoint: 600,
    dailyDemand: 85,
    unitCost: 4.8,
    status: "At Risk",
  },
  {
    id: "INV-1003",
    sku: "SKU-10513",
    product: "Protective Containers",
    category: "Packaging",
    location: "Austin Hub",
    region: "North America",
    onHand: 0,
    reorderPoint: 250,
    dailyDemand: 32,
    unitCost: 8.25,
    status: "Stockout",
  },
  {
    id: "INV-1004",
    sku: "SKU-10527",
    product: "Replacement Bearings",
    category: "Components",
    location: "Hamburg Warehouse",
    region: "Europe",
    onHand: 4200,
    reorderPoint: 700,
    dailyDemand: 45,
    unitCost: 22,
    status: "Overstocked",
  },
  {
    id: "INV-1005",
    sku: "SKU-10541",
    product: "Temperature Sensors",
    category: "Electronics",
    location: "Singapore DC",
    region: "Asia Pacific",
    onHand: 680,
    reorderPoint: 300,
    dailyDemand: 28,
    unitCost: 34.5,
    status: "Healthy",
  },
  {
    id: "INV-1006",
    sku: "SKU-10566",
    product: "Sealing Components",
    category: "Components",
    location: "Toronto DC",
    region: "North America",
    onHand: 120,
    reorderPoint: 400,
    dailyDemand: 40,
    unitCost: 6.75,
    status: "At Risk",
  },
  {
    id: "INV-1007",
    sku: "SKU-10582",
    product: "Bulk Storage Crates",
    category: "Packaging",
    location: "Lyon Cross-dock",
    region: "Europe",
    onHand: 1650,
    reorderPoint: 500,
    dailyDemand: 35,
    unitCost: 18,
    status: "Healthy",
  },
  {
    id: "INV-1008",
    sku: "SKU-10604",
    product: "Control Modules",
    category: "Electronics",
    location: "Singapore DC",
    region: "Asia Pacific",
    onHand: 2500,
    reorderPoint: 450,
    dailyDemand: 30,
    unitCost: 75,
    status: "Overstocked",
  },
];

export const inventoryRegions = [
  "All Regions",
  "North America",
  "Europe",
  "Asia Pacific",
];

export const inventoryStatuses = [
  "All Statuses",
  "Healthy",
  "At Risk",
  "Overstocked",
  "Stockout",
] as const;

export const inventoryHealthData = [
  { name: "Healthy", units: 18400, fill: "var(--inventory-healthy)" },
  { name: "At Risk", units: 4260, fill: "var(--inventory-at-risk)" },
  { name: "Overstocked", units: 3180, fill: "var(--inventory-overstocked)" },
  { name: "Stockout", units: 740, fill: "var(--inventory-stockout)" },
];

export const inventoryTrendData = [
  { week: "Sep 14", healthy: 72, risk: 17, excess: 8, stockout: 3 },
  { week: "Sep 21", healthy: 74, risk: 15, excess: 8, stockout: 3 },
  { week: "Sep 28", healthy: 73, risk: 16, excess: 8, stockout: 3 },
  { week: "Oct 05", healthy: 76, risk: 14, excess: 7, stockout: 3 },
  { week: "Oct 12", healthy: 77, risk: 13, excess: 7, stockout: 3 },
  { week: "Oct 19", healthy: 78, risk: 12, excess: 7, stockout: 3 },
];

export function getDaysOfSupply(item: InventoryItem) {
  return item.dailyDemand > 0
    ? Math.round(item.onHand / item.dailyDemand)
    : 0;
}

export function getInventoryValue(items: InventoryItem[]) {
  return items.reduce(
    (total, item) => total + item.onHand * item.unitCost,
    0,
  );
}
