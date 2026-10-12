
import { useState } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  RotateCcw,
  Save,
  Settings2,
  SlidersHorizontal,
  UserRound,
  Building2,
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
import { Switch } from "@/components/ui/switch";

type Preferences = {
  workspaceName: string;
  timezone: string;
  dateFormat: string;
  tableDensity: string;
  emailExceptions: boolean;
  emailReports: boolean;
  emailWeeklySummary: boolean;
  inAppExceptions: boolean;
  inAppReports: boolean;
};

const defaultPreferences: Preferences = {
  workspaceName: "Supply Chain Intelligence",
  timezone: "Asia/Kolkata",
  dateFormat: "DD MMM YYYY",
  tableDensity: "Comfortable",
  emailExceptions: true,
  emailReports: true,
  emailWeeklySummary: false,
  inAppExceptions: true,
  inAppReports: true,
};

export function SettingsDashboard() {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [savedPreferences, setSavedPreferences] =
    useState<Preferences>(defaultPreferences);
  const [activeSection, setActiveSection] = useState("General");
  const [notice, setNotice] = useState("");

  function updatePreference<K extends keyof Preferences>(
    key: K,
    value: Preferences[K],
  ) {
    setPreferences((current) => ({ ...current, [key]: value }));
    setNotice("");
  }

  function saveChanges() {
    setSavedPreferences({ ...preferences });
    setNotice("Your settings have been saved for this session.");
  }

  function resetChanges() {
    setPreferences({ ...savedPreferences });
    setNotice("Unsaved changes have been reset.");
  }

  function restoreDefaults() {
    setPreferences({ ...defaultPreferences });
    setNotice("Default settings restored. Select Save Changes to confirm.");
  }

  const sections = [
    { label: "General", icon: Settings2 },
    { label: "Notifications", icon: Bell },
    { label: "Display", icon: SlidersHorizontal },
    { label: "Workspace", icon: Building2 },
  ];

  return (
    <main className="mx-auto max-w-[1540px] space-y-6 px-4 pb-10 pt-7 sm:px-6 lg:px-8">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span>Workspace</span>
        <ArrowRight className="size-3" />
        <span className="text-foreground">Settings</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[25px] font-semibold leading-tight sm:text-[27px]">
            Settings
          </h1>
          <p className="mt-2 max-w-[780px] text-sm leading-5 text-muted-foreground">
            Manage your workspace preferences, notifications, and display options.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetChanges}>
            <RotateCcw className="mr-2 size-3.5" />
            Reset changes
          </Button>
          <Button size="sm" onClick={saveChanges}>
            <Save className="mr-2 size-3.5" />
            Save changes
          </Button>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm"
        >
          <Check className="size-4 text-positive" />
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <nav
          aria-label="Settings sections"
          className="rounded-md border border-border bg-card p-2"
        >
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Preferences
          </p>
          {sections.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveSection(label)}
              className={`flex min-h-10 w-full items-center gap-3 rounded-sm px-3 text-left text-sm transition-colors ${
                activeSection === label
                  ? "bg-info-subtle font-medium text-info"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 space-y-5">
          {activeSection === "General" && (
            <SettingsPanel
              title="General preferences"
              description="Configure the default regional settings for your workspace."
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Workspace name">
                  <Input
                    value={preferences.workspaceName}
                    onChange={(event) =>
                      updatePreference("workspaceName", event.target.value)
                    }
                    className="h-9"
                  />
                </Field>
                <Field label="Timezone">
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) => updatePreference("timezone", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">
                        India Standard Time (UTC+05:30)
                      </SelectItem>
                      <SelectItem value="UTC">UTC (UTC+00:00)</SelectItem>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        United Kingdom Time
                      </SelectItem>
                      <SelectItem value="Asia/Singapore">
                        Singapore Time
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Date format">
                  <Select
                    value={preferences.dateFormat}
                    onValueChange={(value) =>
                      updatePreference("dateFormat", value)
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD MMM YYYY">12 Oct 2026</SelectItem>
                      <SelectItem value="MM/DD/YYYY">10/12/2026</SelectItem>
                      <SelectItem value="YYYY-MM-DD">2026-10-12</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </SettingsPanel>
          )}

          {activeSection === "Notifications" && (
            <SettingsPanel
              title="Notification preferences"
              description="Choose which supply chain updates you want to receive."
            >
              <div className="space-y-1">
                <p className="mb-3 text-xs font-semibold text-foreground">
                  Email notifications
                </p>
                <PreferenceRow
                  title="Critical exceptions"
                  description="Receive updates when critical supply chain exceptions occur."
                  checked={preferences.emailExceptions}
                  onChange={(value) =>
                    updatePreference("emailExceptions", value)
                  }
                />
                <PreferenceRow
                  title="Report completion"
                  description="Get notified when a report is ready to access."
                  checked={preferences.emailReports}
                  onChange={(value) => updatePreference("emailReports", value)}
                />
                <PreferenceRow
                  title="Weekly summary"
                  description="Receive a weekly overview of supply chain performance."
                  checked={preferences.emailWeeklySummary}
                  onChange={(value) =>
                    updatePreference("emailWeeklySummary", value)
                  }
                />
              </div>
              <div className="mt-6 border-t border-border pt-5">
                <p className="mb-3 text-xs font-semibold text-foreground">
                  In-app notifications
                </p>
                <PreferenceRow
                  title="Exception updates"
                  description="Show exception alerts in your notification center."
                  checked={preferences.inAppExceptions}
                  onChange={(value) =>
                    updatePreference("inAppExceptions", value)
                  }
                />
                <PreferenceRow
                  title="Report updates"
                  description="Show report generation and scheduling updates."
                  checked={preferences.inAppReports}
                  onChange={(value) => updatePreference("inAppReports", value)}
                />
              </div>
            </SettingsPanel>
          )}

          {activeSection === "Display" && (
            <SettingsPanel
              title="Display preferences"
              description="Adjust how information is presented in the workspace."
            >
              <Field label="Table density">
                <Select
                  value={preferences.tableDensity}
                  onValueChange={(value) =>
                    updatePreference("tableDensity", value)
                  }
                >
                  <SelectTrigger className="h-9 sm:max-w-[320px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Compact">Compact</SelectItem>
                    <SelectItem value="Comfortable">Comfortable</SelectItem>
                    <SelectItem value="Spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Prototype preference; it does not yet change other dashboard tables.
                </p>
              </Field>
            </SettingsPanel>
          )}

          {activeSection === "Workspace" && (
            <>
              <SettingsPanel
                title="Workspace information"
                description="Overview of your current workspace."
              >
                <InfoRow
                  label="Workspace"
                  value={preferences.workspaceName || "Not configured"}
                />
                <InfoRow label="Workspace type" value="Supply Chain Analytics" />
                <InfoRow label="Environment" value="Prototype" />
                <InfoRow label="Data connection" value="Illustrative sample data" />
              </SettingsPanel>
              <SettingsPanel
                title="Account"
                description="Your current prototype account details."
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-full bg-info-subtle text-info">
                    <UserRound className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Morgan Carter</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Supply Chain Manager
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-[11px] text-muted-foreground">
                  Account details are sample information for this prototype.
                </p>
              </SettingsPanel>
            </>
          )}

          <div className="flex justify-start border-t border-border pt-4">
  <Button variant="ghost" size="sm" onClick={restoreDefaults}>
    Restore defaults
  </Button>
</div>
        </div>
      </div>
    </main>
  );
}

function SettingsPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-md border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-xs font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 max-w-[560px] text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-3 last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
