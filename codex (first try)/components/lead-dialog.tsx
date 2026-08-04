"use client";

import { createContext, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  emptyLeadFields,
  type LeadField,
  type LeadFields,
  validateLeadField,
  validateLeadFields,
} from "@/lib/lead";

type LeadContextValue = { open: () => void };
const LeadContext = createContext<LeadContextValue | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState<LeadFields>(emptyLeadFields);
  const [errors, setErrors] = useState<Partial<LeadFields>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [showSpinner, setShowSpinner] = useState(false);
  const context = useMemo(() => ({ open: () => setIsOpen(true) }), []);

  useEffect(() => {
    if (status !== "submitting") {
      setShowSpinner(false);
      return;
    }
    const timer = window.setTimeout(() => setShowSpinner(true), 300);
    return () => window.clearTimeout(timer);
  }, [status]);

  function updateField(name: LeadField, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: validateLeadField(name, value) }));
    if (status === "error") setStatus("idle");
  }

  function validateAll() {
    const next = validateLeadFields(fields);
    setErrors(next);
    return Object.keys(next)[0] as LeadField | undefined;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstInvalid = validateAll();
    if (firstInvalid) {
      window.requestAnimationFrame(() => document.getElementById(firstInvalid)?.focus());
      return;
    }
    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!response.ok) throw new Error("Lead request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setFields(emptyLeadFields);
    setErrors({});
    setStatus("idle");
  }

  return (
    <LeadContext.Provider value={context}>
      {children}
      <Dialog open={isOpen} onOpenChange={(next) => { setIsOpen(next); if (!next && status === "success") reset(); }}>
        <DialogContent>
          {status === "success" ? (
            <div className="flex min-h-[24rem] flex-col items-center justify-center gap-5 py-6 text-center" role="status" aria-live="polite">
              <span className="grid size-16 place-items-center rounded-[18px] bg-brand-tint text-brand-strong">
                <Icon name="check-circle-duotone" size={34} aria-hidden />
              </span>
              <DialogTitle>We have your process.</DialogTitle>
              <DialogDescription className="mx-auto">
                We will review the work, the tools involved, and the clearest way to remove the repetition.
              </DialogDescription>
              <Button type="button" onClick={() => setIsOpen(false)}>Done</Button>
            </div>
          ) : (
            <>
              <div className="pr-12">
                <p className="kicker">Start here</p>
                <DialogTitle>Tell us what repeats.</DialogTitle>
                <DialogDescription className="mt-3">
                  Three details are enough to start. Required fields are marked below.
                </DialogDescription>
              </div>
              <form className="flex flex-col gap-5" onSubmit={submit} noValidate aria-busy={status === "submitting"}>
                <Field
                  id="process"
                  label="What process?"
                  value={fields.process}
                  error={errors.process}
                  onChange={(value) => updateField("process", value)}
                  onBlur={() => setErrors((current) => ({ ...current, process: validateLeadField("process", fields.process) }))}
                  placeholder="For example, invoice follow-up…"
                />
                <Field
                  id="tools"
                  label="Which tools?"
                  value={fields.tools}
                  error={errors.tools}
                  onChange={(value) => updateField("tools", value)}
                  onBlur={() => setErrors((current) => ({ ...current, tools: validateLeadField("tools", fields.tools) }))}
                  placeholder="For example, QuickBooks and Outlook…"
                />
                <Field
                  id="contact"
                  label="How should we reach you?"
                  value={fields.contact}
                  error={errors.contact}
                  onChange={(value) => updateField("contact", value)}
                  onBlur={() => setErrors((current) => ({ ...current, contact: validateLeadField("contact", fields.contact) }))}
                  placeholder="name@company.com or +353…"
                />
                {status === "error" && (
                  <div className="flex items-start gap-3 rounded-[12px] border border-running/40 bg-running-tint p-4 text-sm leading-6 text-running-strong" role="alert">
                    <Icon name="warning-circle" size={20} aria-hidden />
                    <div>
                      <strong className="block font-semibold">Your request did not send.</strong>
                      Your details are still here. Check your connection, then try again.
                    </div>
                  </div>
                )}
                <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-5 text-muted">We only use these details to respond to this request.</p>
                  <Button type="submit" disabled={status === "submitting"} className="min-w-[9.5rem]">
                    {status === "submitting" && showSpinner ? (
                      <><Icon name="spinner-gap" className="animate-spin" aria-hidden /> Sending…</>
                    ) : status === "submitting" ? "Sending…" : status === "error" ? "Try again" : "Send process"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </LeadContext.Provider>
  );
}

function Field({ id, label, value, error, onChange, onBlur, placeholder }: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2" data-invalid={Boolean(error)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">{label} <span className="text-brand-strong">Required</span></label>
      <Input
        id={id}
        name={id}
        value={value}
        autoComplete={id === "contact" ? "email" : "off"}
        spellCheck={id === "contact" ? false : undefined}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        required
        className={error ? "border-running-strong shadow-[0_0_0_3px_rgba(245,158,11,0.12)]" : undefined}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
      {error && <p id={errorId} className="text-sm font-medium text-running-strong">{error}</p>}
    </div>
  );
}

export function LeadButton({ children = "Start your first automation", ...props }: ButtonProps) {
  const context = useContext(LeadContext);
  if (!context) throw new Error("LeadButton must be used inside LeadProvider");
  return <Button type="button" onClick={context.open} {...props}>{children}</Button>;
}
