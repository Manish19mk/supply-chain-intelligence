
import { useState } from "react";
import { UserRound, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MyProfileDashboard() {
  const [name, setName] = useState("Morgan Carter");
  const [email, setEmail] = useState("morgan.carter@example.com");
  const [jobTitle, setJobTitle] = useState("Supply Chain Manager");
  const [department, setDepartment] = useState("Supply Chain Operations");

  const [savedProfile, setSavedProfile] = useState({
    name: "Morgan Carter",
    email: "morgan.carter@example.com",
    jobTitle: "Supply Chain Manager",
    department: "Supply Chain Operations",
  });

  const [notice, setNotice] = useState("");

  function saveProfile() {
    setSavedProfile({ name, email, jobTitle, department });
    setNotice("Profile changes saved for this session.");
  }

  function discardChanges() {
    setName(savedProfile.name);
    setEmail(savedProfile.email);
    setJobTitle(savedProfile.jobTitle);
    setDepartment(savedProfile.department);
    setNotice("Unsaved changes discarded.");
  }

  const fields = [
    {
      label: "Full name",
      value: name,
      setter: setName,
      type: "text",
    },
    {
      label: "Email address",
      value: email,
      setter: setEmail,
      type: "email",
    },
    {
      label: "Job title",
      value: jobTitle,
      setter: setJobTitle,
      type: "text",
    },
    {
      label: "Department",
      value: department,
      setter: setDepartment,
      type: "text",
    },
  ];

  return (
    <main className="mx-auto max-w-[1540px] space-y-6 px-4 pb-10 pt-7 sm:px-6 lg:px-8">
      <div className="text-xs font-medium text-muted-foreground">
        Workspace / My Profile
      </div>

      <section className="rounded-md border border-border bg-card p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid size-16 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <UserRound className="size-7" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold">{name || "Your profile"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {jobTitle || "Job title not set"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Workspace account · Active
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold">Personal information</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            View and update your profile details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
          {fields.map((field) => (
            <div key={field.label} className="space-y-2">
              <label className="block text-xs font-medium">
                {field.label}
              </label>
              <Input
                type={field.type}
                value={field.value}
                onChange={(event) => {
                  field.setter(event.target.value);
                  setNotice("");
                }}
                maxLength={120}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
          <p role="status" className="text-xs text-muted-foreground">
            {notice || "Changes are kept in local prototype state."}
          </p>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={discardChanges}>
              <RotateCcw className="mr-2 size-3.5" />
              Discard changes
            </Button>
            <Button size="sm" onClick={saveProfile}>
              <Save className="mr-2 size-3.5" />
              Save changes
            </Button>
          </div>
        </div>
      </section>

      <p className="text-[11px] text-muted-foreground">
        Illustrative profile data. Changes are not saved to a server and may
        reset after a page refresh.
      </p>
    </main>
  );
}
