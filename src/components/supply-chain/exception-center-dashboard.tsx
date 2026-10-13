
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    AlertTriangle,
    ArrowRight,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Search,
  ShieldAlert,
  UserRoundPlus,
    UserRound,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  exceptionCategories,
  exceptionRecords,
  exceptionRegions,
  exceptionSeverities,
  exceptionStatuses,
  exceptionTrendData,
  type ExceptionSeverity,
  type ExceptionStatus,
  type SupplyChainException,
} from "@/data/exception-center";

const severityColors: Record<ExceptionSeverity, string> = {
  Critical: "#dc2626",
  High: "#ea580c",
  Medium: "#d97706",
  Low: "#2563eb",
};

const severityOrder: Record<ExceptionSeverity, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

const statusColors: Record<ExceptionStatus, string> = {
  Open: "#dc2626",
  "In Progress": "#2563eb",
  Resolved: "#16a34a",
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const formatHours = (value: number) => `${value.toFixed(1)}h`;

type SortKey =
  | "id"
  | "title"
  | "category"
  | "severity"
  | "status"
  | "region"
  | "owner"
  | "ageDays";

export function ExceptionCenterDashboard() {
  const [records, setRecords] = useState(exceptionRecords);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [severity, setSeverity] = useState("All Severities");
  const [timePeriod, setTimePeriod] = useState("Last 30 days");
  const [sourceModule, setSourceModule] = useState("All Modules");
  const [status, setStatus] = useState("All Statuses");
  const [category, setCategory] = useState("All Categories");
  const [sortKey, setSortKey] = useState<SortKey>("severity");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedException, setSelectedException] =
    useState<SupplyChainException | null>(null);
  const [ownerDraft, setOwnerDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState<ExceptionStatus>("Open");
  const [resolutionNote, setResolutionNote] = useState("");
  const [feedback, setFeedback] = useState("");

    const globalRecords = useMemo(() => {
  const referenceDate = new Date("2026-10-12T23:59:59");
  const cutoffDate = new Date(referenceDate);

  if (timePeriod === "Last 30 days") {
    cutoffDate.setDate(cutoffDate.getDate() - 30);
  } else if (timePeriod === "Last 90 days") {
    cutoffDate.setDate(cutoffDate.getDate() - 90);
  } else {
    cutoffDate.setMonth(cutoffDate.getMonth() - 12);
  }

  return records.filter((item) => {
    const matchesRegion =
      region === "All Regions" || item.region === region;

    const matchesSeverity =
      severity === "All Severities" || item.severity === severity;

    const matchesSource =
      sourceModule === "All Modules" ||
      item.sourceModule === sourceModule;

    const detectedDate = new Date(`${item.detectedDate}T00:00:00`);
    const matchesPeriod = detectedDate >= cutoffDate;

    return (
      matchesRegion &&
      matchesSeverity &&
      matchesSource &&
      matchesPeriod
    );
  });
    }, [records, region, severity, sourceModule, timePeriod]);
    
  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return globalRecords
      .filter((item) => {
        const matchesRegion =
          region === "All Regions" || item.region === region;
        const matchesSeverity =
          severity === "All Severities" || item.severity === severity;
        const matchesStatus =
          status === "All Statuses" || item.status === status;
        const matchesCategory =
          category === "All Categories" || item.category === category;

        const searchableText = [
          item.id,
          item.title,
          item.description,
          item.category,
          item.sourceModule,
          item.affectedEntity,
          item.owner,
        ]
          .join(" ")
          .toLowerCase();

        return (
          matchesRegion &&
          matchesSeverity &&
          matchesStatus &&
          matchesCategory &&
          searchableText.includes(query)
        );
      })
      .sort((a, b) => {
        let comparison = 0;

        if (sortKey === "severity") {
          comparison = severityOrder[a.severity] - severityOrder[b.severity];
        } else if (sortKey === "ageDays") {
          comparison = a.ageDays - b.ageDays;
        } else {
          comparison = String(a[sortKey]).localeCompare(String(b[sortKey]));
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [records, search, region, severity, status, category, sortKey, sortDirection]);

  const metrics = useMemo(() => {
    const openRecords = globalRecords.filter((item) => item.status === "Open");
    const criticalRecords = globalRecords.filter(
      (item) =>
        item.severity === "Critical" && item.status !== "Resolved",
    );
    const unassignedRecords = globalRecords.filter(
      (item) => item.owner === "Unassigned" && item.status !== "Resolved",
    );
    const resolvedRecords = globalRecords.filter(
      (item) => item.status === "Resolved",
    );

    const resolvedAverage =
      resolvedRecords.length > 0
        ? resolvedRecords.reduce((sum, item) => sum + item.ageDays, 0) /
          resolvedRecords.length
        : 0;

    return {
      open: openRecords.length,
      critical: criticalRecords.length,
      unassigned: unassignedRecords.length,
      averageResolution: resolvedAverage * 24,
    };
  }, [globalRecords]);

  const severityData = useMemo(
    () =>
      (["Critical", "High", "Medium", "Low"] as ExceptionSeverity[]).map(
        (level) => ({
          name: level,
          value: globalRecords.filter(
            (item) => item.severity === level && item.status !== "Resolved",
          ).length,
          color: severityColors[level],
        }),
      ),
    [globalRecords],
  );

  const categoryData = useMemo(
    () =>
      ["Demand", "Inventory", "Supplier", "Logistics", "Production"].map(
        (name) => ({
          category: name,
          count: globalRecords.filter(
            (item) => item.category === name && item.status !== "Resolved",
          ).length,
        }),
      ),
    [globalRecords],
  );

  const resetFilters = () => {
  setSearch("");
  setTimePeriod("Last 30 days");
  setRegion("All Regions");
  setSeverity("All Severities");
  setSourceModule("All Modules");
  setStatus("All Statuses");
  setCategory("All Categories");
};

  const openDetails = (item: SupplyChainException) => {
    setSelectedException(item);
    setOwnerDraft(item.owner === "Unassigned" ? "" : item.owner);
    setStatusDraft(item.status);
    setResolutionNote("");
    setFeedback("");
  };

  const saveChanges = () => {
    if (!selectedException) return;

    if (statusDraft === "Resolved" && !resolutionNote.trim()) {
      setFeedback("Add a resolution note before marking this exception resolved.");
      return;
    }

    const updated = {
      ...selectedException,
      owner: ownerDraft.trim() || "Unassigned",
      status: statusDraft,
      description:
        statusDraft === "Resolved" && resolutionNote.trim()
          ? `${selectedException.description} Resolution: ${resolutionNote.trim()}`
          : selectedException.description,
    };

    setRecords((previous) =>
      previous.map((item) =>
        item.id === selectedException.id ? updated : item,
      ),
    );
    setSelectedException(updated);
    setFeedback("Changes saved successfully.");
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection(key === "severity" || key === "ageDays" ? "asc" : "asc");
    }
  };

  const selectClass =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500";

  const thClass =
    "whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground";

  const tdClass = "px-3 py-3 text-sm text-foreground";

  return (
      <main className="mx-auto max-w-[1540px] space-y-6 px-4 pb-10 pt-7 sm:px-6 lg:px-8">
          {/*<div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
  <span>Workspace</span>
  <ArrowRight className="size-3" />
  <span className="text-foreground">Exception Center</span>
</div>*/}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-[25px] font-semibold leading-tight sm:text-[27px]">
            Exception Center
          </h1>
              <p className="mt-2 max-w-[680px] text-sm text-muted-foreground">
                Identify, prioritize, and resolve supply chain disruptions.
              </p>
            </div>
          </div>
        </div>

       
<Button
  variant="outline"
  size="sm"
  onClick={() => window.print()}
>
  Export report
</Button>

          </div>
          
<section
  aria-label="Global exception filters"
  className="flex flex-wrap items-center gap-2.5 border-y border-border py-3"
>
  <span className="flex items-center gap-2 pr-1 text-xs font-medium text-muted-foreground">
    <SlidersHorizontal className="size-3.5" />
    Filters
  </span>

  
              
              
<Select value={timePeriod} onValueChange={setTimePeriod}>
  <SelectTrigger
    aria-label="Time period"
    className="h-8 w-full text-xs sm:w-[160px]"
  >
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Last 30 days">Last 30 days</SelectItem>
    <SelectItem value="Last 90 days">Last 90 days</SelectItem>
    <SelectItem value="Last 12 months">Last 12 months</SelectItem>
  </SelectContent>
</Select>

  
<Select value={region} onValueChange={setRegion}>
  <SelectTrigger
    aria-label="Exception region"
    className="h-8 w-full text-xs sm:w-[160px]"
  >
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {exceptionRegions.map((item) => (
      <SelectItem key={item} value={item}>
        {item}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

              
<Select value={severity} onValueChange={setSeverity}>
  <SelectTrigger
    aria-label="Severity"
    className="h-8 w-full text-xs sm:w-[160px]"
  >
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {exceptionSeverities.map((item) => (
      <SelectItem key={item} value={item}>
        {item}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


              <Select value={sourceModule} onValueChange={setSourceModule}>
  <SelectTrigger
    aria-label="Source module"
    className="h-8 w-full text-xs sm:w-[180px]"
  >
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="All Modules">All Modules</SelectItem>
    {[...new Set(records.map((item) => item.sourceModule))].map((item) => (
      <SelectItem key={item} value={item}>
        {item}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
              

  <button
    type="button"
    onClick={resetFilters}
    className="h-8 rounded-md px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
  >
    Reset filters
  </button>

  <span className="ml-auto text-xs text-muted-foreground">
    Illustrative exception data
  </span>
</section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Open Exceptions"
          value={formatNumber(metrics.open)}
          subtitle="Awaiting action"
          icon={<AlertTriangle size={19} />}
          iconClass="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
        />
        <MetricCard
          title="Critical Exceptions"
          value={formatNumber(metrics.critical)}
          subtitle="Unresolved critical issues"
          icon={<ShieldAlert size={19} />}
          iconClass="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
          accent="text-red-600 dark:text-red-400"
        />
        <MetricCard
          title="Unassigned Exceptions"
          value={formatNumber(metrics.unassigned)}
          subtitle="Require an owner"
          icon={<UserRoundPlus size={19} />}
          iconClass="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        />
        <MetricCard
          title="Avg. Resolution Time"
          value={metrics.averageResolution > 0 ? formatHours(metrics.averageResolution) : "—"}
          subtitle="Based on resolved sample records"
          icon={<Clock3 size={19} />}
          iconClass="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-foreground">Active Exceptions by Severity</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Unresolved exceptions by priority level
            </p>
          </div>
          <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2">
            <div className="h-56 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={85}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {severityData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {severityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-foreground">Active Exceptions by Category</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Where unresolved issues are concentrated
            </p>
          </div>
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" name="Active exceptions" fill="#2563eb" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4 sm:p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-foreground">Exception Register</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Review ownership, prioritize work, and investigate individual exceptions.
              </p>
            </div>
            <span className="mt-2 text-sm text-muted-foreground sm:mt-0">
                          {filteredRecords.length} of {globalRecords.length} exceptions
                      </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="relative sm:col-span-2 xl:col-span-1">
              <Search
    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
    size={16}
  />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search exceptions..."
                aria-label="Search exceptions"
                className={`${selectClass} h-8 pl-9 text-xs`}
              />
            </div>
          
            
<Select value={status} onValueChange={setStatus}>
  <SelectTrigger
    aria-label="Filter by status"
    className="h-8 w-full text-xs"
  >
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {exceptionStatuses.map((item) => (
      <SelectItem key={item} value={item}>
        {item}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

            
<Select value={category} onValueChange={setCategory}>
  <SelectTrigger
    aria-label="Filter by category"
    className="h-8 w-full text-xs"
  >
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {exceptionCategories.map((item) => (
      <SelectItem key={item} value={item}>
        {item}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] border-collapse">
            <thead className="bg-muted/50">
              <tr>
                <SortableHeader label="Exception" sortKey="title" onSort={toggleSort} className={thClass} />
                <SortableHeader label="Category" sortKey="category" onSort={toggleSort} className={thClass} />
                <SortableHeader label="Severity" sortKey="severity" onSort={toggleSort} className={thClass} />
                <SortableHeader label="Status" sortKey="status" onSort={toggleSort} className={thClass} />
                <SortableHeader label="Region" sortKey="region" onSort={toggleSort} className={thClass} />
                <SortableHeader label="Owner" sortKey="owner" onSort={toggleSort} className={thClass} />
                <SortableHeader label="Age" sortKey="ageDays" onSort={toggleSort} className={thClass} />
                <th className={thClass}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecords.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-muted/30">
                  <td className={`${tdClass} max-w-[300px]`}>
                    <button
                      type="button"
                      onClick={() => openDetails(item)}
                      className="text-left font-medium text-foreground hover:text-blue-600"
                    >
                      {item.title}
                    </button>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.id} · {item.affectedEntity}
                    </p>
                  </td>
                  <td className={tdClass}>{item.category}</td>
                  <td className={tdClass}>
                    <StatusPill
                      label={item.severity}
                      color={severityColors[item.severity]}
                    />
                  </td>
                  <td className={tdClass}>
                    <StatusPill
                      label={item.status}
                      color={statusColors[item.status]}
                    />
                  </td>
                  <td className={tdClass}>{item.region}</td>
                  <td className={tdClass}>
                    {item.owner === "Unassigned" ? (
                      <span className="text-amber-700 dark:text-amber-400">Unassigned</span>
                    ) : item.owner}
                  </td>
                  <td className={`${tdClass} tabular-nums`}>{item.ageDays}d</td>
                  <td className={tdClass}>
                    <button
                      type="button"
                      onClick={() => openDetails(item)}
                      className="whitespace-nowrap rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={22} className="text-muted-foreground" />
                      <p className="font-medium text-foreground">No exceptions found</p>
                      <p className="text-sm text-muted-foreground">
                        Try changing your search or filters.
                      </p>
                      <button type="button" onClick={resetFilters} className="mt-1 text-sm font-medium text-blue-600 hover:underline">
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
          </section>
          <p className="mt-5 text-[11px] text-muted-foreground">
        Illustrative data · Not connected to operational systems
      </p>

      {selectedException && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedException(null);
        }}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="exception-drawer-title"
            className="flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-border bg-background shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-border p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {selectedException.id} · {selectedException.affectedEntity}
                </p>
                <h2 id="exception-drawer-title" className="mt-2 text-xl font-semibold text-foreground">
                  {selectedException.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedException.sourceModule}
                </p>
              </div>
              <button type="button" aria-label="Close investigation panel" onClick={() => setSelectedException(null)} className="rounded-md p-2 hover:bg-muted">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-6 p-5">
              <div className="flex flex-wrap gap-2">
                <StatusPill label={selectedException.severity} color={severityColors[selectedException.severity]} />
                <StatusPill label={selectedException.status} color={statusColors[selectedException.status]} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">Issue description</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {selectedException.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Category" value={selectedException.category} />
                <DetailField label="Region" value={selectedException.region} />
                <DetailField label="Affected entity" value={selectedException.affectedEntity} />
                <DetailField label="Age" value={`${selectedException.ageDays} days`} />
                <DetailField label="Detected on" value={selectedException.detectedDate} />
                <DetailField label="Source module" value={selectedException.sourceModule} />
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                  Recommended action
                </h3>
                <p className="mt-2 text-sm leading-6 text-blue-800 dark:text-blue-300">
                  {selectedException.recommendedAction}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Manage exception</h3>
                <div>
                  <label htmlFor="exception-owner" className="mb-1.5 block text-sm font-medium text-foreground">
                    Assign owner
                  </label>
                  <select id="exception-owner" value={ownerDraft} onChange={(event) => setOwnerDraft(event.target.value)} className={selectClass}>
                    <option value="">Unassigned</option>
                    <option value="Priya Sharma">Priya Sharma</option>
                    <option value="Rahul Mehta">Rahul Mehta</option>
                    <option value="Daniel Wilson">Daniel Wilson</option>
                    <option value="Arun Kumar">Arun Kumar</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="exception-status" className="mb-1.5 block text-sm font-medium text-foreground">
                    Update status
                  </label>
                  <select id="exception-status" value={statusDraft} onChange={(event) => setStatusDraft(event.target.value as ExceptionStatus)} className={selectClass}>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                {statusDraft === "Resolved" && (
                  <div>
                    <label htmlFor="resolution-note" className="mb-1.5 block text-sm font-medium text-foreground">
                      Resolution note <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="resolution-note"
                      value={resolutionNote}
                      onChange={(event) => setResolutionNote(event.target.value)}
                      placeholder="Describe the resolution..."
                      rows={3}
                      className={selectClass}
                    />
                  </div>
                )}

                {feedback && (
                  <p role="status" className={`text-sm ${feedback.startsWith("Changes") ? "text-emerald-600" : "text-red-600"}`}>
                    {feedback}
                  </p>
                )}

                <button type="button" onClick={saveChanges} className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  Save changes
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`mt-2 text-2xl font-semibold tracking-tight ${accent ?? "text-foreground"}`}>
            {value}
          </p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>
          {icon}
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        color,
        backgroundColor: `${color}14`,
        border: `1px solid ${color}35`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function SortableHeader({
  label,
  sortKey,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  onSort: (key: SortKey) => void;
  className: string;
}) {
  return (
    <th className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1.5 hover:text-foreground"
      >
        {label}
        <span aria-hidden="true" className="text-muted-foreground">↕</span>
      </button>
    </th>
  );
}
