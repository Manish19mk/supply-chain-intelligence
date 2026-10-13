
import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileBarChart,
  FileText,
  Play,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
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

type ReportStatus = "Ready" | "Scheduled" | "Generating" | "Failed";

type Report = {
  id: string;
  name: string;
  category: string;
  format: "CSV" | "PDF" | "XLSX";
  owner: string;
  lastGenerated: string;
  status: ReportStatus;
  frequency: string;
  description: string;
};

const initialReports: Report[] = [
  {
    id: "RPT-001",
    name: "Inventory Health Report",
    category: "Inventory",
    format: "CSV",
    owner: "Morgan Carter",
    lastGenerated: "Oct 12, 2026",
    status: "Ready",
    frequency: "Daily",
    description: "Inventory levels, stock coverage, and replenishment risks.",
  },
  {
    id: "RPT-002",
    name: "Supplier Performance Summary",
    category: "Procurement",
    format: "PDF",
    owner: "Alex Morgan",
    lastGenerated: "Oct 11, 2026",
    status: "Ready",
    frequency: "Weekly",
    description: "Supplier reliability, lead times, and quality performance.",
  },
  {
    id: "RPT-003",
    name: "Weekly Logistics Report",
    category: "Logistics",
    format: "CSV",
    owner: "Jordan Lee",
    lastGenerated: "Oct 10, 2026",
    status: "Scheduled",
    frequency: "Weekly",
    description: "Transportation costs, delivery performance, and shipment delays.",
  },
  {
    id: "RPT-004",
    name: "Demand Forecast Variance",
    category: "Demand Planning",
    format: "XLSX",
    owner: "Taylor Smith",
    lastGenerated: "Oct 12, 2026",
    status: "Ready",
    frequency: "Daily",
    description: "Actual demand versus forecast and significant demand variances.",
  },
  {
    id: "RPT-005",
    name: "Supply Chain Exceptions",
    category: "Exceptions",
    format: "PDF",
    owner: "Morgan Carter",
    lastGenerated: "Oct 12, 2026",
    status: "Generating",
    frequency: "On demand",
    description: "Open exceptions, severity distribution, and resolution progress.",
  },
  {
    id: "RPT-006",
    name: "Network Performance Summary",
    category: "Operations",
    format: "CSV",
    owner: "Alex Morgan",
    lastGenerated: "Oct 09, 2026",
    status: "Failed",
    frequency: "Monthly",
    description: "A consolidated view of supply chain network performance.",
  },
  {
    id: "RPT-007",
    name: "Freight Cost Analysis",
    category: "Logistics",
    format: "CSV",
    owner: "Jordan Lee",
    lastGenerated: "Oct 08, 2026",
    status: "Ready",
    frequency: "Monthly",
    description: "Freight expenditure and transportation cost trends.",
  },
  {
    id: "RPT-008",
    name: "Replenishment Planning",
    category: "Inventory",
    format: "XLSX",
    owner: "Taylor Smith",
    lastGenerated: "Oct 07, 2026",
    status: "Scheduled",
    frequency: "Weekly",
    description: "Replenishment recommendations and inventory requirements.",
  },
];

const categories = [
  "All Categories",
  "Inventory",
  "Procurement",
  "Logistics",
  "Demand Planning",
  "Exceptions",
  "Operations",
];

const statuses = [
  "All Statuses",
  "Ready",
  "Scheduled",
  "Generating",
  "Failed",
];

type SortKey = "name" | "category" | "lastGenerated" | "owner" | "status";

const csvEscape = (value: string) =>
  `"${value.replace(/"/g, '""')}"`;

function downloadCsv(reports: Report[]) {
  const headers = [
    "Report ID",
    "Report Name",
    "Category",
    "Format",
    "Owner",
    "Last Generated",
    "Status",
    "Frequency",
  ];

  const rows = reports.map((report) => [
    report.id,
    report.name,
    report.category,
    report.format,
    report.owner,
    report.lastGenerated,
    report.status,
    report.frequency,
  ]);

  const csv = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "supply-chain-reports.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function ReportsDashboard() {
  const [reports, setReports] = useState(initialReports);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Statuses");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [notice, setNotice] = useState("");

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reports
      .filter((report) => {
        const matchesQuery =
          !normalizedQuery ||
          `${report.id} ${report.name} ${report.category} ${report.owner} ${report.format}`
            .toLowerCase()
            .includes(normalizedQuery);

        const matchesCategory =
          category === "All Categories" || report.category === category;

        const matchesStatus =
          status === "All Statuses" || report.status === status;

        return matchesQuery && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        const comparison = String(a[sortKey]).localeCompare(String(b[sortKey]));
        return comparison * (sortAsc ? 1 : -1);
      });
  }, [reports, query, category, status, sortKey, sortAsc]);

  const scheduledCount = filteredReports.filter(
  (report) => report.status === "Scheduled",
).length;

const generatedCount = filteredReports.filter(
  (report) => report.status === "Ready",
).length;

const pendingCount = filteredReports.filter(
  (report) =>
    report.status === "Generating" || report.status === "Failed",
).length;

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((current) => !current);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function resetFilters() {
    setQuery("");
    setCategory("All Categories");
    setStatus("All Statuses");
    setSortKey("name");
    setSortAsc(true);
  }

  function generateReport(reportId: string) {
    setReports((current) =>
      current.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: "Ready",
              lastGenerated: "Oct 12, 2026",
            }
          : report,
      ),
    );
    setSelectedReport(null);
    setNotice("Report generated successfully in the prototype.");
  }

  function scheduleReport(reportId: string) {
    setReports((current) =>
      current.map((report) =>
        report.id === reportId
          ? { ...report, status: "Scheduled" }
          : report,
      ),
    );
    setSelectedReport(null);
    setNotice("Report scheduled in the prototype.");
  }

  function openReport(report: Report) {
    setSelectedReport(report);
    setNotice("");
  }

  const hasFilters =
    query !== "" ||
    category !== "All Categories" ||
    status !== "All Statuses";

  return (
    <main className="mx-auto max-w-[1540px] space-y-6 px-4 pb-10 pt-7 sm:px-6 lg:px-8">
      {/*<div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span>Insights</span>
        <ArrowRight className="size-3" />
        <span className="text-foreground">Reports</span>
      </div>*/}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-semibold leading-tight sm:text-[27px]">
            Reports
          </h1>
          <p className="mt-2 max-w-[780px] text-sm leading-5 text-muted-foreground">
            Access, generate, and manage supply chain reports across your
            operations.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => downloadCsv(filteredReports)}
          disabled={filteredReports.length === 0}
        >
          <ArrowDownToLine className="mr-2 size-4" />
          Export CSV
        </Button>
      </div> 

      <section
        aria-label="Report filters"
        className="flex flex-wrap items-center gap-2.5 border-y border-border py-3"
      >
        <span className="flex items-center gap-2 pr-1 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </span>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger aria-label="Filter by category" className="h-8 w-full text-xs sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger aria-label="Filter by status" className="h-8 w-full text-xs sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={resetFilters}
          >
            <X className="mr-1 size-3" />
            Reset filters
          </Button>
        )}

        <span className="ml-auto text-xs text-muted-foreground">
          Illustrative report data
        </span>
          </section>
          
          <section
        aria-label="Report summary"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          label="Total Reports"
          value={String(filteredReports.length)}
          note="Available in the report library"
          icon={<FileText className="size-4" />}
        />
        <KpiCard
          label="Scheduled"
          value={String(scheduledCount)}
          note="Configured for recurring runs"
          icon={<CalendarClock className="size-4" />}
        />
        <KpiCard
          label="Generated"
          value={String(generatedCount)}
          note="Reports currently ready"
          icon={<CheckCircle2 className="size-4" />}
        />
        <KpiCard
          label="Pending"
          value={String(pendingCount)}
          note="Generating or requiring attention"
          icon={<Clock3 className="size-4" />}
        />
      </section>

      {notice && (
        <div
          role="status"
          className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm"
        >
          {notice}
        </div>
      )}

      <section className="overflow-hidden rounded-md border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">Report Library</h2>
              <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-[11px]">
                {filteredReports.length}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Find reports, review their status, or open report actions.
            </p>
          </div>

          <div className="relative w-full sm:max-w-[340px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search reports"
              placeholder="Search reports, categories, or owners"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        {filteredReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-xs">
              <thead>
                <tr className="h-10 border-b border-border bg-muted/35 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {(
                    [
                      ["name", "Report"],
                      ["category", "Category"],
                      ["lastGenerated", "Last Generated"],
                      ["owner", "Owner"],
                      ["status", "Status"],
                    ] as [SortKey, string][]
                  ).map(([key, label]) => (
                    <th key={key} className="px-3 first:pl-4">
                      <button
                        type="button"
                        onClick={() => toggleSort(key)}
                        className="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        {label}
                        {sortKey === key ? (sortAsc ? "↑" : "↓") : "↕"}
                      </button>
                    </th>
                  ))}
                  <th className="px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="h-[66px] hover:bg-muted/30">
                    <td className="px-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-info-subtle text-info">
                          <FileBarChart className="size-4" />
                        </span>
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {report.id} · {report.format}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3">{report.category}</td>
                    <td className="px-3 tabular-nums">{report.lastGenerated}</td>
                    <td className="px-3">{report.owner}</td>
                    <td className="px-3">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px]"
                        onClick={() => openReport(report)}
                      >
                        View details
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
            <p className="mt-3 text-sm font-medium">No reports found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try another search or change your filters.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={resetFilters}
            >
              Clear filters
            </Button>
          </div>
        )}

        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-5">
          Showing {filteredReports.length} of {reports.length} reports
        </div>
      </section>

      <p className="text-[11px] text-muted-foreground">
        Illustrative data · Not connected to operational reporting systems
      </p>

      <Sheet
        open={selectedReport !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedReport(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-[440px]">
          {selectedReport && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedReport.name}</SheetTitle>
                <SheetDescription>
                  {selectedReport.id} · {selectedReport.category} report
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 py-5">
                <Detail label="Report ID" value={selectedReport.id} />
                <Detail label="Category" value={selectedReport.category} />
                <Detail label="Format" value={selectedReport.format} />
                <Detail label="Owner" value={selectedReport.owner} />
                <Detail
                  label="Last generated"
                  value={selectedReport.lastGenerated}
                />
                <Detail label="Status" value={selectedReport.status} />
                <Detail label="Frequency" value={selectedReport.frequency} />
                <div>
                  <p className="text-[11px] text-muted-foreground">Description</p>
                  <p className="mt-1 text-sm leading-5">
                    {selectedReport.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  <Button
                    onClick={() => generateReport(selectedReport.id)}
                    className="w-full"
                  >
                    <Play className="mr-2 size-4" />
                    Generate report
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => scheduleReport(selectedReport.id)}
                    className="w-full"
                  >
                    <CalendarClock className="mr-2 size-4" />
                    Schedule report
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadCsv([selectedReport])}
                    className="w-full"
                  >
                    <ArrowDownToLine className="mr-2 size-4" />
                    Export report as CSV
                  </Button>
                </div>
              </div>
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

function StatusBadge({ status }: { status: ReportStatus }) {
  const className =
    status === "Ready"
      ? "bg-positive/10 text-positive"
      : status === "Scheduled"
        ? "bg-info-subtle text-info"
        : status === "Generating"
          ? "bg-warning/10 text-warning"
          : "bg-critical/10 text-critical";

  return (
    <span
      className={`inline-flex rounded-sm px-2 py-1 text-[10px] font-medium ${className}`}
    >
      {status}
    </span>
  );
}
