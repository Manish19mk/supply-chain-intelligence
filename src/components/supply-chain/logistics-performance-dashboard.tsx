
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Clock3,
  Search,
  SlidersHorizontal,
  Truck,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  logisticsExceptions,
  logisticsPeriods,
  logisticsRegions,
  logisticsTrendData,
  shipmentRecords,
  type LogisticsException,
  type ShipmentRecord,
} from "@/data/logistics-performance";

type SortKey =
  | "shipmentId"
  | "carrier"
  | "origin"
  | "destination"
  | "mode"
  | "status"
  | "actualTransitDays"
  | "freightCost";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(value);

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const chartColors = ["#2563eb", "#0d9488", "#7c3aed"];

export function LogisticsPerformanceDashboard() {
  const [region, setRegion] =
    useState<(typeof logisticsRegions)[number]>("All Regions");
  const [period, setPeriod] =
    useState<(typeof logisticsPeriods)[number]>("Last 12 months");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("shipmentId");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentRecord | null>(null);
  const [selectedException, setSelectedException] =
    useState<LogisticsException | null>(null);

  const dashboardRecords = useMemo(
    () =>
      shipmentRecords.filter(
        (shipment) =>
          region === "All Regions" || shipment.region === region,
      ),
    [region],
  );

  const records = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return dashboardRecords
      .filter(
        (shipment) =>
          !normalizedQuery ||
          `${shipment.shipmentId} ${shipment.carrier} ${shipment.origin} ${shipment.destination} ${shipment.mode} ${shipment.status}`
            .toLowerCase()
            .includes(normalizedQuery),
      )
      .sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue === undefined || bValue === undefined) return 0;

        const comparison =
          typeof aValue === "number" && typeof bValue === "number"
            ? aValue - bValue
            : String(aValue).localeCompare(String(bValue));

        return comparison * (sortAsc ? 1 : -1);
      });
  }, [dashboardRecords, query, sortKey, sortAsc]);

  const completedShipments = dashboardRecords.filter(
    (shipment) => shipment.status !== "In Transit",
  );

  const onTimeRate = completedShipments.length
    ? (completedShipments.filter((shipment) => shipment.status === "On Time")
        .length /
        completedShipments.length) *
      100
    : 0;

  const averageTransit = completedShipments.length
    ? completedShipments.reduce(
        (sum, shipment) => sum + shipment.actualTransitDays,
        0,
      ) / completedShipments.length
    : 0;

  const freightSpend = dashboardRecords.reduce(
    (sum, shipment) => sum + shipment.freightCost,
    0,
  );

  const delayedCount = dashboardRecords.filter(
    (shipment) => shipment.status === "Delayed",
  ).length;

  const trend = useMemo(() => {
    if (period === "Last month") return logisticsTrendData.slice(-1);
    if (period === "Last 3 months") return logisticsTrendData.slice(-3);
    return logisticsTrendData;
  }, [period]);

  const freightTrend = useMemo(() => {
    if (period === "Last month") return logisticsTrendData.slice(-1);
    if (period === "Last 3 months") return logisticsTrendData.slice(-3);
    return logisticsTrendData;
  }, [period]);

  const carrierData = useMemo(() => {
    const totals: Record<string, { spend: number; shipments: number }> = {};

    dashboardRecords.forEach((shipment) => {
      const carrier = shipment.carrier;
      const current = totals[carrier] ?? { spend: 0, shipments: 0 };

      totals[carrier] = {
        spend: current.spend + shipment.freightCost,
        shipments: current.shipments + 1,
      };
    });

    return Object.entries(totals).map(([carrier, values]) => ({
      carrier,
      spend: values.spend,
      shipments: values.shipments,
    }));
  }, [dashboardRecords]);

  const visibleExceptions = logisticsExceptions.filter(
    (exception) =>
      region === "All Regions" || exception.region === region,
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((current) => !current);
    } else {
      setSortKey(key);
      setSortAsc(key === "carrier" || key === "shipmentId");
    }
  }

  function resetFilters() {
    setRegion("All Regions");
    setPeriod("Last 12 months");
    setQuery("");
  }

  return (
    <main className="mx-auto max-w-[1540px] px-4 pb-10 pt-7 sm:px-6 lg:px-8">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span>Workspace</span>
        <ArrowRight className="size-3" />
        <span className="text-foreground">Logistics Performance</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-semibold leading-tight sm:text-[27px]">
            Logistics Performance
          </h1>
          <p className="mt-2 max-w-[780px] text-sm leading-5 text-muted-foreground">
            Monitor transportation reliability, transit times, freight spend,
            and shipment exceptions across your logistics network.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          Export report
        </Button>
      </div>

      <section
        aria-label="Logistics filters"
        className="mt-6 flex flex-wrap items-center gap-2.5 border-y border-border py-3"
      >
        <span className="flex items-center gap-2 pr-1 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </span>

        <Select
          value={period}
          onValueChange={(value) =>
            setPeriod(value as (typeof logisticsPeriods)[number])
          }
        >
          <SelectTrigger aria-label="Logistics period" className="h-8 w-full text-xs sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {logisticsPeriods.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={region}
          onValueChange={(value) =>
            setRegion(value as (typeof logisticsRegions)[number])
          }
        >
          <SelectTrigger aria-label="Logistics region" className="h-8 w-full text-xs sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {logisticsRegions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(region !== "All Regions" ||
          period !== "Last 12 months" ||
          query) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={resetFilters}
          >
            Reset filters
          </Button>
        )}

        <span className="ml-auto text-xs text-muted-foreground">
          Illustrative shipment data
        </span>
      </section>

      <section
        aria-label="Logistics KPIs"
        className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          label="On-Time Delivery"
          value={formatPercent(onTimeRate)}
          note="Completed shipments delivered on time"
          icon={<Truck className="size-4" />}
        />
        <KpiCard
          label="Average Transit Time"
          value={`${averageTransit.toFixed(1)} days`}
          note="Completed shipments only"
          icon={<Clock3 className="size-4" />}
        />
        <KpiCard
          label="Freight Spend"
          value={formatCurrency(freightSpend)}
          note="Spend in the selected region"
          icon={<Activity className="size-4" />}
        />
        <KpiCard
          label="Delayed Shipments"
          value={String(delayedCount)}
          note={`${dashboardRecords.length} shipments in selected scope`}
          icon={<AlertTriangle className="size-4" />}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="dashboard-panel min-w-0">
          <h2 className="text-sm font-semibold">On-Time Delivery Trend</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Monthly delivery reliability · Illustrative
          </p>
          <div className="mt-4 h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={trend}
                margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--chart-grid)"
                  strokeDasharray="3 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="period"
                  interval="preserveStartEnd"
                  tick={{ fill: "var(--chart-label)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[80, 100]}
                  tick={{ fill: "var(--chart-label)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number" ? `${value.toFixed(1)}%` : value
                  }
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="onTimeRate"
                  name="On-time delivery"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#2563eb" }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-panel min-w-0">
          <h2 className="text-sm font-semibold">Freight Cost Trend</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Monthly illustrative freight spend · USD
          </p>
          <div className="mt-4 h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={freightTrend}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--chart-grid)"
                  strokeDasharray="3 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="period"
                  interval="preserveStartEnd"
                  tick={{ fill: "var(--chart-label)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--chart-label)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number" ? formatCurrency(value) : value
                  }
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                />
                
<Bar
  dataKey="freightCost"
  name="Freight spend"
  fill="#2563eb"
  radius={[3, 3, 0, 0]}
  isAnimationActive={false}
/>

              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-md border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">Shipment Performance</h2>
              <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-[11px]">
                {records.length}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Review carrier, route, transit duration, status, and freight cost.
            </p>
          </div>
          <div className="relative w-full sm:max-w-[340px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search shipments"
              placeholder="Search shipment, carrier, route, or status"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        {records.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left text-xs">
              <thead>
                <tr className="h-10 border-b border-border bg-muted/35 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {(
                    [
                      ["shipmentId", "Shipment"],
                      ["carrier", "Carrier"],
                      ["origin", "Origin"],
                      ["destination", "Destination"],
                      ["mode", "Mode"],
                      ["status", "Status"],
                      ["actualTransitDays", "Transit days"],
                      ["freightCost", "Freight cost"],
                    ] as [SortKey, string][]
                  ).map(([key, label]) => (
                    <th key={key} className="px-3 first:pl-4">
                      <button
                        type="button"
                        onClick={() => toggleSort(key)}
                        className="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        {label}
                        {sortKey === key
                          ? sortAsc
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </button>
                    </th>
                  ))}
                  <th className="px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map((shipment) => (
                  <tr key={shipment.id} className="h-[58px] hover:bg-muted/30">
                    <td className="px-4 font-medium">{shipment.shipmentId}</td>
                    <td className="px-3">{shipment.carrier}</td>
                    <td className="px-3">{shipment.origin}</td>
                    <td className="px-3">{shipment.destination}</td>
                    <td className="px-3">{shipment.mode}</td>
                    <td className="px-3">
                      <StatusBadge status={shipment.status} />
                    </td>
                    <td className="px-3 tabular-nums">
                      {shipment.actualTransitDays} days
                    </td>
                    <td className="px-3 tabular-nums">
                      {formatCurrency(shipment.freightCost)}
                    </td>
                    <td className="px-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px]"
                        onClick={() => setSelectedShipment(shipment)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
            <Search className="size-5 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">No shipments found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try another search or region.
            </p>
          </div>
        )}

        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-5">
          Showing {records.length} of {dashboardRecords.length} shipments in the selected region
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-md border border-border bg-card">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <h2 className="text-base font-semibold">Shipment Exceptions</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Delays and transportation issues requiring follow-up.
          </p>
        </div>
        <div className="divide-y divide-border">
          {visibleExceptions.map((exception) => (
            <button
              key={exception.id}
              type="button"
              onClick={() => setSelectedException(exception)}
              className="flex w-full flex-col gap-2 px-4 py-4 text-left transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between sm:px-5"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`mt-0.5 size-4 shrink-0 ${
                    exception.severity === "High"
                      ? "text-critical"
                      : exception.severity === "Medium"
                        ? "text-warning"
                        : "text-muted-foreground"
                  }`}
                />
                <div>
                  <p className="text-xs font-semibold">
                    {exception.shipmentId}
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      · {exception.type}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {exception.carrier} · {exception.region} · {exception.severity} severity
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 self-start text-xs font-medium text-primary sm:self-auto">
                Review <ArrowRight className="size-3.5" />
              </span>
            </button>
          ))}
          {!visibleExceptions.length && (
            <p className="px-5 py-8 text-center text-xs text-muted-foreground">
              No shipment exceptions for this region.
            </p>
          )}
        </div>
      </section>

      <p className="mt-5 text-[11px] text-muted-foreground">
        Illustrative data · Not connected to operational systems
      </p>

      <Sheet
        open={selectedShipment !== null || selectedException !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedShipment(null);
            setSelectedException(null);
          }
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-[440px]">
          {selectedShipment && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedShipment.shipmentId}</SheetTitle>
                <SheetDescription>
                  {selectedShipment.carrier} · Shipment details
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-5">
                <Detail label="Origin" value={selectedShipment.origin} />
                <Detail label="Destination" value={selectedShipment.destination} />
                <Detail label="Region" value={selectedShipment.region} />
                <Detail label="Transport mode" value={selectedShipment.mode} />
                <Detail label="Status" value={selectedShipment.status} />
                <Detail
                  label="Planned transit"
                  value={`${selectedShipment.plannedTransitDays} days`}
                />
                <Detail
                  label="Actual transit"
                  value={`${selectedShipment.actualTransitDays} days`}
                />
                <Detail
                  label="Freight cost"
                  value={formatCurrency(selectedShipment.freightCost)}
                />
                <Detail label="Shipment date" value={selectedShipment.shipmentDate} />
              </div>
              <Button
                className="w-full"
                onClick={() => setSelectedShipment(null)}
              >
                Close details
              </Button>
            </>
          )}

          {selectedException && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedException.shipmentId}</SheetTitle>
                <SheetDescription>
                  {selectedException.id} · {selectedException.type}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-5">
                <Detail label="Carrier" value={selectedException.carrier} />
                <Detail label="Region" value={selectedException.region} />
                <Detail label="Severity" value={selectedException.severity} />
                <Detail label="What happened" value={selectedException.description} />
                <div className="rounded-sm border border-border bg-muted/40 p-3">
                  <p className="text-xs font-semibold">Recommended action</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {selectedException.recommendedAction}
                  </p>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => setSelectedException(null)}
              >
                Close review
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}

function KpiCard({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="dashboard-panel flex min-h-[144px] flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="grid size-8 place-items-center rounded-sm bg-info-subtle text-info">
          {icon}
        </span>
      </div>
      <div className="mt-3">
        <div className="text-[27px] font-semibold leading-none tabular-nums">
          {value}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">{note}</p>
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium leading-5">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: ShipmentRecord["status"] }) {
  const className =
    status === "Delayed"
      ? "bg-critical/10 text-critical"
      : status === "In Transit"
        ? "bg-info-subtle text-info"
        : "bg-positive/10 text-positive";

  return (
    <span className={`inline-flex rounded-sm px-2 py-1 text-[10px] font-medium ${className}`}>
      {status}
    </span>
  );
}
