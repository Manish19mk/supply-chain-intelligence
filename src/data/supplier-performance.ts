
export type SupplierRegion =
  | "North America"
  | "Europe"
  | "Asia Pacific";

export type SupplierRecord = {
  id: string;
  name: string;
  region: SupplierRegion;
  category: string;
  onTimeDelivery: number;
  qualityRate: number;
  leadTime: number;
  spend: number;
  risk: "Low" | "Medium" | "High";
};

export type SupplierException = {
  id: string;
  supplierId: string;
  supplierName: string;
  region: SupplierRegion;
  severity: "High" | "Medium" | "Low";
  type: string;
  description: string;
  recommendedAction: string;
};

export const supplierRegions = [
  "All Regions",
  "North America",
  "Europe",
  "Asia Pacific",
] as const;

export const supplierPeriods = [
  "Last month",
  "Last 3 months",
  "Last 12 months",
] as const;

export const supplierRecords: SupplierRecord[] = [
  {
    id: "SUP-1001",
    name: "Apex Packaging Solutions",
    region: "North America",
    category: "Packaging",
    onTimeDelivery: 96.4,
    qualityRate: 98.7,
    leadTime: 8,
    spend: 2450000,
    risk: "Low",
  },
  {
    id: "SUP-1002",
    name: "Nordic Industrial Components",
    region: "Europe",
    category: "Components",
    onTimeDelivery: 91.2,
    qualityRate: 97.4,
    leadTime: 12,
    spend: 1870000,
    risk: "Medium",
  },
  {
    id: "SUP-1003",
    name: "Pacific Electronics Group",
    region: "Asia Pacific",
    category: "Electronics",
    onTimeDelivery: 84.6,
    qualityRate: 94.2,
    leadTime: 18,
    spend: 3120000,
    risk: "High",
  },
  {
    id: "SUP-1004",
    name: "Sterling Materials Ltd.",
    region: "Europe",
    category: "Raw Materials",
    onTimeDelivery: 97.1,
    qualityRate: 99.1,
    leadTime: 7,
    spend: 2210000,
    risk: "Low",
  },
  {
    id: "SUP-1005",
    name: "Summit Supply Partners",
    region: "North America",
    category: "Components",
    onTimeDelivery: 89.5,
    qualityRate: 96.1,
    leadTime: 14,
    spend: 1650000,
    risk: "Medium",
  },
  {
    id: "SUP-1006",
    name: "Eastbridge Manufacturing",
    region: "Asia Pacific",
    category: "Raw Materials",
    onTimeDelivery: 92.8,
    qualityRate: 98.0,
    leadTime: 11,
    spend: 2740000,
    risk: "Low",
  },
  {
    id: "SUP-1007",
    name: "Vertex Precision Systems",
    region: "North America",
    category: "Electronics",
    onTimeDelivery: 82.3,
    qualityRate: 92.8,
    leadTime: 21,
    spend: 1980000,
    risk: "High",
  },
  {
    id: "SUP-1008",
    name: "BluePeak Logistics Supply",
    region: "Europe",
    category: "Packaging",
    onTimeDelivery: 94.7,
    qualityRate: 97.8,
    leadTime: 9,
    spend: 1430000,
    risk: "Low",
  },
];

export const supplierExceptions: SupplierException[] = [
  {
    id: "SEX-201",
    supplierId: "SUP-1003",
    supplierName: "Pacific Electronics Group",
    region: "Asia Pacific",
    severity: "High",
    type: "Delivery Performance",
    description:
      "On-time delivery is below the target, creating a potential supply continuity risk.",
    recommendedAction:
      "Review open purchase orders, confirm recovery dates, and agree on a corrective delivery plan.",
  },
  {
    id: "SEX-202",
    supplierId: "SUP-1007",
    supplierName: "Vertex Precision Systems",
    region: "North America",
    severity: "High",
    type: "Quality Risk",
    description:
      "The supplier has a comparatively low quality rate and may require closer monitoring.",
    recommendedAction:
      "Review recent defect reports and request a corrective action plan from the supplier.",
  },
  {
    id: "SEX-203",
    supplierId: "SUP-1002",
    supplierName: "Nordic Industrial Components",
    region: "Europe",
    severity: "Medium",
    type: "Extended Lead Time",
    description:
      "Lead time is higher than that of most suppliers in the sample.",
    recommendedAction:
      "Review replenishment timing and confirm whether lead-time buffers are sufficient.",
  },
  {
    id: "SEX-204",
    supplierId: "SUP-1005",
    supplierName: "Summit Supply Partners",
    region: "North America",
    severity: "Medium",
    type: "Delivery Performance",
    description:
      "On-time delivery performance may affect planned replenishment.",
    recommendedAction:
      "Review recent late shipments and agree on measurable delivery improvements.",
  },
];

export const supplierTrendData = [
  { period: "Jan", onTimeDelivery: 92.1, qualityRate: 96.4 },
  { period: "Feb", onTimeDelivery: 92.8, qualityRate: 96.8 },
  { period: "Mar", onTimeDelivery: 91.9, qualityRate: 97.0 },
  { period: "Apr", onTimeDelivery: 93.2, qualityRate: 97.2 },
  { period: "May", onTimeDelivery: 93.8, qualityRate: 97.1 },
  { period: "Jun", onTimeDelivery: 92.9, qualityRate: 97.5 },
  { period: "Jul", onTimeDelivery: 94.1, qualityRate: 97.6 },
  { period: "Aug", onTimeDelivery: 94.5, qualityRate: 97.8 },
  { period: "Sep", onTimeDelivery: 93.7, qualityRate: 97.9 },
  { period: "Oct", onTimeDelivery: 94.8, qualityRate: 98.0 },
  { period: "Nov", onTimeDelivery: 95.1, qualityRate: 98.1 },
  { period: "Dec", onTimeDelivery: 95.6, qualityRate: 98.3 },
];
