
export type DemandRegion =
  | "North America"
  | "Europe"
  | "Asia Pacific";

export type DemandRecord = {
  id: string;
  sku: string;
  product: string;
  category: string;
  region: DemandRegion;
  actual: number;
  forecast: number;
  previousForecast: number;
};

export type DemandException = {
  id: string;
  sku: string;
  product: string;
  region: DemandRegion;
  type: "Demand Spike" | "Demand Drop" | "Forecast Miss";
  severity: "High" | "Medium" | "Low";
  description: string;
  recommendedAction: string;
};

export const demandRegions = [
  "All Regions",
  "North America",
  "Europe",
  "Asia Pacific",
] as const;


export const demandPeriods = [
  "Last month",
  "Last 3 months",
  "Last 12 months",
] as const;


export const demandRecords: DemandRecord[] = [
  {
    id: "DEM-1001",
    sku: "SKU-10482",
    product: "Premium Packaging Film",
    category: "Packaging",
    region: "North America",
    actual: 12400,
    forecast: 11800,
    previousForecast: 11200,
  },
  {
    id: "DEM-1002",
    sku: "SKU-10496",
    product: "Industrial Fasteners",
    category: "Components",
    region: "Europe",
    actual: 8900,
    forecast: 9600,
    previousForecast: 9200,
  },
  {
    id: "DEM-1003",
    sku: "SKU-10513",
    product: "Protective Containers",
    category: "Packaging",
    region: "North America",
    actual: 6400,
    forecast: 5200,
    previousForecast: 5500,
  },
  {
    id: "DEM-1004",
    sku: "SKU-10527",
    product: "Replacement Bearings",
    category: "Components",
    region: "Europe",
    actual: 7200,
    forecast: 7800,
    previousForecast: 7500,
  },
  {
    id: "DEM-1005",
    sku: "SKU-10541",
    product: "Temperature Sensors",
    category: "Electronics",
    region: "Asia Pacific",
    actual: 5100,
    forecast: 5400,
    previousForecast: 5000,
  },
  {
    id: "DEM-1006",
    sku: "SKU-10566",
    product: "Sealing Components",
    category: "Components",
    region: "North America",
    actual: 4300,
    forecast: 3900,
    previousForecast: 4100,
  },
  {
    id: "DEM-1007",
    sku: "SKU-10582",
    product: "Bulk Storage Crates",
    category: "Packaging",
    region: "Europe",
    actual: 3800,
    forecast: 4200,
    previousForecast: 4000,
  },
  {
    id: "DEM-1008",
    sku: "SKU-10604",
    product: "Control Modules",
    category: "Electronics",
    region: "Asia Pacific",
    actual: 9500,
    forecast: 9100,
    previousForecast: 8800,
  },
];

export const demandExceptions: DemandException[] = [
  {
    id: "DEX-201",
    sku: "SKU-10513",
    product: "Protective Containers",
    region: "North America",
    type: "Demand Spike",
    severity: "High",
    description:
      "Actual demand is materially above the forecast for this product.",
    recommendedAction:
      "Review recent orders and validate whether the increase is likely to continue.",
  },
  {
    id: "DEX-202",
    sku: "SKU-10496",
    product: "Industrial Fasteners",
    region: "Europe",
    type: "Forecast Miss",
    severity: "Medium",
    description:
      "Actual demand is below the planned forecast.",
    recommendedAction:
      "Review the demand assumptions and upcoming customer requirements.",
  },
  {
    id: "DEX-203",
    sku: "SKU-10604",
    product: "Control Modules",
    region: "Asia Pacific",
    type: "Demand Spike",
    severity: "Medium",
    description:
      "Demand is trending above the previous forecast.",
    recommendedAction:
      "Check current orders and confirm component availability.",
  },
  {
    id: "DEX-204",
    sku: "SKU-10527",
    product: "Replacement Bearings",
    region: "Europe",
    type: "Demand Drop",
    severity: "Low",
    description:
      "Demand is below the latest planning expectation.",
    recommendedAction:
      "Review whether the reduction is temporary before revising the plan.",
  },
];


export const demandTrendData = [
  { period: "Jan", actual: 8200, forecast: 8000 },
  { period: "Feb", actual: 7800, forecast: 8100 },
  { period: "Mar", actual: 9100, forecast: 8700 },
  { period: "Apr", actual: 8800, forecast: 9000 },
  { period: "May", actual: 9500, forecast: 9200 },
  { period: "Jun", actual: 9000, forecast: 9400 },
  { period: "Jul", actual: 10200, forecast: 9800 },
  { period: "Aug", actual: 10800, forecast: 10400 },
  { period: "Sep", actual: 10100, forecast: 10600 },
  { period: "Oct", actual: null, forecast: 11000 },
  { period: "Nov", actual: null, forecast: 11400 },
  { period: "Dec", actual: null, forecast: 11800 },
];


export const demandDailyTrendData = [
  { period: "Sep 1", actual: 920, forecast: 900 },
  { period: "Sep 3", actual: 940, forecast: 930 },
  { period: "Sep 5", actual: 910, forecast: 940 },
  { period: "Sep 7", actual: 980, forecast: 960 },
  { period: "Sep 9", actual: 1020, forecast: 980 },
  { period: "Sep 11", actual: 990, forecast: 1000 },
  { period: "Sep 13", actual: 1040, forecast: 1020 },
  { period: "Sep 15", actual: 1080, forecast: 1040 },
  { period: "Sep 17", actual: 1050, forecast: 1060 },
  { period: "Sep 19", actual: 1120, forecast: 1080 },
  { period: "Sep 21", actual: 1100, forecast: 1090 },
  { period: "Sep 23", actual: 1160, forecast: 1110 },
  { period: "Sep 25", actual: 1130, forecast: 1130 },
  { period: "Sep 27", actual: 1210, forecast: 1150 },
  { period: "Sep 29", actual: 1180, forecast: 1170 },
];


export const demandCategoryData = [
  { category: "Packaging", demand: 22600 },
  { category: "Components", demand: 20400 },
  { category: "Electronics", demand: 14600 },
];
