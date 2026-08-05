"use client";

import { CheckIcon, LightningIcon, PackageIcon, ReceiptIcon, ShoppingCartIcon, UsersThreeIcon } from "@phosphor-icons/react";

import { HoverButton } from "@/components/hover-button";
import { cn } from "@/lib/utils";

const steps = [
  { type: "Trigger", label: "Order received", icon: ShoppingCartIcon, rows: [["Source", "Store"], ["Status", "New"]] },
  { type: "Logic", label: "Check stock", icon: PackageIcon, rows: [["SKU", "Matched"], ["Quantity", "Available"]] },
  { type: "Action", label: "Write invoice", icon: ReceiptIcon, rows: [["Account", "Found"], ["Draft", "Created"]] },
  { type: "Notify", label: "Tell the team", icon: UsersThreeIcon, rows: [["Channel", "Orders"], ["Message", "Sent"]] },
];

type FlowCanvasProps = {
  activeStep?: number;
  className?: string;
  compact?: boolean;
  completed?: boolean;
  controlDisabled?: boolean;
  controlLabel?: string;
  onControl?: () => void;
  title?: string;
};

export function FlowCanvas({ activeStep = -1, className, compact = false, completed = false, controlDisabled = false, controlLabel, onControl, title = "Order to invoice" }: FlowCanvasProps) {
  const visibleSteps = compact ? steps.slice(0, 3) : steps;

  return (
    <div className={cn("flow-frame", compact && "is-compact", className)} aria-hidden={compact ? "true" : undefined}>
      <div className="flow-topbar">
        <div className="flow-title">
          <span className="automation-chip">Automation</span>
          <strong>{title}</strong>
        </div>
        {controlLabel ? <HoverButton disabled={controlDisabled} onClick={onControl}>{controlLabel}</HoverButton> : <span className="flow-demo-control">Run</span>}
      </div>
      <div className="flow-viewport">
        <div className="flow-track">
          <div className="flow-terminal">
            <LightningIcon aria-hidden="true" weight="regular" />
            <small>Flow</small>
            <strong>Start</strong>
          </div>
          {visibleSteps.map((step, index) => {
            const running = !completed && activeStep === index;
            const done = completed || activeStep > index;
            const Icon = step.icon;
            return (
              <div className="flow-segment" key={step.label}>
                <span className={cn("flow-connector", (running || done) && "is-active")} />
                <article className={cn("flow-node", running && "is-running", done && "is-done", compact && "is-looping")} style={{ "--node-index": index } as React.CSSProperties}>
                  <header>
                    <span className="node-state">{done ? <CheckIcon aria-hidden="true" weight="bold" /> : <Icon aria-hidden="true" weight="regular" />}</span>
                    <small>{step.type}</small>
                  </header>
                  <h3>{step.label}</h3>
                  <div className="node-rows">
                    {step.rows.map(([label, value]) => <span key={label}><small>{label}</small><b>{value}</b></span>)}
                  </div>
                </article>
              </div>
            );
          })}
          {!compact && (
            <div className="flow-segment">
              <span className={cn("flow-connector", completed && "is-active")} />
              <div className={cn("flow-terminal", completed && "is-done")}>
                <CheckIcon aria-hidden="true" weight="bold" />
                <small>Flow</small>
                <strong>End</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
