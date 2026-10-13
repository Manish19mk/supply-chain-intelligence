
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Search,
  ShieldCheck,
  CalendarClock,
  ShieldAlert,
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
  supplierExceptions,
  supplierPeriods,
  supplierRecords,
  supplierRegions,
  supplierTrendData,
  type SupplierException,
  type SupplierRecord,
} from "@/data/supplier-performance";

type SortKey =
  | "name"
  | "region"
  | "onTimeDelivery"
  | "qualityRate"
  | "leadTime"
  | "spend";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(value);

const chartColors = ["#2563eb", "#0d9488", "#7c3aed"];

export function SupplierPerformanceDashboard() {
  const [region, setRegion] =
    useState<(typeof supplierRegions)[number]>("All Regions");
  const [period, setPeriod] =
    useState<(typeof supplierPeriods)[number]>("Last 12 months");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("onTimeDelivery");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierRecord | null>(null);
  const [selectedException, setSelectedException] =
    useState<SupplierException | null>(null);

  const dashboardRecords = useMemo(
    () =>
      supplierRecords.filter(
        (supplier) =>
          region === "All Regions" || supplier.region === region,
      ),
    [region],
  );

  const records = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return dashboardRecords
      .filter(
        (supplier) =>
          !normalizedQuery ||
          `${supplier.id} ${supplier.name} ${supplier.region} ${supplier.category} ${supplier.risk}`
            .toLowerCase()
            .includes(normalizedQuery),
      )
      .sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        const comparison =
          typeof aValue === "number" && typeof bValue === "number"
            ? aValue - bValue
            : String(aValue).localeCompare(String(bValue));

        return comparison * (sortAsc ? 1 : -1);
      });
  }, [dashboardRecords, query, sortKey, sortAsc]);

  const supplierCount = dashboardRecords.length;

  const averageOnTime = supplierCount
    ? dashboardRecords.reduce(
        (sum, supplier) => sum + supplier.onTimeDelivery,
        0,
      ) / supplierCount
    : 0;

  const averageQuality = supplierCount
    ? dashboardRecords.reduce(
        (sum, supplier) => sum + supplier.qualityRate,
        0,
      ) / supplierCount
    : 0;

  const averageLeadTime = supplierCount
    ? dashboardRecords.reduce(
        (sum, supplier) => sum + supplier.leadTime,
        0,
      ) / supplierCount
    : 0;

  const highRiskCount = dashboardRecords.filter(
    (supplier) => supplier.risk === "High",
  ).length;

  const totalSpend = dashboardRecords.reduce(
    (sum, supplier) => sum + supplier.spend,
    0,
  );

  const trend = useMemo(() => {
    if (period === "Last month") return supplierTrendData.slice(-1);
    if (period === "Last 3 months") return supplierTrendData.slice(-3);
    return supplierTrendData;
  }, [period]);

  
const categoryData = useMemo(() => {
  const totals: Record<string, { spend: number; count: number }> = {};

  dashboardRecords.forEach((supplier) => {
    const category = supplier.category;
    const current = totals[category] ?? { spend: 0, count: 0 };

    totals[category] = {
      spend: current.spend + supplier.spend,
      count: current.count + 1,
    };
  });

  return Object.entries(totals).map(([category, values]) => ({
    category,
    spend: values.spend,
    suppliers: values.count,
  }));
}, [dashboardRecords]);

  const visibleExceptions = supplierExceptions.filter(
    (exception) =>
      region === "All Regions" || exception.region === region,
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((current) => !current);
    } else {
      setSortKey(key);
      setSortAsc(key === "name" || key === "region");
    }
  }

  function resetFilters() {
    setRegion("All Regions");
    setPeriod("Last 12 months");
    setQuery("");
  }

  return (
    <main className="mx-auto max-w-[1540px] px-4 pb-10 pt-7 sm:px-6 lg:px-8">
      {/*<div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span>Workspace</span>
        <ArrowRight className="size-3" />
        <span className="text-foreground">Supplier Performance</span>
      </div>*/}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-semibold leading-tight sm:text-[27px]">
            Supplier Performance
          </h1>
          <p className="mt-2 max-w-[700px] text-sm leading-5 text-muted-foreground">
            Monitor supplier reliability, product quality, lead times, and
            sourcing risks across your supply network.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          Export report
        </Button>
      </div>

      <section
        aria-label="Supplier filters"
        className="mt-6 flex flex-wrap items-center gap-2.5 border-y border-border py-3"
      >
        <span className="flex items-center gap-2 pr-1 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </span>

        <Select
          value={period}
          onValueChange={(value) =>
            setPeriod(value as (typeof supplierPeriods)[number])
          }
        >
          <SelectTrigger aria-label="Performance period" className="h-8 w-full text-xs sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {supplierPeriods.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={region}
          onValueChange={(value) =>
            setRegion(value as (typeof supplierRegions)[number])
          }
        >
          <SelectTrigger aria-label="Supplier region" className="h-8 w-full text-xs sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {supplierRegions.map((option) => (
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
          Illustrative supplier data
        </span>
      </section>

      <section
        aria-label="Supplier KPIs"
        className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          label="On-Time Delivery"
          value={formatPercent(averageOnTime)}
          note="Average across selected suppliers"
          icon={<Truck className="size-4" />}
        />
        <KpiCard
          label="Quality Rate"
          value={formatPercent(averageQuality)}
          note="Average supplier quality"
          icon={<ShieldCheck className="size-4" />}
        />
        <KpiCard
          label="Average Lead Time"
          value={`${averageLeadTime.toFixed(1)} days`}
          note="Average replenishment lead time"
          icon={<CalendarClock className="size-4" />}
        />
        <KpiCard
          label="High-Risk Suppliers"
          value={String(highRiskCount)}
          note={`${supplierCount} suppliers in selected scope`}
          icon={<ShieldAlert className="size-4" />}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div className="dashboard-panel min-w-0">
          <h2 className="text-sm font-semibold">
            Supplier Performance Trend
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Monthly on-time delivery and quality rates · Illustrative
          </p>
          <div className="mt-4 h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={trend}
                margin={{ top: 8, right: 12, left: -15, bottom: 0 }}
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
                  dataKey="onTimeDelivery"
                  name="On-time delivery"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#2563eb" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="qualityRate"
                  name="Quality rate"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                  dot={{ r: 3, fill: "#0d9488" }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-panel min-w-0">
          <h2 className="text-sm font-semibold">Supplier Spend by Category</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Total spend across selected suppliers · USD
          </p>
          <div className="mt-4 h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 8, right: 12, left: 12, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--chart-grid)"
                  strokeDasharray="3 4"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "var(--chart-label)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={90}
                  tick={{ fill: "var(--chart-label)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
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
                  dataKey="spend"
                  name="Supplier spend"
                  radius={[0, 3, 3, 0]}
                  isAnimationActive={false}
                >
                  {categoryData.map((item, index) => (
                    <Cell
                      key={item.category}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-md border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">Supplier Comparison</h2>
              <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-[11px]">
                {records.length}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Compare delivery, quality, lead time, and supplier spend.
            </p>
          </div>
          <div className="relative w-full sm:max-w-[340px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search suppliers"
              placeholder="Search supplier, region, category, or risk"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        {records.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-xs">
              <thead>
                <tr className="h-10 border-b border-border bg-muted/35 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {(
                    [
                      ["name", "Supplier"],
                      ["region", "Region"],
                      ["onTimeDelivery", "On-time delivery"],
                      ["qualityRate", "Quality rate"],
                      ["leadTime", "Lead time"],
                      ["spend", "Annual spend"],
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
                  <th className="px-3">Risk</th>
                  <th className="px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="h-[58px] hover:bg-muted/30"
                  >
                    <td className="px-4">
                      <p className="font-medium">{supplier.name}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {supplier.id} · {supplier.category}
                      </p>
                    </td>
                    <td className="px-3">{supplier.region}</td>
                    <td className="px-3 tabular-nums">
                      {formatPercent(supplier.onTimeDelivery)}
                    </td>
                    <td className="px-3 tabular-nums">
                      {formatPercent(supplier.qualityRate)}
                    </td>
                    <td className="px-3 tabular-nums">
                      {supplier.leadTime} days
                    </td>
                    <td className="px-3 tabular-nums">
                      {formatCurrency(supplier.spend)}
                    </td>
                    <td className="px-3">
                      <RiskBadge risk={supplier.risk} />
                    </td>
                    <td className="px-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px]"
                        onClick={() => setSelectedSupplier(supplier)}
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
            <p className="mt-3 text-sm font-medium">No suppliers found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try another search or region.
            </p>
          </div>
        )}

        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-5">
          Showing {records.length} of {supplierCount} suppliers in the selected region
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-md border border-border bg-card">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <h2 className="text-base font-semibold">Supplier Risk Exceptions</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Suppliers that may require corrective action or closer monitoring.
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
                    {exception.supplierName}
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      · {exception.type}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {exception.id} · {exception.supplierId} · {exception.region}
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
              No supplier exceptions for this region.
            </p>
          )}
        </div>
      </section>

      <p className="mt-5 text-[11px] text-muted-foreground">
        Illustrative data · Not connected to operational systems
      </p>

      <Sheet
        open={selectedSupplier !== null || selectedException !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSupplier(null);
            setSelectedException(null);
          }
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-[440px]">
          {selectedSupplier && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedSupplier.name}</SheetTitle>
                <SheetDescription>
                  {selectedSupplier.id} · Supplier performance details
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-5">
                <Detail label="Region" value={selectedSupplier.region} />
                <Detail label="Category" value={selectedSupplier.category} />
                <Detail
                  label="On-time delivery"
                  value={formatPercent(selectedSupplier.onTimeDelivery)}
                />
                <Detail
                  label="Quality rate"
                  value={formatPercent(selectedSupplier.qualityRate)}
                />
                <Detail
                  label="Lead time"
                  value={`${selectedSupplier.leadTime} days`}
                />
                <Detail
                  label="Annual spend"
                  value={formatCurrency(selectedSupplier.spend)}
                />
                <Detail label="Risk level" value={selectedSupplier.risk} />
              </div>
              <Button
                className="w-full"
                onClick={() => setSelectedSupplier(null)}
              >
                Close details
              </Button>
            </>
          )}

          {selectedException && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedException.supplierName}</SheetTitle>
                <SheetDescription>
                  {selectedException.id} · {selectedException.type}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-5">
                <Detail label="Supplier ID" value={selectedException.supplierId} />
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

function RiskBadge({ risk }: { risk: SupplierRecord["risk"] }) {
  const className =
    risk === "High"
      ? "bg-critical/10 text-critical"
      : risk === "Medium"
        ? "bg-warning/10 text-warning"
        : "bg-positive/10 text-positive";

  return (
    <span className={`inline-flex rounded-sm px-2 py-1 text-[10px] font-medium ${className}`}>
      {risk}
    </span>
  );
}
