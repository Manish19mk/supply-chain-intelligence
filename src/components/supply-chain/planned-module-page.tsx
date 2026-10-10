import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CircleHelp, Clock3, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/components/supply-chain/app-shell";

export function PlannedModulePage({ title, description }: { title: string; description: string }) {
  const suggestedPages = navigationItems.filter((item) => item.label !== title).slice(0, 3);
  return <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1540px] flex-col px-4 pb-10 pt-7 sm:px-6 lg:px-8">
    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground"><span>Workspace</span><ArrowRight className="size-3" /><span className="text-foreground">{title}</span></div>
    <h1 className="text-[25px] font-semibold leading-tight sm:text-[27px]">{title}</h1>
    <p className="mt-2 max-w-2xl text-sm leading-5 text-muted-foreground">{description}</p>
    <section className="mx-auto my-auto w-full max-w-[760px] py-14">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[180px_minmax(0,1fr)] md:items-start">
        <div className="grid aspect-square max-w-[160px] place-items-center rounded-md border border-border bg-card text-primary md:mx-auto"><Construction className="size-9" strokeWidth={1.5} /></div>
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-sm bg-info-subtle px-2 py-1 text-[11px] font-medium text-info"><Clock3 className="size-3" />Planned for a future phase</div>
          <h2 className="mt-4 text-xl font-semibold">{title} is on the roadmap</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">This workspace is being prepared for a later release. The current prototype focuses on network-wide performance and urgent actions in the Overview.</p>
          <Button asChild className="mt-5 gap-2"><Link to="/"><ArrowLeft className="size-4" />Return to Overview</Link></Button>
          <div className="mt-9 border-t border-border pt-5"><p className="text-xs font-semibold">Explore the current workspace</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-3">{suggestedPages.map((item) => <Link key={item.to} to={item.to} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary">{item.label}<ArrowRight className="size-3" /></Link>)}</div></div>
        </div>
      </div>
      <div className="mt-12 flex items-start gap-3 border-t border-border pt-5 text-xs leading-5 text-muted-foreground"><CircleHelp className="mt-0.5 size-4 shrink-0" /><span>Prototype workspace · No operational records are connected in this phase.</span></div>
    </section>
  </main>;
}