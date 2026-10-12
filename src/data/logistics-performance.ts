
export type LogisticsRegion =
  | "North America"
  | "Europe"
  | "Asia Pacific";

export type ShipmentRecord = {
  id: string;
  shipmentId: string;
  carrier: string;
  origin: string;
  destination: string;
  region: LogisticsRegion;
  mode: "Road" | "Ocean" | "Air" | "Rail";
  status: "On Time" | "Delayed" | "In Transit";
  plannedTransitDays: number;
  actualTransitDays: number;
  freightCost: number;
  shipmentDate: string;
};

export type LogisticsException = {
  id: string;
  shipmentId: string;
  carrier: string;
  region: LogisticsRegion;
  severity: "High" | "Medium" | "Low";
  type: string;
  description: string;
  recommendedAction: string;
};

export const logisticsRegions = [
  "All Regions",
  "North America",
  "Europe",
  "Asia Pacific",
] as const;

export const logisticsPeriods = [
  "Last month",
  "Last 3 months",
  "Last 12 months",
] as const;

export const shipmentRecords: ShipmentRecord[] = [
  {
    id: "LOG-1001",
    shipmentId: "SHP-24001",
    carrier: "BlueWave Logistics",
    origin: "Chicago",
    destination: "Dallas",
    region: "North America",
    mode: "Road",
    status: "On Time",
    plannedTransitDays: 3,
    actualTransitDays: 3,
    freightCost: 4200,
    shipmentDate: "2026-09-03",
  },
  {
    id: "LOG-1002",
    shipmentId: "SHP-24002",
    carrier: "NorthStar Freight",
    origin: "Toronto",
    destination: "Montreal",
    region: "North America",
    mode: "Road",
    status: "Delayed",
    plannedTransitDays: 2,
    actualTransitDays: 5,
    freightCost: 2850,
    shipmentDate: "2026-09-07",
  },
  {
    id: "LOG-1003",
    shipmentId: "SHP-24003",
    carrier: "EuroLink Cargo",
    origin: "Hamburg",
    destination: "Munich",
    region: "Europe",
    mode: "Rail",
    status: "On Time",
    plannedTransitDays: 2,
    actualTransitDays: 2,
    freightCost: 1950,
    shipmentDate: "2026-09-09",
  },
  {
    id: "LOG-1004",
    shipmentId: "SHP-24004",
    carrier: "Pacific Bridge Shipping",
    origin: "Shanghai",
    destination: "Singapore",
    region: "Asia Pacific",
    mode: "Ocean",
    status: "Delayed",
    plannedTransitDays: 8,
    actualTransitDays: 12,
    freightCost: 6800,
    shipmentDate: "2026-09-12",
  },
  {
    id: "LOG-1005",
    shipmentId: "SHP-24005",
    carrier: "AeroSwift Cargo",
    origin: "Frankfurt",
    destination: "Amsterdam",
    region: "Europe",
    mode: "Air",
    status: "On Time",
    plannedTransitDays: 1,
    actualTransitDays: 1,
    freightCost: 5100,
    shipmentDate: "2026-09-15",
  },
  {
    id: "LOG-1006",
    shipmentId: "SHP-24006",
    carrier: "BlueWave Logistics",
    origin: "Los Angeles",
    destination: "Phoenix",
    region: "North America",
    mode: "Road",
    status: "In Transit",
    plannedTransitDays: 2,
    actualTransitDays: 1,
    freightCost: 2400,
    shipmentDate: "2026-09-18",
  },
  {
    id: "LOG-1007",
    shipmentId: "SHP-24007",
    carrier: "EuroLink Cargo",
    origin: "Rotterdam",
    destination: "Berlin",
    region: "Europe",
    mode: "Road",
    status: "Delayed",
    plannedTransitDays: 3,
    actualTransitDays: 6,
    freightCost: 3250,
    shipmentDate: "2026-09-20",
  },
  {
    id: "LOG-1008",
    shipmentId: "SHP-24008",
    carrier: "Pacific Bridge Shipping",
    origin: "Tokyo",
    destination: "Seoul",
    region: "Asia Pacific",
    mode: "Ocean",
    status: "On Time",
    plannedTransitDays: 4,
    actualTransitDays: 4,
    freightCost: 3900,
    shipmentDate: "2026-09-24",
  },
  {
    id: "LOG-1009",
    shipmentId: "SHP-24009",
    carrier: "AeroSwift Cargo",
    origin: "Singapore",
    destination: "Sydney",
    region: "Asia Pacific",
    mode: "Air",
    status: "In Transit",
    plannedTransitDays: 2,
    actualTransitDays: 1,
    freightCost: 4600,
    shipmentDate: "2026-09-26",
  },
  {
    id: "LOG-1010",
    shipmentId: "SHP-24010",
    carrier: "NorthStar Freight",
    origin: "Boston",
    destination: "New York",
    region: "North America",
    mode: "Road",
    status: "On Time",
    plannedTransitDays: 1,
    actualTransitDays: 1,
    freightCost: 1250,
    shipmentDate: "2026-09-28",
  },
];

export const logisticsExceptions: LogisticsException[] = [
  {
    id: "LEX-201",
    shipmentId: "SHP-24002",
    carrier: "NorthStar Freight",
    region: "North America",
    severity: "High",
    type: "Transit Delay",
    description:
      "Shipment transit time exceeded the planned delivery window by three days.",
    recommendedAction:
      "Confirm the revised arrival time with the carrier and assess downstream order impact.",
  },
  {
    id: "LEX-202",
    shipmentId: "SHP-24004",
    carrier: "Pacific Bridge Shipping",
    region: "Asia Pacific",
    severity: "High",
    type: "Ocean Freight Delay",
    description:
      "The shipment is four days beyond its planned transit duration.",
    recommendedAction:
      "Request an updated arrival estimate and review alternative routing for urgent orders.",
  },
  {
    id: "LEX-203",
    shipmentId: "SHP-24007",
    carrier: "EuroLink Cargo",
    region: "Europe",
    severity: "Medium",
    type: "Route Delay",
    description:
      "A regional shipment is running three days behind its planned transit time.",
    recommendedAction:
      "Check the route status and coordinate an updated delivery commitment.",
  },
];

export const logisticsTrendData = [
  { period: "Jan", onTimeRate: 91.2, freightCost: 42000 },
  { period: "Feb", onTimeRate: 92.1, freightCost: 40500 },
  { period: "Mar", onTimeRate: 91.8, freightCost: 43200 },
  { period: "Apr", onTimeRate: 93.0, freightCost: 41800 },
  { period: "May", onTimeRate: 92.7, freightCost: 44000 },
  { period: "Jun", onTimeRate: 93.5, freightCost: 42500 },
  { period: "Jul", onTimeRate: 94.1, freightCost: 43800 },
  { period: "Aug", onTimeRate: 93.8, freightCost: 43100 },
  { period: "Sep", onTimeRate: 94.6, freightCost: 44700 },
  { period: "Oct", onTimeRate: 94.2, freightCost: 45200 },
  { period: "Nov", onTimeRate: 95.0, freightCost: 44500 },
  { period: "Dec", onTimeRate: 95.4, freightCost: 46000 },
];
