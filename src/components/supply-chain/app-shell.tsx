import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Boxes,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  ClipboardList,
  Command,
  FileBarChart,
  LayoutDashboard,
  Menu,
  PackageSearch,
  Search,
  Settings,
  Ship,
  Truck,
  UserRound,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export const navigationItems = [
  { label: "Overview", to: "/", icon: LayoutDashboard },
  { label: "Demand & Forecast", to: "/demand-forecast", icon: Activity },
  { label: "Inventory Intelligence", to: "/inventory-intelligence", icon: PackageSearch },
  { label: "Supplier Performance", to: "/supplier-performance", icon: Users },
  { label: "Logistics Performance", to: "/logistics-performance", icon: Truck },
  { label: "Exception Center", to: "/exception-center", icon: ClipboardList },
  { label: "Reports", to: "/reports", icon: FileBarChart },
];
const reportsNavigationItem = { label: "Reports", to: "/reports", icon: FileBarChart };

type AppShellProps = {
  children: React.ReactNode;
  onGlobalSearch?: (value: string) => void;
};

export function AppShell({ children, onGlobalSearch }: AppShellProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPage = navigationItems.find((item) => item.to === pathname)?.label ??
    (pathname === "/settings" ? "Settings" : pathname === "/help" ? "Help & Support" : "Workspace");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-foreground/30 md:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-sidebar transition-[width,transform] duration-200 ${collapsed ? "w-[72px]" : "w-[248px]"} ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className={`flex h-16 shrink-0 items-center border-b border-sidebar-border ${collapsed ? "justify-center px-3" : "gap-3 px-5"}`}>
          <div className="grid size-9 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"><Command className="size-[18px]" /></div>
          {!collapsed && <div className="min-w-0"><p className="truncate text-[13px] font-semibold leading-4">Supply Chain</p><p className="text-[11px] leading-4 text-muted-foreground">Intelligence</p></div>}
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground ${collapsed ? "sr-only" : ""}`}>Workspace</p>
          <nav aria-label="Workspace navigation" className="space-y-1">
            {navigationItems.slice(0, 6).map((item) => <NavigationItem key={item.to} {...item} collapsed={collapsed} onClick={() => setMobileOpen(false)} />)}
          </nav>
          <p className={`mb-2 mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground ${collapsed ? "sr-only" : ""}`}>Insights</p>
          <nav aria-label="Insights navigation"><NavigationItem {...reportsNavigationItem} collapsed={collapsed} onClick={() => setMobileOpen(false)} /></nav>
        </div>
        <div className="border-t border-sidebar-border px-3 py-3">
          <NavigationItem label="Settings" to="/settings" icon={Settings} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
          <NavigationItem label="Help & Support" to="/help" icon={CircleHelp} collapsed={collapsed} onClick={() => setMobileOpen(false)} />
          <div className={`mt-3 flex items-center border-t border-sidebar-border pt-3 ${collapsed ? "justify-center" : "gap-3 px-2"}`}>
            <Avatar className="size-8 shrink-0"><AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">MC</AvatarFallback></Avatar>
            {!collapsed && <div className="min-w-0"><p className="truncate text-xs font-medium">Morgan Carter</p><p className="truncate text-[11px] text-muted-foreground">Supply Chain Manager</p></div>}
          </div>
        </div>
        <Button variant="ghost" size="icon" title={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-[68px] hidden size-6 rounded-full border border-border bg-background shadow-sm md:grid"><ChevronLeft className={`size-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} /></Button>
      </aside>

      <div className={`min-h-screen transition-[margin] duration-200 ${collapsed ? "md:ml-[72px]" : "md:ml-[248px]"}`}>
        <header className="sticky top-0 z-20 grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu /></Button>
            <div className="hidden min-w-0 items-center gap-2 text-sm sm:flex"><span className="text-muted-foreground">Workspace</span><span className="text-border">/</span><span className="truncate font-medium">{currentPage}</span></div>
          </div>
          <div className="mx-auto hidden w-full max-w-[480px] items-center sm:flex">
            <div className="relative w-full"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search exceptions" placeholder="Search exceptions..." onChange={(event) => onGlobalSearch?.(event.target.value)} className="h-9 border-border bg-muted/50 pl-9 pr-14 text-sm" /><kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘ K</kbd></div>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <div className="sm:hidden"><Button variant="ghost" size="icon" aria-label="Search exceptions" onClick={() => document.getElementById("mobile-search")?.focus()}><Search /></Button></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Notifications" className="relative"><Bell /><span className="absolute right-2 top-2 size-2 rounded-full border-2 border-background bg-destructive" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between"><span>Notifications</span><span className="rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">3 new</span></DropdownMenuLabel><DropdownMenuSeparator />
                <DropdownMenuItem className="h-auto items-start gap-3 py-3"><span className="mt-1 size-2 shrink-0 rounded-full bg-destructive" /><span><strong className="block text-xs">Critical stockout risk</strong><span className="text-xs text-muted-foreground">Chicago DC · 18 min ago</span></span></DropdownMenuItem>
                <DropdownMenuItem className="h-auto items-start gap-3 py-3"><span className="mt-1 size-2 shrink-0 rounded-full bg-chart-series-3" /><span><strong className="block text-xs">Supplier shipment delayed</strong><span className="text-xs text-muted-foreground">Rotterdam Port · 46 min ago</span></span></DropdownMenuItem>
                <DropdownMenuItem className="h-auto items-start gap-3 py-3"><span className="mt-1 size-2 shrink-0 rounded-full bg-primary" /><span><strong className="block text-xs">Weekly network report is ready</strong><span className="text-xs text-muted-foreground">Reports · 2 hours ago</span></span></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" className="h-9 gap-2 px-2"><Avatar className="size-7"><AvatarFallback className="bg-secondary text-[10px] font-semibold text-secondary-foreground">MC</AvatarFallback></Avatar><span className="hidden text-xs font-medium lg:inline">Morgan</span><ChevronDown className="hidden size-3.5 text-muted-foreground lg:inline" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52"><DropdownMenuLabel><span className="block">Morgan Carter</span><span className="text-xs font-normal text-muted-foreground">Supply Chain Manager</span></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem><UserRound />My profile</DropdownMenuItem><DropdownMenuItem asChild><Link to="/settings"><Settings />Settings</Link></DropdownMenuItem></DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Input id="mobile-search" aria-label="Search exceptions" placeholder="Search exceptions..." onChange={(event) => onGlobalSearch?.(event.target.value)} className="col-span-3 h-9 sm:hidden" />
        </header>
        {children}
      </div>
    </div>
  );
}

type NavigationItemProps = {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  collapsed: boolean;
  onClick?: () => void;
};

function NavigationItem({ label, to, icon: Icon, collapsed, onClick }: NavigationItemProps) {
  return <Link to={to} onClick={onClick} activeOptions={{ exact: to === "/" }} activeProps={{ className: "bg-sidebar-accent text-sidebar-primary font-medium" }} inactiveProps={{ className: "text-sidebar-foreground/75 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground" }} className={`group flex h-9 items-center gap-3 rounded-md px-3 text-[13px] transition-colors ${collapsed ? "justify-center px-0" : ""}`} title={collapsed ? label : undefined}>
    <Icon className="size-[17px] shrink-0" /><span className={collapsed ? "sr-only" : "truncate"}>{label}</span>
  </Link>;
}