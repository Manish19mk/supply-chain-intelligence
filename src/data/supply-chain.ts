
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

export const sampleDataSnapshot = "2026-04-30T09:42:00Z";

export type DeliveryObservation = {
  day: string;
  date: string;
  actual: number;
};

const deliveryValues = [
  92.8, 93.4, 92.9, 94.1, 93.8,
  94.6, 93.9, 94.8, 94.4, 95.2,
  94.5, 95.4, 94.8, 95.6, 94.9,
];

export const deliveryTrend: DeliveryObservation[] = deliveryValues.map(
  (actual, index) => {
    const date = new Date(Date.UTC(2026, 3, 1 + index * 2));
    return {
      date: date.toISOString().slice(0, 10),
      day: `Apr ${String(date.getUTCDate()).padStart(2, "0")}`,
      actual,
    };
  },
);

const previousDeliveryTrend: DeliveryObservation[] = [
  92.1, 92.7, 93.0, 92.8, 93.2,
  93.5, 93.1, 93.7, 93.4, 93.8,
  94.0, 93.6, 94.1, 94.0, 94.2,
].map((actual, index) => {
  const date = new Date(Date.UTC(2026, 2, 2 + index * 2));

  return {
    date: date.toISOString().slice(0, 10),
    day: `Mar ${String(date.getUTCDate()).padStart(2, "0")}`,
    actual,
  };
});


export function getDeliveryTrend(range: string) {
  const rangeDays =
    range === "Last 7 days" ? 7 :
    range === "Last 90 days" ? 90 : 30;

  const end = Date.parse(sampleDataSnapshot.slice(0, 10));
  const start = end - (rangeDays - 1) * 86400000;

  return deliveryTrend
    .filter((point) => {
      const timestamp = Date.parse(point.date);
      return timestamp >= start && timestamp <= end;
    })
    .map((point) => ({ ...point }));
}

export const inventoryHealth = [
  {
    name: "Healthy",
    units: 18400,
    fill: "var(--inventory-healthy)",
    legendClass: "bg-inventory-healthy",
  },
  {
    name: "At Risk",
    units: 4260,
    fill: "var(--inventory-at-risk)",
    legendClass: "bg-inventory-at-risk",
  },
  {
    name: "Overstocked",
    units: 3180,
    fill: "var(--inventory-overstocked)",
    legendClass: "bg-inventory-overstocked",
  },
  {
    name: "Stockout",
    units: 740,
    fill: "var(--inventory-stockout)",
    legendClass: "bg-inventory-stockout",
  },
];

export type InventoryObservation = {
  id: string;
  region: string;
  businessUnit: string;
  status: "Healthy" | "At Risk" | "Overstocked" | "Stockout";
  units: number;
};

const regionDefinitions = [
  { region: "North America", share: 0.52 },
  { region: "Europe", share: 0.31 },
  { region: "Asia Pacific", share: 0.17 },
];

const unitDefinitions = [
  { businessUnit: "Consumer Goods", share: 0.48 },
  { businessUnit: "Industrial", share: 0.33 },
  { businessUnit: "Healthcare", share: 0.19 },
];

function allocateUnits(total: number, shares: number[]) {
  const values = shares.map((share) => Math.floor(total * share));
  const remainder = total - values.reduce((sum, value) => sum + value, 0);
if (values.length > 0) {
  values[0] = (values[0] ?? 0) + remainder;
}
  return values;
}

export const inventoryObservations: InventoryObservation[] =
  inventoryHealth.flatMap((category) => {
    const regionUnits = allocateUnits(
      category.units,
      regionDefinitions.map((item) => item.share),
    );

    return regionUnits.flatMap((unitsForRegion, regionIndex) => {
      const unitUnits = allocateUnits(
        unitsForRegion,
        unitDefinitions.map((item) => item.share),
      );

      return unitUnits.map((units, unitIndex) => ({
        id: `${category.name}-${regionIndex}-${unitIndex}`,
        region: regionDefinitions[regionIndex]!.region,
        businessUnit: unitDefinitions[unitIndex]!.businessUnit, 
        status: category.name as InventoryObservation["status"],
        units,
      }));
    });
  });

export function getInventoryHealth(region: string, businessUnit: string) {
  const filtered = inventoryObservations.filter(
    (record) =>
      (region === "All Regions" || record.region === region) &&
      (businessUnit === "All Business Units" ||
        record.businessUnit === businessUnit),
  );

  return inventoryHealth.map((category) => ({
    ...category,
    units: filtered
      .filter((record) => record.status === category.name)
      .reduce((sum, record) => sum + record.units, 0),
  }));
}

export const regions = [
  "All Regions",
  "North America",
  "Europe",
  "Asia Pacific",
];

export const businessUnits = [
  "All Business Units",
  "Consumer Goods",
  "Industrial",
  "Healthcare",
];

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
      (filters.region === "All Regions" ||
        record.region === filters.region) &&
      (filters.businessUnit === "All Business Units" ||
        record.businessUnit === filters.businessUnit),
  );
}

type MetricObservation = {
  date: string;
  region: string;
  businessUnit: string;
  fulfilledUnits: number;
  orderedUnits: number;
  cogs: number;
  averageInventoryValue: number;
  stockoutLocations: number;
  activeLocations: number;
};


function makeMetricObservations(): MetricObservation[] {
  const observations: MetricObservation[] = [];
  const start = Date.UTC(2026, 0, 1);
  const end = Date.UTC(2026, 3, 30);

  for (let timestamp = start; timestamp <= end; timestamp += 86400000) {
    const date = new Date(timestamp).toISOString().slice(0, 10);
    const day = Math.round((timestamp - start) / 86400000);

    for (const [regionIndex, region] of regionDefinitions.entries()) {
      for (const [unitIndex, unit] of unitDefinitions.entries()) {
        const orderedUnits =
          900 +
          regionIndex * 160 +
          unitIndex * 110 +
          ((day * 17 + regionIndex * 13 + unitIndex * 7) % 180);

        const fillRate =
          0.968 +
          ((day + regionIndex * 3 + unitIndex * 5) % 9 - 4) * 0.0015;

        const averageInventoryValue =
          105000 +
          regionIndex * 21000 +
          unitIndex * 14000 +
          ((day * 83 + regionIndex * 19 + unitIndex * 31) % 12000);

        // Illustrative daily COGS calibrated to approximately 8.4x annual turns.
        const cogs = averageInventoryValue * (8.4 / 365);

        observations.push({
          date,
          region: region.region,
          businessUnit: unit.businessUnit,
          orderedUnits,
          fulfilledUnits: Math.round(orderedUnits * fillRate),
          cogs,
          averageInventoryValue,
          activeLocations: 100 + regionIndex * 30 + unitIndex * 15,
          stockoutLocations:
            2 + ((day + regionIndex * 2 + unitIndex * 3) % 5),
        });
      }
    }
  }

  return observations;
}


const metricObservations = makeMetricObservations();

function matchesFilters(
  observation: { region: string; businessUnit: string },
  filters: DashboardFilters,
) {
  return (
    (filters.region === "All Regions" ||
      observation.region === filters.region) &&
    (filters.businessUnit === "All Business Units" ||
      observation.businessUnit === filters.businessUnit)
  );
}

function getPeriodBounds(range: string, endDate: string) {
  const days =
    range === "Last 7 days" ? 7 :
    range === "Last 90 days" ? 90 : 30;

  const end = Date.parse(endDate);
  return {
    start: new Date(end - (days - 1) * 86400000)
      .toISOString()
      .slice(0, 10),
    end: endDate,
  };
}

function getPeriodMetrics(filters: DashboardFilters, endDate: string) {
  const bounds = getPeriodBounds(filters.dateRange, endDate);

  const rows = metricObservations.filter(
    (observation) =>
      observation.date >= bounds.start &&
      observation.date <= bounds.end &&
      matchesFilters(observation, filters),
  );

  const ordered = rows.reduce((sum, row) => sum + row.orderedUnits, 0);
  const fulfilled = rows.reduce((sum, row) => sum + row.fulfilledUnits, 0);
  const cogs = rows.reduce((sum, row) => sum + row.cogs, 0);
  const inventoryValue = rows.reduce(
    (sum, row) => sum + row.averageInventoryValue,
    0,
  );
  const stockoutLocations = rows.reduce(
    (sum, row) => sum + row.stockoutLocations,
    0,
  );
  const activeLocations = rows.reduce(
    (sum, row) => sum + row.activeLocations,
    0,
  );

  return {
    fillRate: ordered ? (fulfilled / ordered) * 100 : null,
    inventoryTurns: inventoryValue ? cogs / inventoryValue : null,
    stockoutRate: activeLocations
      ? (stockoutLocations / activeLocations) * 100
      : null,
  };
}

function formatChange(
  current: number | null,
  previous: number | null,
  unit: "percent" | "turns" | "percentagePoints",
) {
  if (current === null || previous === null) return "—";

  const difference = current - previous;

  if (unit === "turns") {
    return `${difference >= 0 ? "+" : "−"}${Math.abs(difference).toFixed(1)}x`;
  }

  if (unit === "percentagePoints") {
    return `${difference >= 0 ? "+" : "−"}${Math.abs(difference).toFixed(1)} pp`;
  }

  if (previous === 0) return "—";

  const relative = (difference / previous) * 100;
  return `${relative >= 0 ? "+" : "−"}${Math.abs(relative).toFixed(1)}%`;
}

export function calculateKpis(filters: DashboardFilters) {
  const trend = getDeliveryTrend(filters.dateRange);
  const deliveryAverage = trend.length
    ? trend.reduce((sum, point) => sum + point.actual, 0) / trend.length
    : null;

  const currentEnd = sampleDataSnapshot.slice(0, 10);
  const current = getPeriodMetrics(filters, currentEnd);

  const days =
    filters.dateRange === "Last 7 days" ? 7 :
    filters.dateRange === "Last 90 days" ? 90 : 30;

  const previousEnd = new Date(
    Date.parse(currentEnd) - days * 86400000,
  ).toISOString().slice(0, 10);

  const previous = getPeriodMetrics(filters, previousEnd);

  
const previousTrend = previousDeliveryTrend.filter((point) => {
  const timestamp = Date.parse(point.date);
  const currentStart = Date.parse(
    getPeriodBounds(filters.dateRange, currentEnd).start,
  );
  const previousStart = currentStart - days * 86400000;

  return timestamp >= previousStart && timestamp < currentStart;
});

const previousDelivery = previousTrend.length
  ? previousTrend.reduce((sum, point) => sum + point.actual, 0) /
    previousTrend.length
  : null;


  return [
    {
      label: "On-Time Delivery",
      value: deliveryAverage === null ? "—" : `${deliveryAverage.toFixed(1)}%`,
      change: formatChange(deliveryAverage, previousDelivery, "percent"),
      direction: deliveryAverage !== null && previousDelivery !== null &&
        deliveryAverage >= previousDelivery ? "up" : "down",
      positive: deliveryAverage !== null && previousDelivery !== null &&
        deliveryAverage >= previousDelivery,
      note: "vs. previous period",
      detail: `Reporting-period average · ${trend.length} observations`,
      changeMeaning: "relative percent change",
      icon: "truck",
    },
    {
      label: "Fill Rate",
      value: current.fillRate === null ? "—" : `${current.fillRate.toFixed(1)}%`,
      change: formatChange(current.fillRate, previous.fillRate, "percent"),
      direction: current.fillRate !== null && previous.fillRate !== null &&
        current.fillRate >= previous.fillRate ? "up" : "down",
      positive: current.fillRate !== null && previous.fillRate !== null &&
        current.fillRate >= previous.fillRate,
      note: "vs. previous period",
      changeMeaning: "relative percent change",
      icon: "boxes",
    },
    {
      label: "Inventory Turns",
      value: current.inventoryTurns === null
        ? "—" : `${(current.inventoryTurns * 365).toFixed(1)}x`,
      change: formatChange(
        current.inventoryTurns === null ? null : current.inventoryTurns * 365,
        previous.inventoryTurns === null ? null : previous.inventoryTurns * 365,
        "turns",
      ),
      direction: current.inventoryTurns !== null &&
        previous.inventoryTurns !== null &&
        current.inventoryTurns >= previous.inventoryTurns ? "up" : "down",
      positive: current.inventoryTurns !== null &&
        previous.inventoryTurns !== null &&
        current.inventoryTurns >= previous.inventoryTurns,
      note: "vs. previous period",
      changeMeaning: "annualized turns change",
      icon: "rotate",
    },
    {
      label: "Stockout Rate",
      value: current.stockoutRate === null
        ? "—" : `${current.stockoutRate.toFixed(1)}%`,
      change: formatChange(
        current.stockoutRate,
        previous.stockoutRate,
        "percentagePoints",
      ),
      direction: current.stockoutRate !== null &&
        previous.stockoutRate !== null &&
        current.stockoutRate > previous.stockoutRate ? "up" : "down",
      positive: current.stockoutRate !== null &&
        previous.stockoutRate !== null &&
        current.stockoutRate <= previous.stockoutRate,
      note: "vs. previous period",
      changeMeaning: "percentage-point change",
      icon: "alert",
    },
  ];
}
