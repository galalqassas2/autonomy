"use client";

import { useMemo, useState } from "react";
import { Icon as IconifyIcon } from "@iconify/react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const tools = [
  ["Slack", "logos:slack-icon"], ["Google Sheets", "logos:google-sheets"], ["Notion", "logos:notion-icon"], ["QuickBooks", "logos:quickbooks"],
  ["HubSpot", "logos:hubspot"], ["Gmail", "logos:google-gmail"], ["Shopify", "logos:shopify"], ["Zendesk", "logos:zendesk-icon"],
  ["Stripe", "logos:stripe"], ["Microsoft Teams", "logos:microsoft-teams"], ["Airtable", "logos:airtable"], ["Trello", "logos:trello"],
  ["Dropbox", "logos:dropbox"], ["GitHub", "logos:github-icon"], ["Jira", "logos:jira"], ["Salesforce", "logos:salesforce"],
] as const;

export function Constellation() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => tools.filter(([name]) => name.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  return (
    <div className="mt-12">
      <div className="mx-auto max-w-xl">
        <label htmlFor="tool-search" className="mb-2 block text-sm font-semibold text-ink">Search connected tools</label>
        <div className="relative">
          <Icon name="magnifying-glass" size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <Input id="tool-search" name="tool-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Slack, invoices, or your CRM…" autoComplete="off" className="pl-11 pr-11" />
          {query && <button onClick={() => setQuery("")} className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-[10px] text-muted hover:bg-surface hover:text-ink" aria-label="Clear search"><Icon name="x" size={18} aria-hidden /></button>}
        </div>
        <p className="mt-2 text-sm text-muted" aria-live="polite">{matches.length} of {tools.length} example tools match{query ? ` “${query}”` : ""}.</p>
      </div>

      {matches.length === 0 ? (
        <div className="mx-auto mt-12 flex max-w-md flex-col items-center rounded-[16px] border border-hairline bg-white p-8 text-center">
          <span className="grid size-12 place-items-center rounded-[14px] bg-surface text-muted"><Icon name="magnifying-glass-minus-duotone" size={26} aria-hidden /></span>
          <h3 className="mt-4 text-lg font-semibold text-ink">No example tools match “{query}”.</h3>
          <p className="mt-2 text-sm leading-6 text-body">If it has an API or webhook, it may still connect. Clear the search to keep browsing.</p>
          <Button variant="secondary" size="sm" className="mt-5" onClick={() => setQuery("")}>Clear search</Button>
        </div>
      ) : (
        <div className="group/constellation relative mx-auto mt-10 min-h-[560px] max-w-[980px] overflow-hidden rounded-[20px] border border-hairline bg-white [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] max-md:min-h-0 max-md:border-0 max-md:bg-transparent max-md:[mask-image:none]">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:hidden">
            {matches.map(([name, icon]) => (
              <div key={name} className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-[13px] border border-hairline bg-white p-2 text-center">
                <IconifyIcon icon={icon} width={21} height={21} aria-hidden="true" /><span className="text-[0.68rem] font-semibold leading-4 text-body">{name}</span>
              </div>
            ))}
          </div>
          <div className="absolute left-1/2 top-1/2 hidden size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-hairline md:block" />
          <div className="absolute left-1/2 top-1/2 hidden size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-hairline md:block" />
          <div className="absolute left-1/2 top-1/2 z-[2] hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 rounded-[18px] border border-hairline bg-white p-5 shadow-[0_18px_36px_-20px_rgba(12,21,18,0.25)] md:flex"><BrandMark className="size-11" /><strong className="text-sm font-semibold text-ink">Autonomy</strong></div>
          <div className="absolute inset-[17%] hidden animate-[spin_110s_linear_infinite] group-hover/constellation:[animation-play-state:paused] md:block">
            {matches.slice(0, 8).map(([name, icon], index) => <ToolChip key={name} name={name} icon={icon} index={index} ring="inner" />)}
          </div>
          <div className="absolute inset-[5%] hidden animate-[spin_140s_linear_infinite_reverse] group-hover/constellation:[animation-play-state:paused] md:block">
            {matches.slice(8).map(([name, icon], index) => <ToolChip key={name} name={name} icon={icon} index={index} ring="outer" />)}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolChip({ name, icon, index, ring }: { name: string; icon: string; index: number; ring: "inner" | "outer" }) {
  const angle = index * 45;
  return (
    <div className={cn("orbit-chip absolute left-1/2 top-1/2 flex min-h-11 items-center justify-center whitespace-nowrap rounded-[13px] border border-hairline bg-white px-3 text-left shadow-[0_8px_18px_-16px_rgba(12,21,18,0.32)]")} style={{ "--angle": `${angle}deg`, "--angle-neg": `${-angle}deg`, "--distance": `${ring === "inner" ? 175 : 260}px` } as React.CSSProperties}>
      <span className={cn("flex items-center gap-2 group-hover/constellation:[animation-play-state:paused]", ring === "inner" ? "animate-[spin_110s_linear_infinite_reverse]" : "animate-[spin_140s_linear_infinite]")}>
        <IconifyIcon icon={icon} width={19} height={19} aria-hidden="true" /><span className="text-xs font-semibold text-body">{name}</span>
      </span>
    </div>
  );
}

export { tools };
