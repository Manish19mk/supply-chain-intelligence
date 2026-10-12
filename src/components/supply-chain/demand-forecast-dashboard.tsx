
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Target,
  Scale,
  ChartNoAxesCombined,
  Activity,
  Search,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
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
  demandExceptions,
  demandPeriods,
  demandRecords,
  demandRegions,
  demandTrendData,
  demandDailyTrendData,
  type DemandException,
  type DemandRecord,
} from "@/data/demand-forecast";

const chartColors = ["#2563eb", "#0d9488", "#7c3aed"];

type SortKey = "sku" | "product" | "region" | "actual" | "forecast" | "variance";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function getVariance(record: DemandRecord) {
  return record.actual - record.forecast;
}

function getAccuracy(records: DemandRecord[]) {
  const actualTotal = records.reduce((sum, record) => sum + record.actual, 0);
  const absoluteError = records.reduce(
    (sum, record) => sum + Math.abs(record.actual - record.forecast),
    0,
  );

  return actualTotal > 0
    ? Math.max(0, (1 - absoluteError / actualTotal) * 100)
    : 0;
}

export function DemandForecastDashboard() {
  const [region, setRegion] = useState<(typeof demandRegions)[number]>("All Regions");
  const [period, setPeriod] = useState<(typeof demandPeriods)[number]>("Last month");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("variance");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedException, setSelectedException] =
    useState<DemandException | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DemandRecord | null>(null);

  const records = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return demandRecords
      .filter((record) => region === "All Regions" || record.region === region)
      .filter((record) =>
        !normalizedQuery ||
        `${record.sku} ${record.product} ${record.category} ${record.region}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .sort((a, b) => {
        const getValue = (record: DemandRecord) =>
          sortKey === "variance" ? getVariance(record) : record[sortKey];
        const aValue = getValue(a);
        const bValue = getValue(b);
        const comparison =
          typeof aValue === "number" && typeof bValue === "number"
            ? aValue - bValue
            : String(aValue).localeCompare(String(bValue));
        return comparison * (sortAsc ? 1 : -1);
      });
  }, [region, query, sortKey, sortAsc]);
    
    
const dashboardRecords = useMemo(
  () =>
    demandRecords.filter(
      (record) =>
        region === "All Regions" || record.region === region,
    ),
  [region],
);


  const totalActual = dashboardRecords.reduce((sum, record) => sum + record.actual, 0);
  const totalForecast = dashboardRecords.reduce((sum, record) => sum + record.forecast, 0);
  const accuracy = getAccuracy(dashboardRecords);
  const bias = totalActual > 0
    ? ((totalForecast - totalActual) / totalActual) * 100
    : 0;
  const growth = dashboardRecords.reduce(
    (sum, record) => sum + record.forecast - record.previousForecast,
    0,
  );
  const growthPercent = dashboardRecords.reduce(
    (sum, record) => sum + record.previousForecast,
    0,
  ) > 0
    ? (growth / dashboardRecords.reduce((sum, record) => sum + record.previousForecast, 0)) * 100
    : 0;

  const visibleExceptions = demandExceptions.filter(
    (exception) => region === "All Regions" || exception.region === region,
  );

  



const trend = useMemo(() => {
  if (period === "Last month") {
    return demandDailyTrendData;
  }

  const historicalData = demandTrendData.filter(
    (point) => point.actual !== null,
  );

  if (period === "Last 3 months") {
    return historicalData.slice(-3);
  }

  return demandTrendData;
}, [period]);




  
  const categoryData = useMemo(() => {
    const filteredRecords = demandRecords.filter(
      (record) => region === "All Regions" || record.region === region,
    );

    const totals = filteredRecords.reduce<Record<string, number>>(
      (acc, record) => {
        acc[record.category] =
          (acc[record.category] ?? 0) + record.forecast;
        return acc;
      },
      {},
    );

    return Object.entries(totals).map(([category, demand]) => ({
      category,
      demand,
    }));
  }, [region]);


  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((current) => !current);
    else {
      setSortKey(key);
      setSortAsc(key !== "variance");
    }
  }

  function resetFilters() {
    setRegion("All Regions");
    setPeriod("Last 3 months");
    setQuery("");
  }

  return (
    <main className="mx-auto max-w-[1540px] px-4 pb-10 pt-7 sm:px-6 lg:px-8">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span>Workspace</span><ArrowRight className="size-3" />
        <span className="text-foreground">Demand &amp; Forecast</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-semibold leading-tight sm:text-[27px]">
            Demand &amp; Forecast
          </h1>
          <p className="mt-2 max-w-[780px] text-sm leading-5 text-muted-foreground">
            Understand demand patterns, evaluate forecast accuracy, and identify
            shifts that may affect replenishment planning.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          Export report
        </Button>
      </div>

      <section aria-label="Demand filters" className="mt-6 flex flex-wrap items-center gap-2.5 border-y border-border py-3">
        <span className="flex items-center gap-2 pr-1 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="size-3.5" /> Filters
        </span>
        <Select value={period} onValueChange={(value) => setPeriod(value as typeof period)}>
          <SelectTrigger aria-label="Forecast period" className="h-8 w-full sm:w-[160px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {demandPeriods.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={region} onValueChange={(value) => setRegion(value as typeof region)}>
          <SelectTrigger aria-label="Region" className="h-8 w-full sm:w-[160px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {demandRegions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
          </SelectContent>
        </Select>
        {(region !== "All Regions" || period !== "Last month" || query) && (
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={resetFilters}>Reset filters</Button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">Illustrative planning data</span>
      </section>

      <section aria-label="Demand KPIs" className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Forecast Accuracy" value={`${accuracy.toFixed(1)}%`} note="1 − absolute error / actual demand" icon={<Target className="size-4" />} />
        <KpiCard label="Forecast Bias" value={formatPercent(bias)} note="Positive means forecast exceeds actuals" icon={<Scale className="size-4" />} />
        <KpiCard label="Forecast Demand" value={formatNumber(totalForecast)} note="Units in the selected SKU scope" icon={<ChartNoAxesCombined className="size-4" />} />
        <KpiCard label="Demand Growth" value={formatPercent(growthPercent)} note="Forecast vs. previous forecast" icon={<TrendingUp className="size-4" />} />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div className="dashboard-panel min-w-0">
          <h2 className="text-sm font-semibold">Actual vs. Forecast Demand</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Historical demand and projected future demand · Illustrative
          </p>
          <div className="mt-4 h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trend} margin={{ top: 8, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 4" vertical={false} />
                
<XAxis
  dataKey="period"
  interval={0}
  tick={{ fill: "var(--chart-label)", fontSize: 10 }}
  axisLine={false}
  tickLine={false}
  minTickGap={0}
/>

                <YAxis tick={{ fill: "var(--chart-label)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "12px" }} />
                <Line
  type="monotone"
  dataKey="actual"
  name="Actual demand"
  stroke="#2563eb"
  strokeWidth={3}
  strokeLinecap="round"
  dot={{ r: 3, fill: "#2563eb", stroke: "#2563eb" }}
  activeDot={{ r: 5, fill: "#2563eb" }}
  connectNulls={false}
/>
                <Line
  type="monotone"
  dataKey="forecast"
  name="Forecast demand"
  stroke="#0d9488"
  strokeWidth={3}
  strokeDasharray="6 4"
  strokeLinecap="round"
  dot={{ r: 3, fill: "#0d9488", stroke: "#0d9488" }}
  activeDot={{ r: 5, fill: "#0d9488" }}
/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 border-t border-border pt-3 text-[11px] text-muted-foreground">
            Future actuals are intentionally blank. Forecast values are illustrative, not operational predictions.
          </p>
        </div>

        <div className="dashboard-panel min-w-0">
          <h2 className="text-sm font-semibold">Demand by Category</h2>
          <p className="mt-1 text-xs text-muted-foreground">Forecast demand units by product category</p>
          <div className="mt-4 h-[300px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 8, right: 12, left: 12, bottom: 0 }}>
                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 4" horizontal={false} />
                <XAxis type="number" tick={{ fill: "var(--chart-label)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" width={90} tick={{ fill: "var(--chart-label)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "12px" }} />
                <Bar
                 dataKey="demand"
                 name="Demand units"
                 radius={[0, 3, 3, 0]}
                 isAnimationActive={false}
                 fill="var(--chart-series-1)"
                 >
                  {categoryData.map((item, index) => <Cell key={item.category} fill={chartColors[index % chartColors.length]} />)}
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
              <h2 className="text-base font-semibold">Forecast Variance</h2>
              <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-[11px]">{records.length}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Compare actual demand with the latest forecast.</p>
          </div>
          <div className="relative w-full sm:max-w-[340px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Search forecast variance" placeholder="Search SKU, product, or region" value={query} onChange={(event) => setQuery(event.target.value)} className="h-8 pl-8 text-xs" />
          </div>
        </div>
        {records.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-xs">
              <thead><tr className="h-10 border-b border-border bg-muted/35 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {([
                  ["sku", "SKU"],
                  ["product", "Product"],
                  ["region", "Region"],
                  ["actual", "Actual"],
                  ["forecast", "Forecast"],
                  ["variance", "Variance"],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key} className="px-3 first:pl-4">
                    <button type="button" onClick={() => toggleSort(key)} className="inline-flex items-center gap-1 hover:text-foreground">
                      {label}{sortKey === key ? (sortAsc ? "↑" : "↓") : "↕"}
                    </button>
                  </th>
                ))}
                <th className="px-3 text-right">Details</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {records.map((record) => {
                  const variance = getVariance(record);
                  return (
                    <tr key={record.id} className="h-[58px] hover:bg-muted/30">
                      <td className="px-4 font-medium">{record.sku}</td>
                      <td className="px-3">{record.product}</td>
                      <td className="px-3">{record.region}</td>
                      <td className="px-3 tabular-nums">{formatNumber(record.actual)}</td>
                      <td className="px-3 tabular-nums">{formatNumber(record.forecast)}</td>
                      <td className={`px-3 font-medium tabular-nums ${variance >= 0 ? "text-positive" : "text-critical"}`}>
                        {variance > 0 ? "+" : ""}{formatNumber(variance)}
                      </td>
                      <td className="px-3 text-right">
                        <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => setSelectedRecord(record)}>Details</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
            <Search className="size-5 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">No forecast records found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try another search or region.</p>
          </div>
        )}
        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-5">
          Showing {records.length} of {demandRecords.length} illustrative SKU records
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-md border border-border bg-card">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <h2 className="text-base font-semibold">Demand Exceptions</h2>
          <p className="mt-1 text-xs text-muted-foreground">Signals that may require demand planner review.</p>
        </div>
        <div className="divide-y divide-border">
          {visibleExceptions.map((exception) => (
            <button key={exception.id} type="button" onClick={() => setSelectedException(exception)} className="flex w-full flex-col gap-2 px-4 py-4 text-left transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className={`mt-0.5 size-4 shrink-0 ${exception.severity === "High" ? "text-critical" : exception.severity === "Medium" ? "text-warning" : "text-muted-foreground"}`} />
                <div>
                  <p className="text-xs font-semibold">{exception.product} <span className="font-normal text-muted-foreground">· {exception.type}</span></p>
                  <p className="mt-1 text-xs text-muted-foreground">{exception.id} · {exception.sku} · {exception.region}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 self-start text-xs font-medium text-primary sm:self-auto">Review <ArrowRight className="size-3.5" /></span>
            </button>
          ))}
          {!visibleExceptions.length && <p className="px-5 py-8 text-center text-xs text-muted-foreground">No demand exceptions for this region.</p>}
        </div>
      </section>

      <p className="mt-5 text-[11px] text-muted-foreground">
        Illustrative data · Not connected to operational systems
      </p>

      <Sheet open={selectedException !== null || selectedRecord !== null} onOpenChange={(open) => {
        if (!open) { setSelectedException(null); setSelectedRecord(null); }
      }}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-[440px]">
          {selectedException && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedException.product}</SheetTitle>
                <SheetDescription>{selectedException.id} · {selectedException.type}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-5">
                <Detail label="SKU" value={selectedException.sku} />
                <Detail label="Region" value={selectedException.region} />
                <Detail label="Severity" value={selectedException.severity} />
                <Detail label="What happened" value={selectedException.description} />
                <div className="rounded-sm border border-border bg-muted/40 p-3">
                  <p className="text-xs font-semibold">Recommended planner action</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{selectedException.recommendedAction}</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => setSelectedException(null)}>Close review</Button>
            </>
          )}
          {selectedRecord && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedRecord.product}</SheetTitle>
                <SheetDescription>{selectedRecord.sku} · Forecast variance details</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-5">
                <Detail label="Region" value={selectedRecord.region} />
                <Detail label="Actual demand" value={`${formatNumber(selectedRecord.actual)} units`} />
                <Detail label="Forecast demand" value={`${formatNumber(selectedRecord.forecast)} units`} />
                <Detail label="Variance" value={`${getVariance(selectedRecord) > 0 ? "+" : ""}${formatNumber(getVariance(selectedRecord))} units`} />
                <Detail label="Variance percentage" value={formatPercent(selectedRecord.forecast ? (getVariance(selectedRecord) / selectedRecord.forecast) * 100 : 0)} />
              </div>
              <Button className="w-full" onClick={() => setSelectedRecord(null)}>Close details</Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}

function KpiCard({ label, value, note, icon }: {
  label: string;
  value: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="dashboard-panel flex min-h-[144px] flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="grid size-8 place-items-center rounded-sm bg-info-subtle text-info">{icon}</span>
      </div>
      <div className="mt-3">
        <div className="text-[27px] font-semibold leading-none tabular-nums">{value}</div>
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
