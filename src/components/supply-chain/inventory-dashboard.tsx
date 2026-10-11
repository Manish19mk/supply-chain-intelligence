
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Package,
  PackageSearch,
  RotateCcw,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Warehouse,
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
  getDaysOfSupply,
  getInventoryValue,
  inventoryHealthData,
  inventoryItems,
  inventoryRegions,
  inventoryStatuses,
  inventoryTrendData,
  type InventoryItem,
  type InventoryStatus,
} from "@/data/inventory";

const statusStyles: Record<InventoryStatus, string> = {
  Healthy: "bg-positive-subtle text-positive",
  "At Risk": "bg-warning-subtle text-warning",
  Overstocked: "bg-muted text-muted-foreground",
  Stockout: "bg-critical-subtle text-critical",
};

const statusOrder: Record<InventoryStatus, number> = {
  Stockout: 0,
  "At Risk": 1,
  Overstocked: 2,
  Healthy: 3,
};

type SortKey =
  | "sku"
  | "product"
  | "location"
  | "onHand"
  | "days"
  | "value"
  | "status";

export function InventoryDashboard() {
  const [region, setRegion] = useState("All Regions");
  const [status, setStatus] = useState("All Statuses");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const records = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return inventoryItems
      .filter(
        (item) =>
          region === "All Regions" || item.region === region,
      )
      .filter(
        (item) => status === "All Statuses" || item.status === status,
      )
      .filter(
        (item) =>
          !normalizedQuery ||
          `${item.sku} ${item.product} ${item.location} ${item.category}`
            .toLowerCase()
            .includes(normalizedQuery),
      )
      .sort((a, b) => {
        const getValue = (item: InventoryItem) => {
          switch (sortKey) {
            case "days":
              return getDaysOfSupply(item);
            case "value":
              return item.onHand * item.unitCost;
            case "status":
              return statusOrder[item.status];
            default:
              return item[sortKey];
          }
        };

        const aValue = getValue(a);
        const bValue = getValue(b);
        const comparison =
          typeof aValue === "number" && typeof bValue === "number"
            ? aValue - bValue
            : String(aValue).localeCompare(String(bValue));

        return comparison * (sortAsc ? 1 : -1);
      });
  }, [region, status, query, sortKey, sortAsc]);

  const totalUnits = records.reduce((sum, item) => sum + item.onHand, 0);
  const totalValue = getInventoryValue(records);
  const stockoutCount = records.filter(
    (item) => item.status === "Stockout",
  ).length;
  const atRiskCount = records.filter(
    (item) => item.status === "At Risk",
  ).length;
  const averageDays =
    records.length > 0
      ? Math.round(
          records.reduce((sum, item) => sum + getDaysOfSupply(item), 0) /
            records.length,
        )
      : 0;

  const hasFilters =
    region !== "All Regions" ||
    status !== "All Statuses" ||
    query.length > 0;

  function resetFilters() {
    setRegion("All Regions");
    setStatus("All Statuses");
    setQuery("");
  }

  function sortBy(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((current) => !current);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <main className="mx-auto max-w-[1540px] px-4 pb-10 pt-7 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span>Workspace</span>
            <ArrowRight className="size-3" />
            <span className="text-foreground">Inventory Intelligence</span>
          </div>
          <h1 className="text-[25px] font-semibold leading-tight sm:text-[27px]">
            Inventory Intelligence
          </h1>
          <p className="mt-2 max-w-[660px] text-sm leading-5 text-muted-foreground">
            Understand inventory health, identify stock risks, and prioritize
            replenishment across your network.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => window.print()}
        >
          <Package className="size-3.5" />
          Export inventory
        </Button>
      </div>

      <section
        aria-label="Inventory filters"
        className="mt-6 flex flex-wrap items-center gap-2.5 border-y border-border py-3"
      >
        <div className="flex items-center gap-2 pr-1 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </div>

        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger aria-label="Region" className="h-8 w-full sm:w-auto sm:min-w-[155px] text-xs">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            {inventoryRegions.map((option) => (
              <SelectItem key={option} value={option} className="text-xs">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger aria-label="Inventory status" className="h-8 w-full sm:w-auto sm:min-w-[155px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {inventoryStatuses.map((option) => (
              <SelectItem key={option} value={option} className="text-xs">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2 text-xs"
            onClick={resetFilters}
          >
            <RotateCcw className="size-3.5" />
            Reset filters
          </Button>
        )}

        <span className="ml-auto text-xs text-muted-foreground">
          Illustrative inventory data
        </span>
      </section>

      <section
        aria-label="Inventory key performance indicators"
        className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          label="Inventory Value"
          value={formatCurrency(totalValue)}
          note="Current filtered stock"
          icon={<Boxes className="size-4" />}
          tone="info"
        />
        <KpiCard
          label="Units on Hand"
          value={totalUnits.toLocaleString("en-US")}
          note="Across visible SKUs"
          icon={<Warehouse className="size-4" />}
          tone="positive"
        />
        <KpiCard
          label="Average Days of Supply"
          value={`${averageDays} days`}
          note="Based on sample daily demand"
          icon={<TrendingUp className="size-4" />}
          tone="info"
        />
        <KpiCard
          label="SKUs Requiring Attention"
          value={String(stockoutCount + atRiskCount)}
          note={`${stockoutCount} stockout · ${atRiskCount} at risk`}
          icon={<AlertTriangle className="size-4" />}
          tone={stockoutCount + atRiskCount > 0 ? "warning" : "positive"}
        />
      </section>

      <section
        aria-label="Inventory analytics"
        className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]"
      >
        <div className="dashboard-panel min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Inventory Health</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Full-network distribution · Independent of table filters
              </p>
            </div>
            <span className="rounded-sm bg-secondary px-2 py-1 text-[10px] font-medium text-secondary-foreground">
              4 categories
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-lg font-semibold text-foreground">
              {inventoryHealthData
                .reduce((sum, item) => sum + item.units, 0)
                .toLocaleString("en-US")}
            </span>
            network-wide units
          </div>

          <div
            className="mt-1 h-[230px] min-w-0"
            role="img"
            aria-label="Donut chart showing inventory health categories"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryHealthData}
                  dataKey="units"
                  nameKey="name"
                  cx="50%"
                  cy="48%"
                  innerRadius={58}
                  outerRadius={84}
                  paddingAngle={3}
                  stroke="var(--card)"
                  strokeWidth={2}
                  isAnimationActive={false}
                >
                  {inventoryHealthData.map((item) => (
                    <Cell key={item.name} fill={item.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    Number(value).toLocaleString("en-US"),
                    "Units",
                  ]}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-3 border-t border-border pt-3">
            {inventoryHealthData.map((item) => (
              <div
                key={item.name}
                className="flex min-w-0 items-center gap-2 text-xs"
              >
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="truncate text-muted-foreground">
                  {item.name}
                </span>
                <span className="ml-auto font-medium tabular-nums">
                  {item.units.toLocaleString("en-US")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel min-w-0">
          <div>
            <h2 className="text-sm font-semibold">Inventory Status Trend</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Illustrative weekly trend · Full network
            </p>
          </div>

          <div
            className="mt-4 h-[270px] min-w-0"
            role="img"
            aria-label="Stacked bar chart of weekly inventory status"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={inventoryTrendData}
                margin={{ top: 8, right: 6, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--chart-grid)"
                  strokeDasharray="3 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "var(--chart-label)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: "var(--chart-label)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`]}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="healthy"
                  name="Healthy"
                  stackId="inventory"
                  fill="var(--inventory-healthy)"
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="risk"
                  name="At Risk"
                  stackId="inventory"
                  fill="var(--inventory-at-risk)"
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="excess"
                  name="Overstocked"
                  stackId="inventory"
                  fill="var(--inventory-overstocked)"
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="stockout"
                  name="Stockout"
                  stackId="inventory"
                  fill="var(--inventory-stockout)"
                  radius={[3, 3, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-2 border-t border-border pt-3 text-[11px] text-muted-foreground">
            Weekly distribution is illustrative and independent of the SKU table.
          </p>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-md border border-border bg-card">
        <div className="grid gap-4 border-b border-border px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_minmax(240px,360px)] lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">SKU Inventory</h2>
              <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                {records.length}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Review stock availability and prioritize replenishment.
            </p>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search SKU inventory"
              placeholder="Search SKU, product or location"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-8 pl-8 text-xs"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear inventory search"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left text-xs">
              <thead>
                <tr className="h-10 border-b border-border bg-muted/35 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  <SortableHeader label="SKU / Product" active={sortKey === "product" || sortKey === "sku"} direction={sortAsc} onClick={() => sortBy("product")} />
                  <SortableHeader label="Location" active={sortKey === "location"} direction={sortAsc} onClick={() => sortBy("location")} />
                  <SortableHeader label="On Hand" active={sortKey === "onHand"} direction={sortAsc} onClick={() => sortBy("onHand")} />
                  <SortableHeader label="Days Supply" active={sortKey === "days"} direction={sortAsc} onClick={() => sortBy("days")} />
                  <SortableHeader label="Stock Value" active={sortKey === "value"} direction={sortAsc} onClick={() => sortBy("value")} />
                  <SortableHeader label="Status" active={sortKey === "status"} direction={sortAsc} onClick={() => sortBy("status")} />
                  <th className="px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map((item) => (
                  <tr
                    key={item.id}
                    className="h-[62px] transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4">
                      <div className="font-medium text-foreground">{item.sku}</div>
                      <div className="mt-1 max-w-[230px] truncate text-[10px] text-muted-foreground">
                        {item.product}
                      </div>
                    </td>
                    <td className="px-3">
                      <div className="font-medium">{item.location}</div>
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        {item.region}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 font-medium tabular-nums">
                      {item.onHand.toLocaleString("en-US")}
                    </td>
                    <td className="whitespace-nowrap px-3 tabular-nums">
                      {getDaysOfSupply(item)} days
                    </td>
                    <td className="whitespace-nowrap px-3 tabular-nums">
                      {formatCurrency(item.onHand * item.unitCost)}
                    </td>
                    <td className="whitespace-nowrap px-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1.5 text-[11px]"
                        onClick={() => setSelectedItem(item)}
                      >
                        Investigate
                        <ArrowRight className="size-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-[210px] flex-col items-center justify-center px-6 text-center">
            <div className="grid size-10 place-items-center rounded-md bg-muted">
              <PackageSearch className="size-5 text-muted-foreground" />
            </div>
            <h3 className="mt-3 text-sm font-semibold">No inventory found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Try another search or adjust the selected filters.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 gap-1.5 text-xs"
              onClick={resetFilters}
            >
              <RotateCcw className="size-3.5" />
              Clear filters
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs text-muted-foreground">
            Showing {records.length} of {inventoryItems.length} illustrative SKUs
          </p>
          <span className="text-[10px] text-muted-foreground">
            Inventory values use sample unit costs in USD
          </span>
        </div>
      </section>

      <div className="mt-5 flex items-center justify-between gap-4 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-positive" />
          Inventory monitoring active
        </span>
        <span>Illustrative data · Not connected to operational systems</span>
      </div>

      <Sheet
        open={selectedItem !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedItem(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-[440px]">
          {selectedItem && (
            <InventoryDrawer
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
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
  tone,
}: {
  label: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  tone: "positive" | "warning" | "info";
}) {
  const toneClass = {
    positive: "bg-positive-subtle text-positive",
    warning: "bg-warning-subtle text-warning",
    info: "bg-info-subtle text-info",
  }[tone];

  return (
    <article className="dashboard-panel flex min-h-[144px] flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={`grid size-8 place-items-center rounded-sm ${toneClass}`}>
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

function StatusBadge({ status }: { status: InventoryStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[10px] font-medium ${statusStyles[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function SortableHeader({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: boolean;
  onClick: () => void;
}) {
  return (
    <th className="whitespace-nowrap px-3 first:pl-4">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 hover:text-foreground"
      >
        {label}
        <span className={active ? "text-primary" : "opacity-50"}>
          {active ? (direction ? "↑" : "↓") : "↕"}
        </span>
      </button>
    </th>
  );
}

function InventoryDrawer({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  const days = getDaysOfSupply(item);
  const stockValue = item.onHand * item.unitCost;
  const recommendedOrder = Math.max(
    0,
    item.reorderPoint * 2 - item.onHand,
  );

  return (
    <>
      <SheetHeader className="border-b border-border pb-5 pr-8 text-left">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-primary">
            {item.sku}
          </span>
          <StatusBadge status={item.status} />
        </div>
        <SheetTitle className="text-lg leading-6">{item.product}</SheetTitle>
        <SheetDescription>
          Inventory record and recommended replenishment review.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-5 py-5">
        <div className="grid grid-cols-2 gap-4">
          <DetailItem label="Location" value={item.location} />
          <DetailItem label="Region" value={item.region} />
          <DetailItem
            label="Units on hand"
            value={item.onHand.toLocaleString("en-US")}
          />
          <DetailItem label="Days of supply" value={`${days} days`} />
          <DetailItem
            label="Reorder point"
            value={`${item.reorderPoint.toLocaleString("en-US")} units`}
          />
          <DetailItem
            label="Unit cost"
            value={formatCurrency(item.unitCost)}
          />
        </div>

        <div className="border-t border-border pt-4">
          <DetailItem
            label="Current stock value"
            value={formatCurrency(stockValue)}
          />
          <p className="mt-4 text-[11px] text-muted-foreground">
            Recommended review quantity
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {recommendedOrder.toLocaleString("en-US")} units
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Illustrative quantity to reach twice the reorder-point threshold.
            Confirm demand, lead time, and purchase constraints before ordering.
          </p>
        </div>

        <div className="rounded-sm border border-border bg-muted/40 p-3">
          <div className="flex items-center gap-2 text-xs font-medium">
            <AlertTriangle className="size-3.5 text-muted-foreground" />
            Recommended next step
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {item.status === "Stockout"
              ? "Review open orders and expedite replenishment or identify a substitute."
              : item.status === "At Risk"
                ? "Validate upcoming demand and supplier lead time before the next replenishment cycle."
                : item.status === "Overstocked"
                  ? "Review excess coverage and possible redistribution to locations with demand."
                  : "Continue monitoring demand and maintain the planned replenishment policy."}
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <Button className="w-full" onClick={onClose}>
          Close investigation
        </Button>
        <p className="mt-3 text-center text-[10px] text-muted-foreground">
          Prototype only · No purchase order is created
        </p>
      </div>
    </>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium leading-5">{value}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
