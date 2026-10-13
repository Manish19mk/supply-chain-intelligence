import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Download,
  FilterX,
  MoreHorizontal,
  PackageCheck,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  TrendingUp,
  PackageX,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  calculateKpis,
  businessUnits,
  getDeliveryTrend,
  getInventoryHealth,
  exceptions,
  filterExceptions,
  regions,
  sampleDataSnapshot,
  type DashboardFilters,
  type ExceptionStatus,
  type Severity,
  type SupplyChainException,
} from "@/data/supply-chain";

type Props = { globalSearch?: string; onGlobalSearch: (value: string) => void };

const initialFilters: DashboardFilters = {
  dateRange: "Last 30 days",
  region: "All Regions",
  businessUnit: "All Business Units",
};

export function OverviewDashboard({ globalSearch = "", onGlobalSearch }: Props) {
  const [filters, setFilters] = useState(initialFilters);
  const [tableQuery, setTableQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All Severities");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortKey, setSortKey] = useState<"id" | "title" | "category" | "location" | "severity" | "detected" | "status">("detected");
  const [sortAsc, setSortAsc] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeException, setActiveException] = useState<SupplyChainException | null>(null);
  const [drawerMode, setDrawerMode] = useState<"details" | "investigate">("details");
  const [owners, setOwners] = useState<Record<string, string>>({});
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ExceptionStatus>>({});
  const [assignmentMessage, setAssignmentMessage] = useState("");
  const kpis = useMemo(() => calculateKpis(filters), [filters]);
  const visibleExceptions = useMemo(() => {
    const tableSearch = tableQuery.trim().toLowerCase();
    const workspaceSearch = globalSearch.trim().toLowerCase();
    const severityOrder: Record<Severity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return filterExceptions(exceptions, filters)

.map((record) => ({
  ...record,
  owner: owners[record.id] ?? record.owner,
  status: statusOverrides[record.id] ?? record.status,
}))
      .filter((record) => !tableSearch || `${record.id} ${record.title} ${record.location}`.toLowerCase().includes(tableSearch))
      .filter((record) => !workspaceSearch || `${record.id} ${record.title} ${record.location}`.toLowerCase().includes(workspaceSearch))
      .filter((record) => severityFilter === "All Severities" || record.severity === severityFilter)
      .filter((record) => statusFilter === "All Statuses" || record.status === statusFilter)
      .sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        const direction = sortAsc ? 1 : -1;
        if (sortKey === "severity") return (severityOrder[a.severity] - severityOrder[b.severity]) * direction;
        if (sortKey === "detected") {
          const freshness: Record<string, number> = { "18 min ago": 0, "46 min ago": 1, "2 hours ago": 2, "4 hours ago": 3, Yesterday: 4, "2 days ago": 5 };
          return ((freshness[a.detected] ?? 99) - (freshness[b.detected] ?? 99)) * direction;
        }
        return String(aValue).localeCompare(String(bValue)) * direction;
      });
  }, [filters, globalSearch, severityFilter, sortAsc, sortKey, statusFilter, statusOverrides, tableQuery]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, globalSearch, severityFilter, statusFilter, tableQuery]);
  const hasFilters = filters.region !== "All Regions" || filters.businessUnit !== "All Business Units" || filters.dateRange !== "Last 30 days";
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(visibleExceptions.length / pageSize));
  const effectivePage = Math.min(currentPage, pageCount);
  const pageStart = (effectivePage - 1) * pageSize;
  const exceptionsToShow = showAll ? visibleExceptions : visibleExceptions.slice(pageStart, pageStart + pageSize);
  const trend = getDeliveryTrend(filters.dateRange);
  const inventory = getInventoryHealth(filters.region, filters.businessUnit);
  const inventoryTotal = inventory.reduce((total, category) => total + category.units, 0);
  const trendStart = trend[0]?.day;
  const trendEnd = trend.at(-1)?.day;
  const latestDelivery = trend.at(-1)?.actual.toFixed(1) ?? "—";
  const snapshotLabel = `${new Date(sampleDataSnapshot).toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" })} UTC`;

  
function resetFilters() {
  setFilters(initialFilters);
  setTableQuery("");
  setSeverityFilter("All Severities");
  setStatusFilter("All Statuses");
  setSortKey("detected");
  setSortAsc(true);
  setShowAll(false);
  setCurrentPage(1);
  setActiveException(null);
  onGlobalSearch("");
}


  function updateOwner(record: SupplyChainException, owner: string) {
    setOwners((current) => ({ ...current, [record.id]: owner }));
    setAssignmentMessage(`${record.id} assigned to ${owner}`);
    window.setTimeout(() => setAssignmentMessage(""), 2600);
  }

  
function openDrawer(
  record: SupplyChainException,
  mode: "details" | "investigate",
) {
  setActiveException({
    ...record,
    owner: owners[record.id] ?? record.owner,
    status: statusOverrides[record.id] ?? record.status,
  });
  setDrawerMode(mode);
}


  return (
    <main className="mx-auto max-w-[1540px] px-4 pb-10 pt-7 sm:px-6 lg:px-8">
      {/*<div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground"><span>Workspace</span><ArrowRight className="size-3" /><span className="text-foreground">Overview</span></div>*/}
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          
          <h1 className="text-[25px] font-semibold leading-tight tracking-normal sm:text-[27px]">Overview</h1>
          <p className="mt-2 max-w-[650px] text-sm leading-5 text-muted-foreground">Monitor network performance, identify risks, and prioritize operational action.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          Export report
        </Button>
      </div>

      <section aria-label="Dashboard filters" className="mt-6 flex flex-wrap items-center gap-2.5 border-y border-border py-3">
        <div className="flex items-center gap-2 pr-1 text-xs font-medium text-muted-foreground"><SlidersHorizontal className="size-3.5" /><span>Filters</span></div>
        <FilterSelect label="Date range" value={filters.dateRange} options={["Last 7 days", "Last 30 days", "Last 90 days"]} onChange={(value) => setFilters((current) => ({ ...current, dateRange: value }))} />
        <FilterSelect label="Region" value={filters.region} options={regions} onChange={(value) => setFilters((current) => ({ ...current, region: value }))} />
        <FilterSelect label="Business unit" value={filters.businessUnit} options={businessUnits} onChange={(value) => setFilters((current) => ({ ...current, businessUnit: value }))} />
        {hasFilters && <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 gap-1.5 px-2 text-xs"><FilterX className="size-3.5" />Reset filters</Button>}
        <span className="ml-auto hidden text-xs text-muted-foreground lg:inline">Illustrative snapshot · {snapshotLabel}</span>
      </section>

      <section aria-label="Key performance indicators" className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((metric) => <KpiCard key={metric.label} metric={metric} />)}
      </section>

      <section aria-label="Supply chain analytics" className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,1fr)]">
        <div className="dashboard-panel min-w-0">
          <div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-semibold">On-Time Delivery Trend</h2><p className="mt-1 text-xs text-muted-foreground">Selected: {filters.dateRange} · {trend.length} source observations · sample coverage {trendStart}–{trendEnd} · every 2 days</p></div><span className="inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-positive-subtle px-2 py-1 text-xs font-medium text-positive"><TrendingUp className="size-3.5" />Latest observation · {latestDelivery}%</span></div>
          <div className="mt-4 h-[238px] min-w-0" role="img" aria-label="Line chart showing on-time delivery trend against a 95 percent target">
            <ResponsiveContainer width="100%" height="100%"><LineChart data={trend} margin={{ top: 10, right: 8, left: -21, bottom: 0 }}>
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "var(--chart-label)", fontSize: 10 }} axisLine={false} tickLine={false} interval={2} dy={8} />
              <YAxis domain={[90, 98]} ticks={[90, 92, 94, 96, 98]} tickFormatter={(value) => `${value}%`} tick={{ fill: "var(--chart-label)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<DeliveryTooltip />} />
              <ReferenceLine y={95} stroke="var(--warning)" strokeDasharray="5 4" label={{ value: "95% target", fill: "var(--warning)", fontSize: 10, position: "insideTopRight" }} />
              <Line type="monotone" dataKey="actual" name="On-time delivery" stroke="var(--primary)" strokeWidth={3} dot={{ r: 2.5, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 1 }} activeDot={{ r: 4, fill: "var(--primary)", stroke: "var(--background)", strokeWidth: 2 }} isAnimationActive={false} />
            </LineChart></ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-2"><i className="h-0.5 w-4 rounded bg-primary" />Actual delivery</span><span className="inline-flex items-center gap-2"><i className="w-4 border-t border-dashed border-warning" />95% target</span><span className="ml-auto inline-flex items-center gap-1"><ArrowUpRight className="size-3.5 text-positive" />+1.8% from prior period</span></div>
        </div>

        <div className="dashboard-panel min-w-0">
          <div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-semibold">Inventory Health</h2><p className="mt-1 text-xs text-muted-foreground">
  {filters.region === "All Regions" &&
  filters.businessUnit === "All Business Units"
    ? "Network-wide unit distribution"
    : `${filters.region === "All Regions" ? "All regions" : filters.region} · ${
        filters.businessUnit === "All Business Units"
          ? "All business units"
          : filters.businessUnit
      }`}
</p></div><span className="rounded-sm bg-secondary px-2 py-1 text-[10px] font-medium text-secondary-foreground">4 categories</span></div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><span className="text-lg font-semibold text-foreground">{inventoryTotal.toLocaleString()}</span><span>tracked units</span><span className="ml-auto">by inventory status</span></div>
          <div className="mt-2 h-[196px] min-w-0" role="img" aria-label="Horizontal bar chart showing healthy, at risk, overstocked and stockout inventory units">
            <ResponsiveContainer width="100%" height="100%"><BarChart data={inventory} layout="vertical" margin={{ top: 4, right: 26, left: 0, bottom: 4 }} barCategoryGap="24%">
              <CartesianGrid stroke="var(--chart-grid)" horizontal={false} />
              <XAxis type="number" tickFormatter={(value) => `${Math.round(value / 1000)}k`} tick={{ fill: "var(--chart-label)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fill: "var(--chart-label)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<InventoryTooltip />} cursor={{ fill: "var(--chart-grid)" }} />
              <Bar dataKey="units" name="Units" radius={[0, 3, 3, 0]} maxBarSize={24} isAnimationActive={false} label={{ position: "right", fill: "var(--chart-label)", fontSize: 10, formatter: (value: number) => value.toLocaleString() }}>{inventory.map((item) => <Cell key={item.name} fill={item.fill} />)}</Bar>
            </BarChart></ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border pt-3">
            {inventory.map((item) => <div key={item.name} className="flex min-w-0 items-center gap-2 text-xs"><span aria-hidden="true" className={`size-2.5 shrink-0 rounded-sm ${item.legendClass}`} /><span className="truncate text-muted-foreground">{item.name}</span><span className="ml-auto font-medium tabular-nums">{item.units.toLocaleString()}</span></div>)}
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-md border border-border bg-card">
        <div className="grid gap-4 border-b border-border px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0"><div className="flex items-center gap-2"><h2 className="text-base font-semibold">Priority Exceptions</h2><span className="rounded-sm bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-secondary-foreground">{visibleExceptions.length}</span></div><p className="mt-1 text-xs text-muted-foreground">Issues requiring investigation or operational action.</p></div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(180px,1fr)_145px_145px] lg:w-auto">
            <div className="relative"><Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search priority exceptions" placeholder="Search ID or description" value={tableQuery} onChange={(event) => setTableQuery(event.target.value)} className="h-8 pl-8 text-xs" /></div>
            <FilterSelect label="Severity" value={severityFilter} options={["All Severities", "Critical", "High", "Medium", "Low"]} onChange={setSeverityFilter} />
            <FilterSelect label="Status" value={statusFilter} options={["All Statuses", "Open", "Investigating", "Resolved"]} onChange={setStatusFilter} />
          </div>
        </div>
        {assignmentMessage && <div role="status" className="flex items-center gap-2 border-b border-border bg-positive-subtle px-5 py-2 text-xs text-positive"><Check className="size-3.5" />{assignmentMessage}<button className="ml-auto" aria-label="Dismiss assignment message" onClick={() => setAssignmentMessage("")}><X className="size-3.5" /></button></div>}
        {visibleExceptions.length > 0 ? <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] border-collapse text-left text-xs">
              <thead><tr className="h-10 border-b border-border bg-muted/35 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                <SortableHeader label="Exception ID" field="id" current={sortKey} asc={sortAsc} onSort={setSort} />
                <SortableHeader label="Exception" field="title" current={sortKey} asc={sortAsc} onSort={setSort} />
                <SortableHeader label="Category" field="category" current={sortKey} asc={sortAsc} onSort={setSort} />
                <SortableHeader label="Location" field="location" current={sortKey} asc={sortAsc} onSort={setSort} />
                <SortableHeader label="Severity" field="severity" current={sortKey} asc={sortAsc} onSort={setSort} />
                <SortableHeader label="Detected" field="detected" current={sortKey} asc={sortAsc} onSort={setSort} />
                <SortableHeader label="Status" field="status" current={sortKey} asc={sortAsc} onSort={setSort} />
                <th className="w-12 px-3 text-right font-semibold">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {exceptionsToShow.map((record) => <tr key={record.id} className="group h-[58px] transition-colors hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4"><button className="font-medium text-primary hover:underline" onClick={() => openDrawer(record, "details")}>{record.id}</button></td>
                  <td className="max-w-[310px] px-3"><button className="block max-w-full truncate text-left font-medium text-foreground hover:text-primary" onClick={() => openDrawer(record, "details")}>{record.title}</button><span className="mt-1 block truncate text-[10px] text-muted-foreground">{record.impact}</span></td>
                  <td className="whitespace-nowrap px-3 text-muted-foreground">{record.category}</td>
                  <td className="whitespace-nowrap px-3 text-muted-foreground">{record.location}</td>
                  <td className="whitespace-nowrap px-3"><SeverityBadge severity={record.severity} /></td>
                  <td className="whitespace-nowrap px-3 text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Clock3 className="size-3" />{record.detected}</span></td>
                  <td className="whitespace-nowrap px-3"><StatusBadge status={record.status} /></td>
                  <td className="px-3 text-right"><RowActions record={record} onDetails={() => openDrawer(record, "details")} onInvestigate={() => openDrawer(record, "investigate")} onAssign={updateOwner} /></td>
                </tr>)}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-muted-foreground">Showing <span className="font-medium text-foreground">{visibleExceptions.length === 0 ? 0 : showAll ? 1 : pageStart + 1}–{showAll ? visibleExceptions.length : Math.min(pageStart + pageSize, visibleExceptions.length)}</span> of <span className="font-medium text-foreground">{visibleExceptions.length}</span> exceptions{filters.region !== "All Regions" ? ` · ${filters.region}` : ""}</p>
            <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" disabled={showAll || effectivePage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}><ChevronLeft className="size-3.5" />Previous</Button>{visibleExceptions.length > pageSize && <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => { setShowAll(!showAll); setCurrentPage(1); }}>{showAll ? "Show less" : "Show all"}<ChevronDown className={`size-3.5 transition-transform ${showAll ? "rotate-180" : ""}`} /></Button>}<Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" disabled={showAll || effectivePage >= pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}><span className="hidden sm:inline">Next</span><ChevronRight className="size-3.5" /></Button></div>
          </div>
        </> : <div className="flex min-h-[230px] flex-col items-center justify-center px-6 text-center"><div className="grid size-10 place-items-center rounded-md bg-muted"><Search className="size-5 text-muted-foreground" /></div><h3 className="mt-3 text-sm font-semibold">No exceptions found</h3><p className="mt-1 max-w-sm text-xs text-muted-foreground">Try a different search or adjust the active filters to see more results.</p><Button variant="ghost" size="sm" className="mt-3 gap-1.5 text-xs" onClick={() => { setTableQuery(""); setSeverityFilter("All Severities"); setStatusFilter("All Statuses"); onGlobalSearch(""); }}><RotateCcw className="size-3.5" />Clear table filters</Button></div>}
      </section>

      <div className="mt-5 flex items-center justify-between gap-4 text-[11px] text-muted-foreground"><span className="inline-flex items-center gap-1.5">Illustrative data · Not connected to operational systems</span></div>

      <Sheet open={activeException !== null} onOpenChange={(open) => { if (!open) setActiveException(null); }}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-[440px]">
          {activeException && <ExceptionDrawerContent record={activeException} owner={owners[activeException.id] ?? activeException.owner} mode={drawerMode} onInvestigate={() => setDrawerMode("investigate")} onStatusChange={(status) => { setStatusOverrides((current) => ({ ...current, [activeException.id]: status })); setActiveException({ ...activeException, status }); }} />}
        </SheetContent>
      </Sheet>
    </main>
  );

  function setSort(field: SortField) {
    if (sortKey === field) setSortAsc((value) => !value);
    else { setSortKey(field); setSortAsc(true); }
  }
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="h-8 w-full gap-2 bg-background px-2.5 text-xs sm:w-auto sm:min-w-[132px]"><SelectValue /></SelectTrigger><SelectContent align="start">{options.map((option) => <SelectItem key={option} value={option} className="text-xs">{option}</SelectItem>)}</SelectContent></Select>;
}

function KpiCard({ metric }: { metric: ReturnType<typeof calculateKpis>[number] }) {
  const positiveTrend = metric.positive;
  const movingUp = metric.direction === "up";
  const icon = metric.icon === "truck" ? <Truck /> : metric.icon === "boxes" ? <PackageCheck /> : metric.icon === "rotate" ? <RefreshCw /> : <PackageX />;
  return <article className="dashboard-panel flex min-h-[144px] flex-col justify-between p-4" aria-label={`${metric.label}: ${metric.value}, ${metric.change} ${metric.changeMeaning}, ${positiveTrend ? "favorable" : "requires attention"}`}>
    <div className="flex items-center justify-between gap-2"><span className="text-xs font-medium text-muted-foreground">{metric.label}</span><span className={`grid size-8 place-items-center rounded-sm ${positiveTrend ? "bg-positive-subtle text-positive" : "bg-warning-subtle text-warning"}`}>{icon}</span></div>
    <div className="mt-3"><div className="text-[27px] font-semibold leading-none tabular-nums">{metric.value}</div>{metric.detail && <div className="mt-1.5 text-[10px] text-muted-foreground">{metric.detail}</div>}<div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]"><span className={`inline-flex items-center gap-0.5 font-semibold ${positiveTrend ? "text-positive" : "text-critical"}`}>{movingUp ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}{metric.change}</span><span className="text-muted-foreground">{metric.note}</span></div></div>
  </article>;
}

type SortField = "id" | "title" | "category" | "location" | "severity" | "detected" | "status";

function SortableHeader({ label, field, current, asc, onSort }: { label: string; field: SortField; current: string; asc: boolean; onSort: (field: SortField) => void }) {
  return <th className="whitespace-nowrap px-3 first:pl-4"><button onClick={() => onSort(field)} className="inline-flex items-center gap-1.5 hover:text-foreground" aria-label={`Sort by ${label}`} aria-sort={current === field ? (asc ? "ascending" : "descending") : "none"}>{label}<span className={`text-[9px] ${current === field ? "text-primary" : "opacity-50"}`}>{current === field ? (asc ? "↑" : "↓") : "↕"}</span></button></th>;
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const styles: Record<Severity, string> = { Critical: "bg-critical-subtle text-critical", High: "bg-warning-subtle text-warning", Medium: "bg-info-subtle text-info", Low: "bg-muted text-muted-foreground" };
  return <span className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[10px] font-medium ${styles[severity]}`}><span className="size-1.5 rounded-full bg-current" />{severity}</span>;
}

function StatusBadge({ status }: { status: ExceptionStatus }) {
  const styles: Record<ExceptionStatus, string> = { Open: "bg-critical-subtle text-critical", Investigating: "bg-info-subtle text-info", Resolved: "bg-positive-subtle text-positive" };
  return <span className={`inline-flex items-center rounded-sm px-2 py-1 text-[10px] font-medium ${styles[status]}`}>{status}</span>;
}

function RowActions({ record, onDetails, onInvestigate, onAssign }: { record: SupplyChainException; onDetails: () => void; onInvestigate: () => void; onAssign: (record: SupplyChainException, owner: string) => void }) {
  return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Actions for ${record.id}`} className="size-7"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44"><DropdownMenuItem onSelect={onDetails}><PackageCheck />View details</DropdownMenuItem><DropdownMenuItem onSelect={onInvestigate}><Search />Investigate</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onSelect={() => onAssign(record, "Morgan Carter")}>Assign to Morgan</DropdownMenuItem><DropdownMenuItem onSelect={() => onAssign(record, "Priya Nair")}>Assign to Priya</DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
}

function ExceptionDrawerContent({ record, owner, mode, onInvestigate, onStatusChange }: { record: SupplyChainException; owner: string; mode: "details" | "investigate"; onInvestigate: () => void; onStatusChange: (status: ExceptionStatus) => void }) {
  return <>
    <SheetHeader className="border-b border-border pb-5 pr-8 text-left"><div className="mb-2 flex items-center gap-2"><span className="font-mono text-xs font-medium text-primary">{record.id}</span><SeverityBadge severity={record.severity} /></div><SheetTitle className="text-lg leading-6">{mode === "investigate" ? "Investigate exception" : record.title}</SheetTitle><SheetDescription>{mode === "investigate" ? "Review the signal and update its local prototype status." : "Exception details and operational impact."}</SheetDescription></SheetHeader>
    <div className="space-y-5 py-5"><div className="grid grid-cols-2 gap-4"><DetailItem label="Category" value={record.category} /><DetailItem label="Location" value={record.location} /><DetailItem label="Detected" value={record.detected} /><div><span className="text-[11px] text-muted-foreground">Status</span><div className="mt-1"><StatusBadge status={record.status} /></div></div></div><div className="border-t border-border pt-4"><DetailItem label="Estimated impact" value={record.impact} /><p className="mt-4 text-[11px] text-muted-foreground">Business unit</p><p className="mt-1 text-sm">{record.businessUnit}</p><p className="mt-4 text-[11px] text-muted-foreground">Region</p><p className="mt-1 text-sm">{record.region}</p><p className="mt-4 text-[11px] text-muted-foreground">Assigned owner</p><div className="mt-1 flex items-center gap-2"><Avatar className="size-6"><AvatarFallback className="bg-secondary text-[9px]">{owner === "Unassigned" ? "—" : owner.split(" ").map((part) => part[0]).join("")}</AvatarFallback></Avatar><span className="text-sm">{owner}</span></div></div><div className="rounded-sm border border-border bg-muted/40 p-3"><div className="flex items-center gap-2 text-xs font-medium"><CalendarDays className="size-3.5 text-muted-foreground" />Recommended next step</div><p className="mt-2 text-xs leading-5 text-muted-foreground">Confirm the latest supply signal with the local operations owner and review impacted orders.</p></div></div>
    <div className="mt-2 flex gap-2 border-t border-border pt-4"><Button onClick={() => onStatusChange(record.status === "Investigating" ? "Resolved" : "Investigating")} className="flex-1 gap-2">{record.status === "Investigating" ? <Check className="size-4" /> : <Search className="size-4" />}{record.status === "Investigating" ? "Mark resolved" : "Start investigating"}</Button>{mode === "details" && <Button variant="outline" onClick={onInvestigate}>Investigate</Button>}</div><p className="mt-3 text-center text-[10px] text-muted-foreground">Prototype only · Changes remain local to this session</p>
  </>;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium leading-5">{value}</p></div>;
}

function DeliveryTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  const datum = payload?.[0];
  if (!active || !datum) return null;
  return <div className="rounded-sm border border-border bg-popover px-3 py-2 text-xs shadow-sm"><p className="mb-1.5 font-medium">{label}, 2026</p><p className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full bg-primary" />On-time delivery <strong className="ml-2 text-foreground">{datum.value.toFixed(1)}%</strong></p><p className="mt-1 flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full bg-warning" />Target <strong className="ml-auto text-foreground">95.0%</strong></p></div>;
}

function InventoryTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; units: number } }> }) {
  const datum = payload?.[0]?.payload;
  if (!active || !datum) return null;
  return <div className="rounded-sm border border-border bg-popover px-3 py-2 text-xs shadow-sm"><p className="font-medium">{datum.name}</p><p className="mt-1 text-muted-foreground">{datum.units.toLocaleString()} units</p></div>;
}