
export type ExceptionSeverity = "Critical" | "High" | "Medium" | "Low";

export type ExceptionStatus =
  | "Open"
  | "In Progress"
  | "Resolved";

export type ExceptionCategory =
  | "Demand"
  | "Inventory"
  | "Supplier"
  | "Logistics"
  | "Production";

export type SupplyChainException = {
  id: string;
  title: string;
  description: string;
  category: ExceptionCategory;
  severity: ExceptionSeverity;
  status: ExceptionStatus;
  sourceModule: string;
  region: "North America" | "Europe" | "Asia Pacific";
  affectedEntity: string;
  owner: string;
  detectedDate: string;
  ageDays: number;
  recommendedAction: string;
};

export const exceptionRegions = [
  "All Regions",
  "North America",
  "Europe",
  "Asia Pacific",
] as const;

export const exceptionSeverities = [
  "All Severities",
  "Critical",
  "High",
  "Medium",
  "Low",
] as const;

export const exceptionStatuses = [
  "All Statuses",
  "Open",
  "In Progress",
  "Resolved",
] as const;

export const exceptionCategories = [
  "All Categories",
  "Demand",
  "Inventory",
  "Supplier",
  "Logistics",
  "Production",
] as const;

export const exceptionRecords: SupplyChainException[] = [
  {
    id: "EXC-1001",
    title: "Critical inventory shortage",
    description:
      "Available stock is below the minimum required to meet projected demand.",
    category: "Inventory",
    severity: "Critical",
    status: "Open",
    sourceModule: "Inventory Intelligence",
    region: "North America",
    affectedEntity: "SKU-10482",
    owner: "Unassigned",
    detectedDate: "2026-10-10",
    ageDays: 2,
    recommendedAction:
      "Review replenishment options and prioritize stock transfer.",
  },
  {
    id: "EXC-1002",
    title: "Supplier delivery delay",
    description:
      "An inbound purchase order is expected to arrive later than its committed date.",
    category: "Supplier",
    severity: "High",
    status: "In Progress",
    sourceModule: "Supplier Performance",
    region: "Europe",
    affectedEntity: "PO-78021",
    owner: "Priya Sharma",
    detectedDate: "2026-10-09",
    ageDays: 3,
    recommendedAction:
      "Confirm the revised delivery date and assess alternative suppliers.",
  },
  {
    id: "EXC-1003",
    title: "Forecast demand variance",
    description:
      "Actual demand is significantly above the current forecast.",
    category: "Demand",
    severity: "High",
    status: "Open",
    sourceModule: "Demand & Forecast",
    region: "Asia Pacific",
    affectedEntity: "SKU-20871",
    owner: "Unassigned",
    detectedDate: "2026-10-08",
    ageDays: 4,
    recommendedAction:
      "Review recent demand signals and update the replenishment forecast.",
  },
  {
    id: "EXC-1004",
    title: "Shipment transit delay",
    description:
      "A shipment has exceeded its planned transit time.",
    category: "Logistics",
    severity: "High",
    status: "In Progress",
    sourceModule: "Logistics Performance",
    region: "North America",
    affectedEntity: "SHP-24005",
    owner: "Rahul Mehta",
    detectedDate: "2026-10-07",
    ageDays: 5,
    recommendedAction:
      "Contact the carrier and confirm the expected arrival time.",
  },
  {
    id: "EXC-1005",
    title: "Excess inventory exposure",
    description:
      "Inventory levels are above the target range for the current demand outlook.",
    category: "Inventory",
    severity: "Medium",
    status: "Open",
    sourceModule: "Inventory Intelligence",
    region: "Europe",
    affectedEntity: "SKU-31042",
    owner: "Daniel Wilson",
    detectedDate: "2026-10-06",
    ageDays: 6,
    recommendedAction:
      "Review stock redistribution opportunities and future purchase orders.",
  },
  {
    id: "EXC-1006",
    title: "Production capacity constraint",
    description:
      "Available production capacity may not meet the planned output requirement.",
    category: "Production",
    severity: "Critical",
    status: "In Progress",
    sourceModule: "Exception Center",
    region: "Asia Pacific",
    affectedEntity: "PLANT-AP-02",
    owner: "Arun Kumar",
    detectedDate: "2026-10-05",
    ageDays: 7,
    recommendedAction:
      "Review production scheduling and evaluate alternate capacity.",
  },
  {
    id: "EXC-1007",
    title: "Supplier quality concern",
    description:
      "A supplier quality issue requires inspection before the next production run.",
    category: "Supplier",
    severity: "Medium",
    status: "Resolved",
    sourceModule: "Supplier Performance",
    region: "North America",
    affectedEntity: "SUP-0042",
    owner: "Priya Sharma",
    detectedDate: "2026-10-03",
    ageDays: 9,
    recommendedAction:
      "Document inspection findings and monitor the next delivery.",
  },
  {
    id: "EXC-1008",
    title: "Freight cost variance",
    description:
      "Freight charges are above the expected cost for the selected shipping lane.",
    category: "Logistics",
    severity: "Low",
    status: "Resolved",
    sourceModule: "Logistics Performance",
    region: "Europe",
    affectedEntity: "LANE-EU-014",
    owner: "Daniel Wilson",
    detectedDate: "2026-10-01",
    ageDays: 11,
    recommendedAction:
      "Review carrier invoices and update lane cost assumptions if needed.",
  },
  {
    id: "EXC-1009",
    title: "Forecast accuracy deterioration",
    description:
      "Forecast accuracy has fallen below the expected performance threshold.",
    category: "Demand",
    severity: "Medium",
    status: "Open",
    sourceModule: "Demand & Forecast",
    region: "Asia Pacific",
    affectedEntity: "CATEGORY-017",
    owner: "Unassigned",
    detectedDate: "2026-10-10",
    ageDays: 2,
    recommendedAction:
      "Review forecast errors and investigate recent demand changes.",
  },
  {
    id: "EXC-1010",
    title: "Inbound shipment documentation",
    description:
      "Required shipment documentation is incomplete and may delay receiving.",
    category: "Logistics",
    severity: "Low",
    status: "Open",
    sourceModule: "Logistics Performance",
    region: "North America",
    affectedEntity: "SHP-24009",
    owner: "Rahul Mehta",
    detectedDate: "2026-10-11",
    ageDays: 1,
    recommendedAction:
      "Request missing documents and verify receiving requirements.",
  },
  {
    id: "EXC-1011",
    title: "Supplier fulfillment risk",
    description:
      "Recent fulfillment performance indicates a risk to upcoming purchase orders.",
    category: "Supplier",
    severity: "High",
    status: "Open",
    sourceModule: "Supplier Performance",
    region: "Europe",
    affectedEntity: "SUP-0018",
    owner: "Unassigned",
    detectedDate: "2026-10-04",
    ageDays: 8,
    recommendedAction:
      "Confirm supplier capacity and create a contingency sourcing plan.",
  },
  {
    id: "EXC-1012",
    title: "Replenishment planning mismatch",
    description:
      "The planned replenishment quantity does not match the latest demand outlook.",
    category: "Inventory",
    severity: "Medium",
    status: "In Progress",
    sourceModule: "Inventory Intelligence",
    region: "Asia Pacific",
    affectedEntity: "SKU-18520",
    owner: "Arun Kumar",
    detectedDate: "2026-10-02",
    ageDays: 10,
    recommendedAction:
      "Recalculate the replenishment quantity using the latest demand plan.",
  },
];

export const exceptionTrendData = [
  { period: "May", opened: 34, resolved: 28 },
  { period: "Jun", opened: 31, resolved: 30 },
  { period: "Jul", opened: 39, resolved: 33 },
  { period: "Aug", opened: 35, resolved: 37 },
  { period: "Sep", opened: 42, resolved: 38 },
  { period: "Oct", opened: 28, resolved: 32 },
];
