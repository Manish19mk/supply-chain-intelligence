
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
  FileText,
  LifeBuoy,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  Truck,
  Package,
  BarChart3,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Article = {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: typeof BookOpen;
  content: string[];
};

type SupportRequest = {
  id: string;
  subject: string;
  category: string;
  status: "Open" | "In Progress" | "Resolved";
  date: string;
  description: string;
};

const articles: Article[] = [
  {
    id: "DOC-001",
    title: "Getting Started",
    description: "Learn the workspace layout and navigate the main modules.",
    category: "Basics",
    icon: BookOpen,
    content: [
      "Use the left navigation to access Overview, Demand & Forecast, Inventory Intelligence, Supplier Performance, Logistics Performance, and Exception Center.",
      "Use the global search in the header to find information within the workspace.",
      "Select filters to narrow dashboard data, and use Reset filters to return to the default view.",
    ],
  },
  {
    id: "DOC-002",
    title: "Understanding Dashboards",
    description: "Learn how to read KPIs, charts, tables, and exceptions.",
    category: "Dashboards",
    icon: BarChart3,
    content: [
      "KPI cards summarize the most important operational metrics for the selected view.",
      "Charts help identify trends and patterns. Hover over a chart when interactive tooltips are available.",
      "Tables support searching and sorting where those controls are provided. Open a record's details to review more information.",
    ],
  },
  {
    id: "DOC-003",
    title: "Reports and Exports",
    description: "Search the report library and export report records.",
    category: "Reports",
    icon: FileText,
    content: [
      "Use the Reports page to search by report name, category, or owner.",
      "Filter the report library by category and status. The summary cards reflect the filtered results.",
      "Export CSV downloads the currently filtered report records. In this prototype, it exports report metadata rather than the underlying operational report contents.",
    ],
  },
  {
    id: "DOC-004",
    title: "Inventory and Replenishment",
    description: "Review stock health and inventory exceptions.",
    category: "Inventory",
    icon: Package,
    content: [
      "Use Inventory Intelligence to review inventory levels and identify stock risks.",
      "Apply available filters to narrow the records shown in the table.",
      "Investigate exceptions before taking action. The current workspace uses illustrative sample data.",
    ],
  },
  {
    id: "DOC-005",
    title: "Shipment and Logistics Issues",
    description: "Review delivery performance and shipment exceptions.",
    category: "Logistics",
    icon: Truck,
    content: [
      "Use Logistics Performance to review on-time delivery, transit duration, freight spend, and shipment exceptions.",
      "Open shipment details to inspect route, carrier, status, transit time, and freight cost.",
      "Use Exception Center to review, assign, and update supply chain exceptions in the prototype.",
    ],
  },
  {
    id: "DOC-006",
    title: "Account and Workspace Settings",
    description: "Manage regional preferences and notification options.",
    category: "Settings",
    icon: ShieldCheck,
    content: [
      "Open Settings to manage workspace name, timezone, date format, notification preferences, and display preferences.",
      "Select Save changes to confirm the current settings in the prototype session.",
      "Settings are not persisted to a server and may reset after a page refresh.",
    ],
  },
];

const faqs = [
  {
    question: "Why do dashboard values change when I apply filters?",
    answer:
      "Filters narrow the data used by the relevant dashboard metrics and tables. Some charts may intentionally show full-network context, depending on the module.",
  },
  {
    question: "How do I export report records?",
    answer:
      "Open Reports, apply any required search or filters, and select Export CSV. The downloaded file contains the report records currently displayed by the filters.",
  },
  {
    question: "Can I restore my settings?",
    answer:
      "Open Settings and select Restore defaults. Save changes when you want to confirm the restored configuration. Settings currently exist only in local prototype state.",
  },
  {
    question: "Why are some records marked as illustrative?",
    answer:
      "This application is a portfolio prototype using sample data. It is not connected to live supply chain, ERP, inventory, or transportation systems.",
  },
  {
    question: "Do support requests reach a real support team?",
    answer:
      "No. The support form demonstrates the expected workflow locally. Submitted requests appear in the prototype request list and are not sent to an external team.",
  },
];

const initialRequests: SupportRequest[] = [
  {
    id: "SUP-1024",
    subject: "Inventory figures clarification",
    category: "Dashboard question",
    status: "In Progress",
    date: "Oct 11, 2026",
    description:
    "Need clarification on the inventory figures displayed in the Inventory Intelligence dashboard.",
  },
  {
    id: "SUP-1023",
    subject: "Report export assistance",
    category: "Reports",
    status: "Resolved",
      date: "Oct 09, 2026",
    description:
    "Need clarification on the inventory figures displayed in the Inventory Intelligence dashboard.",
  },
  {
    id: "SUP-1022",
    subject: "Shipment status question",
    category: "Logistics",
    status: "Open",
      date: "Oct 08, 2026",
    description:
    "Need clarification on the inventory figures displayed in the Inventory Intelligence dashboard.",
  },
];

const requestCategories = [
  "Dashboard question",
  "Reports",
  "Inventory",
  "Logistics",
  "Account & Settings",
  "Technical issue",
  "Other",
];

export function HelpSupportDashboard() {
  const [query, setQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [requests, setRequests] = useState(initialRequests);
  const [activeRequest, setActiveRequest] =
  useState<SupportRequest | null>(null);
  const [subject, setSubject] = useState("");
  const [requestCategory, setRequestCategory] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);

  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return articles;

    return articles.filter((article) =>
      `${article.title} ${article.description} ${article.category} ${article.content.join(" ")}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  function submitRequest() {
    if (!subject.trim() || !requestCategory || !description.trim()) {
      setFormError("Complete the subject, category, and description.");
      return;
    }

    const newRequest: SupportRequest = {
      id: `SUP-${1025 + requests.length - initialRequests.length}`,
      subject: subject.trim(),
      category: requestCategory,
      status: "Open",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      }),
      description: description.trim(),
    };

    setRequests((current) => [newRequest, ...current]);
    setSubject("");
    setRequestCategory("");
    setDescription("");
    setFormError("");
    setShowContactForm(false);
    setNotice(`${newRequest.id} created in the prototype.`);
  }

  return (
    <main className="mx-auto max-w-[1540px] space-y-6 px-4 pb-10 pt-7 sm:px-6 lg:px-8">
      {/*<div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span>Workspace</span>
        <ArrowRight className="size-3" />
        <span className="text-foreground">Help &amp; Support</span>
      </div>*/}

      <div>
  <h1 className="[25px] font-semibold leading-tight sm:text-[27px]">
    Help &amp; Support
  </h1>
  <p className="mt-2 text-sm text-muted-foreground">
    Find answers, explore resources, and get help with your workspace.
  </p>
</div>

      <section className="rounded-md border border-border bg-card px-5 py-7 sm:px-8 sm:py-9">
        <div className="mx-auto max-w-[720px] text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-md bg-info-subtle text-info">
            <LifeBuoy className="size-5" />
          </span>
          <h1 className="mt-4 text-[25px] font-semibold leading-tight sm:text-[28px]">
            How can we help?
          </h1>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">
            Find answers, learn how to use your workspace, or get help with a
            supply chain dashboard.
          </p>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search help articles"
              placeholder="Search help articles, guides, and FAQs..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 pl-10"
            />
          </div>
          <p className="mt-2 text-left text-[11px] text-muted-foreground">
            Search guides for dashboards, reports, inventory, logistics, and settings.
          </p>
        </div>
      </section>

      {notice && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm"
        >
          <CheckCircle2 className="size-4 text-positive" />
          {notice}
          <button
            type="button"
            className="ml-auto text-xs underline"
            onClick={() => setNotice("")}
          >
            Dismiss
          </button>
        </div>
      )}

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">
            {query.trim() ? "Search results" : "Help resources"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {query.trim()
              ? `${filteredArticles.length} matching articles`
              : "Guides to help you get the most out of your workspace."}
          </p>
        </div>

        {filteredArticles.length ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => {
              const Icon = article.icon;

              return (
                <button
                  type="button"
                  key={article.id}
                  onClick={() => setActiveArticle(article)}
                  className="group flex h-full min-h-[150px] flex-col rounded-md border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-muted/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-9 place-items-center rounded-sm bg-info-subtle text-info">
                      <Icon className="size-4" />
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <p className="mt-4 text-sm font-semibold">{article.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {article.description}
                  </p>
                  <span className="mt-3 text-[10px] font-medium text-info">
                    {article.category}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-md border border-border bg-card px-4 py-10 text-center">
            <Search className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">No matching help articles</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different search term.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => setQuery("")}
            >
              Clear search
            </Button>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <CircleHelp className="size-4 text-info" />
              <h2 className="text-base font-semibold">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Quick answers to common workspace questions.
            </p>
          </div>

          <div className="divide-y divide-border">
            {faqs.map((faq, index) => {
              const expanded = expandedFaq === index;

              return (
                <div key={faq.question} className="px-4 sm:px-5">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpandedFaq(expanded ? null : index)}
                    className="flex min-h-12 w-full items-center justify-between gap-3 py-3 text-left"
                  >
                    <span className="text-xs font-medium">{faq.question}</span>
                    <ChevronDown
                      className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expanded && (
                    <p className="pb-4 pr-5 text-xs leading-5 text-muted-foreground">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-4 text-info" />
              <h2 className="text-base font-semibold">Contact Support</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Create a support request for your issue or question.
            </p>
          </div>

          {!showContactForm ? (
            <div className="flex min-h-[250px] flex-col items-start justify-center px-5 py-6">
              <span className="grid size-10 place-items-center rounded-sm bg-info-subtle text-info">
                <MessageCircle className="size-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold">
                Need additional assistance?
              </h3>
              <p className="mt-2 max-w-[360px] text-xs leading-5 text-muted-foreground">
                Describe your question and create a support request to
                demonstrate the support workflow.
              </p>
              <Button
                className="mt-5"
                size="sm"
                onClick={() => {
                  setShowContactForm(true);
                  setNotice("");
                }}
              >
                Create support request
                <ArrowRight className="ml-2 size-3.5" />
              </Button>
              <p className="mt-3 text-[10px] text-muted-foreground">
                Prototype only · No external ticket is created
              </p>
            </div>
          ) : (
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-xs font-medium" htmlFor="support-subject">
                  Subject
                </label>
                <Input
                  id="support-subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Briefly describe your issue"
                  maxLength={120}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium">
                  Category
                </label>
                <Select
                  value={requestCategory}
                  onValueChange={setRequestCategory}
                >
                  <SelectTrigger aria-label="Support request category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {requestCategories.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium" htmlFor="support-description">
                  Description
                </label>
                <Textarea
                  id="support-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Include details that will help explain the issue..."
                  rows={4}
                  maxLength={1500}
                />
                <p className="mt-1 text-right text-[10px] text-muted-foreground">
                  {description.length}/1500
                </p>
              </div>

              {formError && (
                <p role="alert" className="text-xs text-critical">
                  {formError}
                </p>
              )}

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowContactForm(false);
                    setFormError("");
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={submitRequest}>
                  <Send className="mr-2 size-3.5" />
                  Submit request
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-md border border-border bg-card">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Support Requests</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Review the status of your recent prototype requests.
            </p>
          </div>
          <span className="rounded-sm bg-secondary px-2 py-1 text-[11px]">
            {requests.length} requests
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-xs">
            <thead>
              <tr className="h-10 border-b border-border bg-muted/35 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                <th className="px-4">Request</th>
                <th className="px-3">Category</th>
                <th className="px-3">Created</th>
                <th className="px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((request) => (
                
<tr
  key={request.id}
  onClick={() => setActiveRequest(request)}
  onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveRequest(request);
    }
  }}
  tabIndex={0}
  role="button"
  aria-label={`View request ${request.id}: ${request.subject}`}
  className="h-[58px] cursor-pointer hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
>
  <td className="px-4">
    <p className="font-medium">{request.subject}</p>
    <p className="mt-1 text-[10px] text-muted-foreground">
      {request.id}
    </p>
  </td>
  <td className="px-3">{request.category}</td>
  <td className="px-3">{request.date}</td>
  <td className="px-3">
    <RequestStatus status={request.status} />
  </td>
</tr>

              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 py-3 text-[10px] text-muted-foreground">
          Illustrative requests · Stored locally in the current session
        </div>
      </section>

      <p className="text-[11px] text-muted-foreground">
        Help content and support requests are illustrative prototype data.
      </p>

      {activeArticle && (
        <ArticleDialog
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
        />
          )}
          {activeRequest && (
  <RequestDetailsDialog
    request={activeRequest}
    onClose={() => setActiveRequest(null)}
  />
)}
    </main>
  );
}

function ArticleDialog({
  article,
  onClose,
}: {
  article: Article;
  onClose: () => void;
}) {
  const Icon = article.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-title"
        className="w-full max-w-[560px] rounded-md border border-border bg-card shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3 border-b border-border p-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-info-subtle text-info">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-info">
              {article.category}
            </p>
            <h2 id="article-title" className="mt-1 text-base font-semibold">
              {article.title}
            </h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {article.description}
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {article.content.map((paragraph, index) => (
            <div key={paragraph} className="flex items-start gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-medium">
                {index + 1}
              </span>
              <p className="text-sm leading-6">{paragraph}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end border-t border-border p-4">
          <Button size="sm" onClick={onClose}>
            Close article
          </Button>
        </div>
      </section>
    </div>
  );
}


function RequestDetailsDialog({
  request,
  onClose,
}: {
  request: SupportRequest;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-details-title"
        className="h-full w-full max-w-[480px] overflow-y-auto border-l border-border bg-card shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-info">
              Support request · {request.id}
            </p>
            <h2
              id="request-details-title"
              className="mt-2 text-lg font-semibold"
            >
              {request.subject}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Created {request.date}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close request details"
          >
            Close
          </Button>
        </div>

        <div className="space-y-6 p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <div className="mt-2">
                <RequestStatus status={request.status} />
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="mt-2 text-sm font-medium">
                {request.category}
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="text-sm font-semibold">Request description</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {request.description}
            </p>
          </div>

          <div className="rounded-md border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-medium">Request activity</h3>
            <div className="mt-3 flex items-start gap-3">
              <Clock3 className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium">
                  Request created
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {request.date}
                </p>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
              Activity history and support-team replies are not connected
              in this prototype.
            </p>
          </div>
        </div>

        <div className="border-t border-border p-4 text-right">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close details
          </Button>
        </div>
      </section>
    </div>
  );
}

function RequestStatus({
  status,
}: {
  status: SupportRequest["status"];
}) {
  const className =
    status === "Resolved"
      ? "bg-positive/10 text-positive"
      : status === "In Progress"
        ? "bg-info-subtle text-info"
        : "bg-warning/10 text-warning";

  const Icon = status === "Resolved" ? CheckCircle2 : Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[10px] font-medium ${className}`}
    >
      <Icon className="size-3" />
      {status}
    </span>
  );
}

